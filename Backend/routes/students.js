const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../models/studentSchema");
const Batch = require("../models/batchSchema");
const Admin = require("../models/adminSchema"); // Add this import

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().populate("batchRef").populate("createdBy", "name div");
    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Error fetching students" });
  }
});

// Add a single student
router.post("/", async (req, res) => {
  try {
    const { name, enrollmentNumber, rollNumber, year, batch, adminId } = req.body;

    // Validate required fields
    if (!name || !enrollmentNumber || !rollNumber || !year || !batch || !adminId) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ error: "All fields are required including adminId" });
    }

    // Validate enrollmentNumber is a non-empty string
    if (typeof enrollmentNumber !== "string" || enrollmentNumber.trim() === "") {
      console.error("Invalid enrollmentNumber value:", enrollmentNumber);
      return res.status(400).json({ error: "Enrollment number must be a non-empty string" });
    }

    // Fetch admin to get department (stored as div)
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }
    
    const department = admin.div; // Get department from admin's div field
    if (!department) {
      return res.status(400).json({ error: "Admin department not found" });
    }

    console.log("Received enrollmentNumber:", enrollmentNumber.trim());

    // Check for existing student
    const existingStudent = await Student.findOne({ enrollmentNumber: enrollmentNumber.trim() });
    if (existingStudent) {
      console.error("Duplicate enrollmentNumber found:", enrollmentNumber);
      return res.status(400).json({ error: "Student with this enrollment number already exists" });
    }

    // Find or create batch
    let batchDoc = await Batch.findOne({ name: batch, department: department, year: year });
    if (!batchDoc) {
      batchDoc = new Batch({
        name: batch,
        department: department,
        year: year,
        students: [],
        createdBy: new mongoose.Types.ObjectId(adminId),
      });
      await batchDoc.save();
    }

    // Create new student
    const newStudent = new Student({
      name: name.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      rollNumber: rollNumber.trim(),
      year: year,
      department: department,
      batch: batch.trim(),
      batchRef: batchDoc._id,
      createdBy: new mongoose.Types.ObjectId(adminId),
    });
    await newStudent.save();

    // Add student to batch
    batchDoc.students.push(newStudent._id);
    await batchDoc.save();

    // Populate batchRef and createdBy for response
    const populatedStudent = await Student.findById(newStudent._id)
      .populate("batchRef")
      .populate("createdBy", "name div");
    
    res.status(201).json(populatedStudent);
  } catch (err) {
    console.error("Error creating student:", err);
    if (err.code === 11000) {
      const keyPattern = err.keyPattern || {};
      if (keyPattern.enrollmentNumber) {
        return res.status(400).json({ error: "Student with this enrollment number already exists" });
      }
      return res.status(400).json({ error: "Duplicate key error" });
    }
    res.status(400).json({ error: `Failed to create student: ${err.message}` });
  }
});

