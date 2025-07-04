// routes/teacher.js
const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");

// GET all teachers with populated subjects and admin
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("subjects", "name")
      .populate("admin", "name"); // Only show admin's name
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

// POST a new teacher
router.post("/", async (req, res) => {
  try {
    const { name, ID_Name, password, batch, subjects, adminId } = req.body;

    const newTeacher = new Teacher({
      name,
      ID_Name,
      password,
      batch,
      subjects,
      admin: adminId,
    });

    await newTeacher.save();

    // Also update Subject documents (push teacher ref)
    if (subjects && subjects.length > 0) {
      await Subject.updateMany(
        { _id: { $in: subjects } },
        { $addToSet: { teachers: newTeacher._id } }
      );
    }

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    console.error("Error creating teacher:", err);
    res.status(500).json({ message: "Error creating teacher" });
  }
});

// DELETE a teacher
router.delete("/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Remove teacher from subject.teacher arrays
    await Subject.updateMany(
      { teachers: teacherId },
      { $pull: { teachers: teacherId } }
    );

    await Teacher.findByIdAndDelete(teacherId);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting teacher" });
  }
});

module.exports = router;
