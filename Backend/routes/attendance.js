const express = require("express");
const router = express.Router();
const multer = require("multer");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Attendance = require("../models/attendanceSchema");
const Student = require("../models/studentSchema");
const Subject = require("../models/subjectSchema");
const Schedule = require("../models/scheduleSchema");
const Admin = require("../models/adminSchema");
const Teacher = require("../models/teacherSchema");
const Batch = require("../models/batchSchema");

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

console.log("attendance.js loaded");

// Add catch-all middleware to log every request to this router
router.use((req, res, next) => {
  console.log("Attendance route hit:", req.method, req.originalUrl);
  next();
});

// POST /api/attendance/bulk - Upload attendance via Excel
router.post("/bulk", upload.single("file"), async (req, res) => {
  try {
    const { adminId, subjectId, date } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    const addedRecords = [];
    const errors = [];

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const { enrollmentNumber, isPresent } = row;

      try {
        if (!enrollmentNumber || isPresent === undefined) {
          errors.push({
            row: i + 1,
            error: "Enrollment number and isPresent are required",
          });
          continue;
        }

        const student = await Student.findOne({
          enrollmentNumber: enrollmentNumber.trim(),
        });
        if (!student) {
          errors.push({
            row: i + 1,
            error: `Student with enrollment ${enrollmentNumber} not found`,
          });
          continue;
        }

        const subject = await Subject.findById(subjectId);
        if (!subject) {
          errors.push({
            row: i + 1,
            error: `Subject with ID ${subjectId} not found`,
          });
          continue;
        }

        let classId = null;
        if (req.body.classId) {
          const schedule = await Schedule.findById(req.body.classId);
          if (!schedule) {
            errors.push({
              row: i + 1,
              error: `Schedule with ID ${req.body.classId} not found`,
            });
            continue;
          }
          classId = schedule._id;
        }

        // Use IST for the attendance date
        const attendanceDate = date
          ? moment.tz(date, "Asia/Kolkata").toDate()
          : moment().tz("Asia/Kolkata").toDate();
        attendanceDate.setHours(0, 0, 0, 0);

        const existingRecord = await Attendance.findOne({
          student: student._id,
          "attendanceEntries.subject": subjectId,
          "attendanceEntries.date": attendanceDate,
        });
        if (existingRecord) {
          errors.push({
            row: i + 1,
            error: `Attendance record already exists for student ${enrollmentNumber} on this date`,
          });
          continue;
        }

        const newEntry = {
          subject: subjectId,
          classId,
          date: attendanceDate,
          isPresent: !!isPresent,
        };

        const attendanceRecord = await Attendance.findOneAndUpdate(
          { student: student._id },
          {
            $push: { attendanceEntries: newEntry },
          },
          { upsert: true, new: true }
        );

        addedRecords.push({ studentId: student._id, ...newEntry });
      } catch (error) {
        errors.push({ row: i + 1, error: error.message });
      }
    }

    if (addedRecords.length > 0) {
      await Subject.findByIdAndUpdate(subjectId, {
        $inc: { totalLectures: 1 },
      });
    }

    res.status(201).json({
      message: `${addedRecords.length} attendance records added successfully`,
      addedRecords,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (err) {
    console.error("Error in bulk attendance upload:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/attendance - Fetch attendance records
router.get("/", async (req, res) => {
  try {
    const { studentId, subjectId, date, adminId } = req.query;

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const query = {};
    if (studentId) query.student = studentId;
    if (subjectId || date) {
      query.attendanceEntries = {
        $elemMatch: {},
      };
      if (subjectId) query.attendanceEntries.$elemMatch.subject = subjectId;
      if (date)
        query.attendanceEntries.$elemMatch.date = moment
          .tz(date, "Asia/Kolkata")
          .startOf("day")
          .toDate();
    }

    const records = await Attendance.find(query)
      .populate("student", "name enrollmentNumber")
      .populate("attendanceEntries.subject", "name")
      .populate("attendanceEntries.classId", "time room")
      .lean();

    // Flatten the attendanceEntries for response
    const flattenedRecords = records.flatMap((record) =>
      (record.attendanceEntries || [])
        .filter((entry) => {
          if (subjectId && entry.subject._id.toString() !== subjectId)
            return false;
          if (
            date &&
            entry.date.getTime() !==
            moment.tz(date, "Asia/Kolkata").startOf("day").toDate().getTime()
          )
            return false;
          return true;
        })
        .map((entry) => ({
          student: record.student,
          subject: entry.subject,
          classId: entry.classId,
          date: entry.date,
          isPresent: entry.isPresent,
        }))
    );

    res.status(200).json(flattenedRecords);
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/attendance/students - Fetch students for attendance
router.get("/students", async (req, res) => {
  try {
    const { teacherId, batchId, subjectId, classId, date } = req.query;

    // Validate teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    // Validate schedule (classId)
    const schedule = await Schedule.findById(classId).populate("batch subject");
    if (!schedule) {
      return res.status(400).json({ message: "Schedule not found" });
    }

    // Ensure the schedule belongs to the teacher
    if (schedule.teacher.toString() !== teacherId) {
      return res
        .status(403)
        .json({ message: "Teacher not authorized for this class" });
    }

    // Use batchId and subjectId from schedule if not provided
    const effectiveBatchId = batchId || schedule.batch._id;
    const effectiveSubjectId = subjectId || schedule.subject._id;

    // Validate batch and subject
    const batch = await Batch.findById(effectiveBatchId);
    if (!batch) {
      return res.status(400).json({ message: "Batch not found" });
    }

    const subject = await Subject.findById(effectiveSubjectId);
    if (!subject) {
      return res.status(400).json({ message: "Subject not found" });
    }

    // Fetch students in the batch
    const students = await Student.find({ batchRef: effectiveBatchId })
      .select("name enrollmentNumber rollNumber")
      .lean();

    // FIX: Properly handle date conversion
    let attendanceDate;
    if (date) {
      // If date is provided as string (YYYY-MM-DD), treat it as IST
      attendanceDate = moment.tz(date, "Asia/Kolkata").startOf('day').toDate();
    } else {
      // Use current IST date
      attendanceDate = moment.tz("Asia/Kolkata").startOf('day').toDate();
    }

    console.log("Fetching attendance for date:", attendanceDate);
    console.log("Fetching attendance for classId:", classId);
    console.log("Fetching attendance for class time:", schedule.time);

    // FIXED: Fetch existing attendance for the specific class, date, subject, and time
    const attendanceRecords = await Attendance.find({
      student: { $in: students.map((s) => s._id) },
      "attendanceEntries.date": attendanceDate,
      "attendanceEntries.subject": effectiveSubjectId,
      "attendanceEntries.classId": classId,
      "attendanceEntries.time": schedule.time
    }).lean();

    console.log("Found attendance records:", attendanceRecords.length);

    // Map attendance status to students for this specific class
    const studentsWithAttendance = students.map((student) => {
      const attendance = attendanceRecords.find(
        (record) =>
          record.student.toString() === student._id.toString() &&
          record.attendanceEntries.some(
            (entry) =>
              entry.date.getTime() === attendanceDate.getTime() &&
              entry.subject.toString() === effectiveSubjectId.toString() &&
              entry.classId?.toString() === classId.toString() &&
              entry.time === schedule.time
          )
      );

      const entry = attendance?.attendanceEntries.find(
        (e) =>
          e.date.getTime() === attendanceDate.getTime() &&
          e.subject.toString() === effectiveSubjectId.toString() &&
          e.classId?.toString() === classId.toString() &&
          e.time === schedule.time
      );

      return {
        ...student,
        isPresent: entry ? entry.isPresent : null,
      };
    });

    res.status(200).json(studentsWithAttendance);
  } catch (err) {
    console.error("Error fetching students for attendance:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// POST /api/attendance/save - Save attendance records
router.post("/save", async (req, res) => {
  try {
    const { classId, subjectId, date, students } = req.body;

    // Validate inputs
    if (!classId || !subjectId || !students || !Array.isArray(students)) {
      return res.status(400).json({
        message: "classId, subjectId, and students (as an array) are required",
      });
    }

    // Validate schedule
    const schedule = await Schedule.findById(classId);
    if (!schedule) {
      return res.status(400).json({ message: "Schedule not found" });
    }

    // Validate subject
    const subject = await Subject.findById(subjectId);
    if (!subject) {
      return res.status(400).json({ message: "Subject not found" });
    }

    // FIX: Properly handle IST date conversion
    let attendanceDate;
    if (date) {
      // If date is provided, ensure it's treated as IST
      if (typeof date === 'string') {
        // If it's a string like "2025-07-16", treat it as IST
        attendanceDate = moment.tz(date, "Asia/Kolkata").startOf('day').toDate();
      } else {
        // If it's already a Date object, convert from UTC to IST
        attendanceDate = moment.tz(date, "Asia/Kolkata").startOf('day').toDate();
      }
    } else {
      // Use current IST date
      attendanceDate = moment.tz("Asia/Kolkata").startOf('day').toDate();
    }

    console.log("Attendance date being saved:", attendanceDate);

    const addedRecords = [];
    const errors = [];

    for (const { studentId, isPresent } of students) {
      try {
        // Validate student
        const student = await Student.findById(studentId);
        if (!student) {
          errors.push({ studentId, error: "Student not found" });
          continue;
        }

        // Fetch the schedule to get the time
        const schedule = await Schedule.findById(classId);
        if (!schedule) {
          errors.push({ studentId, error: "Schedule not found" });
          continue;
        }
        const classTime = schedule.time;

        // Check for existing record for this student, subject, date, classId, and time
        const existingRecord = await Attendance.findOne({
          student: studentId,
          attendanceEntries: {
            $elemMatch: {
              subject: subjectId,
              date: attendanceDate,
              classId: classId,
              time: classTime,
            },
          },
        });

        if (existingRecord) {
          // Update the existing entry for this specific classId and time
          await Attendance.updateOne(
            {
              student: studentId,
              "attendanceEntries.subject": subjectId,
              "attendanceEntries.date": attendanceDate,
              "attendanceEntries.classId": classId,
              "attendanceEntries.time": classTime
            },
            { $set: { "attendanceEntries.$.isPresent": isPresent } }
          );
          addedRecords.push({
            studentId,
            subject: subjectId,
            classId,
            time: classTime,
            date: attendanceDate,
            isPresent,
            updated: true
          });
          continue;
        }

        // Create new attendance entry
        const newEntry = {
          subject: subjectId,
          classId,
          time: classTime,
          date: attendanceDate,
          isPresent,
        };

        const attendanceRecord = await Attendance.findOneAndUpdate(
          { student: studentId },
          {
            $push: { attendanceEntries: newEntry },
          },
          { upsert: true, new: true }
        );

        addedRecords.push(newEntry);
      } catch (error) {
        errors.push({ studentId, error: error.message });
      }
    }

    // Update totalLectures for the subject only if new records were added (not updated)
    const newRecords = addedRecords.filter(record => !record.updated);
    if (newRecords.length > 0) {
      await Subject.findByIdAndUpdate(subjectId, {
        $inc: { totalLectures: 1 },
      });
    }

    res.status(201).json({
      message: `${addedRecords.length} attendance records saved successfully`,
      addedRecords,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (err) {
    console.error("Error saving attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/attendance/report - Fetch attendance report data for a student
router.get("/report", async (req, res) => {
  try {
    const { studentId, teacherId, startDate, endDate } = req.query;

    // Validate teacher
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(400).json({ message: "Teacher not found" });
    }

    // Validate student
    const student = await Student.findById(studentId).populate("batchRef");
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }

    // Find subjects relevant to the student's batch and teacher's department
    const subjects = await Subject.find({
      department: student.department,
      year: student.year,
    }).select("name code totalLectures");

    // Build attendance query
    const attendanceQuery = { student: studentId };
    if (startDate || endDate) {
      attendanceQuery.attendanceEntries = {
        $elemMatch: {},
      };
      if (startDate)
        attendanceQuery.attendanceEntries.$elemMatch.date.$gte = moment
          .tz(startDate, "Asia/Kolkata")
          .startOf("day")
          .toDate();
      if (endDate)
        attendanceQuery.attendanceEntries.$elemMatch.date.$lte = moment
          .tz(endDate, "Asia/Kolkata")
          .endOf("day")
          .toDate();
    }

    // Fetch attendance records
    const attendanceRecords = await Attendance.find(attendanceQuery)
      .populate("attendanceEntries.subject", "name code")
      .lean();

    // Calculate subject-wise attendance
    const subjectWiseAttendance = subjects.map((subject) => {
      const subjectRecords =
        attendanceRecords[0]?.attendanceEntries?.filter(
          (entry) => entry.subject._id.toString() === subject._id.toString()
        ) || [];
      const attendedLectures = subjectRecords.filter(
        (record) => record.isPresent
      ).length;
      return {
        subjectName: subject.name,
        subjectCode: subject.code,
        totalLectures: subject.totalLectures || 0,
        attendedLectures,
        attendancePercentage:
          subject.totalLectures > 0
            ? ((attendedLectures / subject.totalLectures) * 100).toFixed(2)
            : 0,
      };
    });

    // Calculate overall attendance
    const totalLectures = subjects.reduce(
      (sum, subject) => sum + (subject.totalLectures || 0),
      0
    );
    const totalAttended =
      attendanceRecords[0]?.attendanceEntries?.filter(
        (entry) => entry.isPresent
      ).length || 0;
    const totalAttendancePercentage =
      totalLectures > 0
        ? ((totalAttended / totalLectures) * 100).toFixed(2)
        : 0;

    res.status(200).json({
      student: {
        name: student.name,
        enrollmentNumber: student.enrollmentNumber,
        rollNumber: student.rollNumber,
        batch: student.batchRef?.name || student.batch,
        department: student.department,
        year: student.year,
      },
      subjectWiseAttendance,
      overallAttendance: {
        totalLectures,
        attendedLectures: totalAttended,
        attendancePercentage: totalAttendancePercentage,
      },
    });
  } catch (err) {
    console.error("Error generating attendance report:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/attendance/daily-report - Fetch daily attendance report for all classes
router.get("/daily-report", async (req, res) => {
  try {
    const { adminId, date } = req.query;

    // Validate admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // FIX: Use provided date or current IST date
    let targetDate;
    if (date) {
      targetDate = moment.tz(date, "Asia/Kolkata");
    } else {
      targetDate = moment.tz("Asia/Kolkata");
    }

    const currentDate = targetDate.startOf("day").toDate();
    const endOfDay = targetDate.endOf("day").toDate();

    console.log("Daily report for date range:", currentDate, "to", endOfDay);

    // Fetch all schedules for the current date
    const schedules = await Schedule.find({
      date: {
        $gte: currentDate,
        $lte: endOfDay,
      },
      createdBy: adminId,
    })
      .populate("subject", "name code")
      .populate("teacher", "name")
      .populate("batch", "name")
      .lean();

    // Fetch all attendance records for the current date
    const attendanceRecords = await Attendance.find({
      "attendanceEntries.date": {
        $gte: currentDate,
        $lte: endOfDay,
      },
    })
      .populate("student", "rollNumber")
      .lean();

    // Process each schedule to determine submission status and attendance metrics
    const submissions = await Promise.all(
      schedules.map(async (schedule) => {
        // Fetch students in the batch
        const students = await Student.find({ batchRef: schedule.batch._id })
          .select("rollNumber")
          .lean();
        const totalStudents = students.length;

        // Find attendance records for this schedule
        const scheduleAttendance = attendanceRecords
          .filter((record) =>
            record.attendanceEntries.some(
              (entry) =>
                entry.classId?.toString() === schedule._id.toString() &&
                entry.date >= currentDate &&
                entry.date <= endOfDay
            )
          )
          .flatMap((record) =>
            record.attendanceEntries.filter(
              (entry) =>
                entry.classId?.toString() === schedule._id.toString() &&
                entry.date >= currentDate &&
                entry.date <= endOfDay
            )
          );

        const submitted = scheduleAttendance.length > 0;
        const presentStudents = submitted
          ? scheduleAttendance.filter((entry) => entry.isPresent).length
          : 0;
        const attendanceRate =
          totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;
        const absentStudents = submitted
          ? scheduleAttendance
            .filter((entry) => !entry.isPresent)
            .map(
              () =>
                students.find((s) =>
                  attendanceRecords.some((ar) =>
                    ar.attendanceEntries.some(
                      (e) =>
                        e.student.toString() === s._id.toString() &&
                        e.classId?.toString() === schedule._id.toString() &&
                        !e.isPresent
                    )
                  )
                )?.rollNumber
            )
            .filter(Boolean)
          : [];

        return {
          id: schedule._id.toString(),
          teacher: schedule.teacher.name,
          subject: schedule.subject.name,
          batch: schedule.batch.name,
          date: moment.tz(currentDate, "Asia/Kolkata").format("YYYY-MM-DD"),
          submitted,
          submittedAt: submitted
            ? new Date(scheduleAttendance[0].createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            : null,
          totalStudents,
          presentStudents,
          attendanceRate,
          absentStudents,
        };
      })
    );

    // Calculate overview metrics
    const totalTeachers = new Set(
      schedules.map((s) => s.teacher._id.toString())
    ).size;
    const submittedCount = submissions.filter((s) => s.submitted).length;
    const pendingCount = submissions.length - submittedCount;
    const allSubmitted = pendingCount === 0;

    res.status(200).json({
      date: targetDate.format("YYYY-MM-DD"),
      totalTeachers,
      submittedCount,
      pendingCount,
      allSubmitted,
      submissions,
    });
  } catch (err) {
    console.error("Error fetching daily attendance report:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;