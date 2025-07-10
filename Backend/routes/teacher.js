const express = require("express");
const router = express.Router();
const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");

// Get all teachers (optionally filtered by admin)
router.get("/", async (req, res) => {
  try {
    const { adminId } = req.query;

    const filter = adminId ? { admin: adminId } : {};

    const teachers = await Teacher.find(filter)
      .populate("subjects", "name")
      .populate("batch", "name") // 👈 Add this
      .populate("admin", "name");

    res.status(200).json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Failed to fetch teachers" });
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

module.exports = router;
