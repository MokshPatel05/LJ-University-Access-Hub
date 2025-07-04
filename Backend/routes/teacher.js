const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate("subjects", "name") // ✅ get subject names
      .populate("admin", "name"); // optional

    res.status(200).json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Failed to fetch teachers" });
  }
});

// Add new teacher
router.post("/", async (req, res) => {
  try {
    const { name, ID_Name, password, batch, subjects, adminId } = req.body;

    // Validate subjects
    const validSubjects = await Subject.find({ _id: { $in: subjects } });
    if (validSubjects.length !== subjects.length) {
      return res.status(400).json({ message: "Invalid subject(s) provided" });
    }

    // Validate admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(400).json({ message: "Invalid admin ID" });
    }

    const newTeacher = new Teacher({
      name,
      ID_Name,
      password,
      batch,
      subjects,
      admin: adminId,
    });

    await newTeacher.save();

    // Update subject references
    await Subject.updateMany(
      { _id: { $in: subjects } },
      { $addToSet: { teachers: newTeacher._id } }
    );

    res.status(201).json({ message: "Teacher created successfully" });
  } catch (err) {
    console.error("Error creating teacher:", err);
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
