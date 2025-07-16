const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");
const Schedule = require("../models/scheduleSchema");
const Batch = require("../models/batchSchema");

//<================================= ADMIN PANEL ROUTES ========================================>

// Complete updated GET route in teacher.js
router.get("/", async (req, res) => {
  try {
    const { adminId, batch, subject } = req.query;
    if (!adminId) {
      return res.status(400).json({ message: "adminId is required" });
    }

    // 1. Get admin's year and div
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    const { year, div } = admin;

    // 2. Find all batches for this year and div
    const batches = await Batch.find({ year: String(year), department: div });
    const batchIds = batches.map(b => b._id);

    // 3. Find all teachers who teach in these batches
    let teachers = await Teacher.find({ batch: { $in: batchIds } })
      .populate("subjects", "name")
      .populate("batch", "name")
      .populate("admin", "name");

    // 4. Filter by selected batch and subject if provided
    if (batch || subject) {
      teachers = teachers.filter((teacher) => {
        let matchesBatch = true;
        let matchesSubject = true;

        if (batch) {
          matchesBatch = teacher.batch.some(
            (b) => b._id.toString() === batch
          );
        }
        if (subject) {
          matchesSubject = teacher.subjects.some(
            (s) => s._id.toString() === subject
          );
        }
        return matchesBatch && matchesSubject;
      });
    }

    res.status(200).json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Failed to fetch teachers", error: err.message });
  }
});

// Add new teacher or add admin to existing teacher
router.post("/", async (req, res) => {
  try {
    const { name, ID_Name, password, subjects, batch, adminId } = req.body;

    // Check if teacher with same name and ID_Name already exists
    const existingTeacher = await Teacher.findOne({ name, ID_Name });

    if (existingTeacher) {
      // Teacher exists, check if admin is already in the list
      if (!existingTeacher.admin.includes(adminId)) {
        // Add admin to existing teacher
        if (!existingTeacher.admin.includes(adminId)) {
          existingTeacher.admin.push(adminId);
        }

        // Merge new batch IDs
        if (Array.isArray(batch)) {
          existingTeacher.batch = [
            ...new Set([
              ...existingTeacher.batch.map(String),
              ...batch.map(String),
            ]),
          ];
        }

        // Merge new subject IDs
        if (Array.isArray(subjects)) {
          existingTeacher.subjects = [
            ...new Set([
              ...existingTeacher.subjects.map(String),
              ...subjects.map(String),
            ]),
          ];
        }

        await existingTeacher.save();

        // Add teacher to admin's teacher list
        await Admin.findByIdAndUpdate(
          adminId,
          { $addToSet: { teachers: existingTeacher._id } },
          { new: true }
        );

        res.status(200).json({
          message: "Admin added to existing teacher",
          teacher: existingTeacher,
        });
      } else {
        res.status(400).json({
          message: "This admin is already associated with this teacher",
        });
      }
    } else {
      // Create new teacher
      const newTeacher = new Teacher({
        name,
        ID_Name,
        password,
        subjects,
        batch,
        admin: [adminId], // ✅ Store as array with initial admin
      });

      const savedTeacher = await newTeacher.save();

      // Add teacher to admin's teacher list
      await Admin.findByIdAndUpdate(
        adminId,
        { $addToSet: { teachers: savedTeacher._id } },
        { new: true }
      );

      res.status(201).json(savedTeacher);
    }
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({ message: "Error creating teacher" });
  }
});

// Update teacher
router.put("/:id", async (req, res) => {
  try {
    const { name, ID_Name, batch, subjects } = req.body;
    const teacherId = req.params.id;

    // Validate subjects
    const validSubjects = await Subject.find({ _id: { $in: subjects } });
    if (validSubjects.length !== subjects.length) {
      return res.status(400).json({ message: "Invalid subject(s) provided" });
    }

    // Update teacher
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, ID_Name, batch, subjects },
      { new: true }
    ).populate("admin", "name");

    // Sync subject references (remove from old and add to new)
    await Subject.updateMany(
      { teachers: teacherId },
      { $pull: { teachers: teacherId } }
    );
    await Subject.updateMany(
      { _id: { $in: subjects } },
      { $addToSet: { teachers: teacherId } }
    );

    res.json({ message: "Teacher updated", teacher: updatedTeacher });
  } catch (err) {
    console.error("Error updating teacher:", err);
    res.status(500).json({ message: "Error updating teacher" });
  }
});