// Add multiple students (for Excel upload)
router.post("/bulk", async (req, res) => {
  try {
    const { students: studentsData, adminId } = req.body;

    if (!Array.isArray(studentsData) || studentsData.length === 0) {
      return res.status(400).json({ error: "Students data must be a non-empty array" });
    }

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    // Fetch admin to get department
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }
    
    const department = admin.div;
    if (!department) {
      return res.status(400).json({ error: "Admin department not found" });
    }

    const addedStudents = [];
    const errors = [];

    for (let i = 0; i < studentsData.length; i++) {
      const { name, enrollmentNumber, rollNumber, year, batch } = studentsData[i];

      try {
        // Validate required fields
        if (!name || !enrollmentNumber || !rollNumber || !year || !batch) {
          errors.push({ row: i + 1, error: "All fields are required" });
          continue;
        }

        // Validate enrollmentNumber
        if (typeof enrollmentNumber !== "string" || enrollmentNumber.trim() === "") {
          errors.push({ row: i + 1, error: "Enrollment number must be a non-empty string" });
          continue;
        }

        // Check if student with this enrollmentNumber already exists
        const existingStudent = await Student.findOne({ enrollmentNumber: enrollmentNumber.trim() });
        if (existingStudent) {
          errors.push({
            row: i + 1,
            error: `Student with enrollment ${enrollmentNumber} already exists`,
          });
          continue;
        }

        // Find existing batch or create new one
        let batchDoc = await Batch.findOne({ name: batch, department: department, year: year });
        if (!batchDoc) {
          batchDoc = new Batch({
            name: batch,
            department: department,
            year: year,
            students: [],
            createdBy: new mongoose.Types.ObjectId(adminId),
          });
          await batchDoc.save();
        }

        // Create new student
        const newStudent = new Student({
          name: name.trim(),
          enrollmentNumber: enrollmentNumber.trim(),
          rollNumber: rollNumber.trim(),
          year: year,
          department: department,
          batch: batch.trim(),
          batchRef: batchDoc._id,
          createdBy: new mongoose.Types.ObjectId(adminId),
        });
        await newStudent.save();

        // Add student to batch's students array
        batchDoc.students.push(newStudent._id);
        await batchDoc.save();

        const populatedStudent = await Student.findById(newStudent._id)
          .populate("batchRef")
          .populate("createdBy", "name div");
        addedStudents.push(populatedStudent);
      } catch (error) {
        errors.push({ row: i + 1, error: error.message });
      }
    }

    res.status(201).json({
      message: `${addedStudents.length} students added successfully`,
      addedStudents,
      errors: errors.length > 0 ? errors : null,
    });
  } catch (err) {
    console.error("Error in bulk upload:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Remove student from batch
    await Batch.updateOne({ _id: student.batchRef }, { $pull: { students: student._id } });
    
    // Delete student
    await Student.findByIdAndDelete(req.params.id);
    
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  try {
    const { name, enrollmentNumber, rollNumber, year, batch, adminId } = req.body;
    const studentId = req.params.id;

    // Validate required fields
    if (!name || !enrollmentNumber || !rollNumber || !year || !batch || !adminId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate enrollmentNumber
    if (typeof enrollmentNumber !== "string" || enrollmentNumber.trim() === "") {
      return res.status(400).json({ error: "Enrollment number must be a non-empty string" });
    }

    // Fetch admin to get department
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ error: "Admin not found" });
    }
    
    const department = admin.div;
    if (!department) {
      return res.status(400).json({ error: "Admin department not found" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if enrollmentNumber is being changed and if new enrollmentNumber already exists
    if (enrollmentNumber.trim() !== student.enrollmentNumber) {
      const existingStudent = await Student.findOne({ enrollmentNumber: enrollmentNumber.trim() });
      if (existingStudent) {
        return res.status(400).json({
          error: "Student with this enrollment number already exists",
        });
      }
    }

    // Find existing batch or create new one
    let batchDoc = await Batch.findOne({ name: batch, department: department, year: year });
    if (!batchDoc) {
      batchDoc = new Batch({
        name: batch,
        department: department,
        year: year,
        students: [],
        createdBy: new mongoose.Types.ObjectId(adminId),
      });
      await batchDoc.save();
    }

    // If batch is changing, update batch references
    if (student.batchRef.toString() !== batchDoc._id.toString()) {
      await Batch.updateOne({ _id: student.batchRef }, { $pull: { students: student._id } });
      batchDoc.students.push(student._id);
      await batchDoc.save();
    }

    // Update student
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        name: name.trim(),
        enrollmentNumber: enrollmentNumber.trim(),
        rollNumber: rollNumber.trim(),
        year: year,
        department: department,
        batch: batch.trim(),
        batchRef: batchDoc._id,
        createdBy: new mongoose.Types.ObjectId(adminId),
      },
      { new: true }
    ).populate("batchRef").populate("createdBy", "name div");

    res.json(updatedStudent);
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;