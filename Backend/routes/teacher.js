const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");

// Get all teachers (optionally filtered by admin)
router.get("/", async (req, res) => {
  try {
    const { adminId } = req.query; // <-- get adminId from query

    const filter = adminId ? { admin: adminId } : {};

    const teachers = await Teacher.find(filter)
      .populate("subjects", "name")
      .populate("admin", "name");

    res.status(200).json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

// Add new teacher
router.post("/", async (req, res) => {
  try {
    const { name, ID_Name, password, subjects, batch, adminId } = req.body;

    const newTeacher = new Teacher({
      name,
      ID_Name,
      password,
      subjects,
      batch,
      admin: adminId, // link to admin
    });

    const savedTeacher = await newTeacher.save();

    // Add teacher to admin's teacher list
    await Admin.findByIdAndUpdate(
      adminId,
      { $addToSet: { teachers: savedTeacher._id } }, // use $addToSet to prevent duplicates
      { new: true }
    );

    res.status(201).json(savedTeacher);
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
    );

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

// Delete teacher
router.delete("/:id", async (req, res) => {
  try {
    const teacherId = req.params.id;

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