// Delete teacher (remove admin from teacher or delete teacher if no admins left)
router.delete("/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { adminId } = req.query; // Get adminId from query params

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // If adminId is provided, only remove this admin from the teacher
    if (adminId && teacher.admin.includes(adminId)) {
      teacher.admin = teacher.admin.filter((id) => id.toString() !== adminId);

      // Remove teacher from admin's teacher list
      await Admin.findByIdAndUpdate(adminId, {
        $pull: { teachers: teacherId },
      });

      if (teacher.admin.length > 0) {
        // Still has other admins, just save
        await teacher.save();
        res.json({ message: "Admin removed from teacher" });
      } else {
        // No admins left, delete the teacher completely
        await Subject.updateMany(
          { teachers: teacherId },
          { $pull: { teachers: teacherId } }
        );
        await Teacher.findByIdAndDelete(teacherId);
        res.json({ message: "Teacher deleted (no admins left)" });
      }
    } else {
      // No adminId provided or admin not found, delete entire teacher
      await Subject.updateMany(
        { teachers: teacherId },
        { $pull: { teachers: teacherId } }
      );
      await Teacher.findByIdAndDelete(teacherId);
      res.json({ message: "Teacher deleted" });
    }
  } catch (err) {
    console.error("Error deleting teacher:", err);
    res.status(500).json({ message: "Error deleting teacher" });
  }
});

// <================================= TEACHER PANEL ROUTES ========================================>

// GET /api/teacher/:id/dashboard
router.get("/:id/dashboard", async (req, res) => {
  const teacherId = req.params.id;
  const todayDay = new Date().toLocaleDateString("en-US", { weekday: "long" });

  try {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const todaySchedule = await Schedule.find({
      teacher: teacherId,
      day: todayDay,
    })
      .populate("subject", "name");

    // Get batch names for the schedule entries
    const batchIds = [...new Set(todaySchedule.map(schedule => schedule.batch))];
    const batches = await Batch.find({ _id: { $in: batchIds } });
    const batchMap = {};
    batches.forEach(batch => {
      batchMap[batch._id.toString()] = batch.name;
    });

    // Add batch names to schedule entries
    const scheduleWithBatchNames = todaySchedule.map(schedule => ({
      ...schedule.toObject(),
      batch: { name: batchMap[schedule.batch] || schedule.batch }
    }));

    const weeklyScheduleCount = await Schedule.countDocuments({
      teacher: teacherId,
    });

    res.status(200).json({
      name: teacher.name, // Dynamic name!
      todaySchedule: scheduleWithBatchNames,
      stats: {
        totalClassesWeek: weeklyScheduleCount,
        classesToday: scheduleWithBatchNames.length,
        studentsTaught: 0,
      },
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// Helper: convert "09:00 AM" → minutes since midnight
function parseStartTime(timeRange) {
  const [startTime] = timeRange.split(" - ");
  const [time, modifier] = startTime.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

// GET /api/teacher/:id/weekly-schedule
router.get("/:id/weekly-schedule", async (req, res) => {
  const teacherId = req.params.id;
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  try {
    const weeklySchedule = {};

    for (const day of daysOfWeek) {
      let classes = await Schedule.find({ teacher: teacherId, day })
        .populate("subject", "name");

      // Get batch names for all classes
      const batchIds = [...new Set(classes.map(cls => cls.batch))];
      const batches = await Batch.find({ _id: { $in: batchIds } });
      const batchMap = {};
      batches.forEach(batch => {
        batchMap[batch._id.toString()] = batch.name;
      });

      // Sort by start time
      classes.sort((a, b) => {
        const aStart = parseStartTime(a.time);
        const bStart = parseStartTime(b.time);
        return aStart - bStart;
      });

      weeklySchedule[day] = classes.map((cls) => ({
        time: cls.time,
        subject: cls.subject?.name || "Unknown",
        batch: batchMap[cls.batch] || cls.batch || "Unknown",
        room: cls.room,
      }));
    }

    res.status(200).json(weeklySchedule);
  } catch (err) {
    console.error("Error fetching weekly schedule:", err);
    res.status(500).json({ message: "Failed to fetch weekly schedule" });
  }
});

module.exports = router;