// backend/routes/api.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/adminSchema");
const Batch = require("../models/batchSchema");
const Subject = require("../models/subjectSchema");
const Teacher = require("../models/teacherSchema");

// Middleware to verify user (assuming userId is sent in headers or body)
const verifyUser = async (req, res, next) => {
  const userId = req.headers["user-id"] || req.body.userId;
  if (!userId) {
    return res.status(401).json({ message: "User ID required" });
  }
  req.userId = userId;
  next();
};

// Get admin data
router.get("/admin/me", verifyUser, async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId).select("name div year");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get batches by year
router.get("/batches", verifyUser, async (req, res) => {
  try {
    const { year } = req.query;
    const batches = await Batch.find({ year }).select("name department year");
    res.status(200).json(batches);
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get subjects by year
router.get("/subjects", verifyUser, async (req, res) => {
  try {
    const { year } = req.query;
    const subjects = await Subject.find({ year }).select("name year");
    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get teachers by batch + subject + admin's department
router.get("/teachers", verifyUser, async (req, res) => {
  try {
    const { batch, subject, adminDiv } = req.query;

    const query = {
      batch: batch,
      admin: req.userId,
    };

    if (subject) {
      query.subjects = subject;
    }

    const teachers = await Teacher.find(query).select("name ID_Name");
    res.status(200).json(teachers);
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
