// backend/routes/api.js
const express = require("express");
const router = express.Router();
const Admin = require("../models/adminSchema");
const Batch = require("../models/batchSchema");
const Subject = require("../models/subjectSchema");
const Teacher = require("../models/teacherSchema");

// Middleware to verify user (assuming userId is sent in headers or body)
const verifyUser = async (req, res, next) => {
  const userId =
    req.headers["user-id"] || req.body.userId || req.params.adminId;
  if (!userId) {
    return res.status(401).json({ message: "User ID required" });
  }
  req.userId = userId;
  next();
};

// Get admin data - Option 1: Using existing route with headers
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

// Get admin data - Option 2: Using admin ID as URL parameter
router.get("/admin/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const admin = await Admin.findById(adminId).select("name div year");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json(admin);
  } catch (err) {
    console.error("Error fetching admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get batches by year and admin
router.get("/batches/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { year } = req.query;

    // First get admin to verify and get their division
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Filter by both year and department (div)
    const batches = await Batch.find({ year, department: admin.div }).select("name department year");
    res.status(200).json(batches);
  } catch (err) {
    console.error("Error fetching batches:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get subjects by year and admin
router.get("/subjects/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { year } = req.query;

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const subjects = await Subject.find({ year }).select("name year");
    res.status(200).json(subjects);
  } catch (err) {
    console.error("Error fetching subjects:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get teachers by batch + subject + admin's department
router.get("/teachers/:adminId", async (req, res) => {
  try {
    const { adminId } = req.params;
    const { batch, subject, adminDiv } = req.query;

    // Verify admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const query = {
      batch: batch,
      admin: adminId,
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