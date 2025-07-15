// backend/routes/schedule.js
const express = require("express");
const router = express.Router();
const Schedule = require("../models/scheduleSchema");

// Save schedule entries
router.post("/save", async (req, res) => {
  try {
    const { entries } = req.body;
    if (!entries || !Array.isArray(entries)) {
      return res.status(400).json({ message: "Invalid entries format." });
    }
    const saved = await Schedule.insertMany(entries);
    res.status(200).json({ message: "Schedule saved successfully", saved });
  } catch (err) {
    console.error("Error saving schedule:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get schedule by department and year
router.get("/", async (req, res) => {
  const { department, year } = req.query;
  try {
    const schedule = await Schedule.find({ department, year })
      .populate("subject", "name")
      .populate("teacher", "name")
      .populate("admin", "name");
    res.status(200).json(schedule);
  } catch (err) {
    console.error("Error fetching schedule:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a schedule entry by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Schedule.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Schedule not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Error deleting schedule:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
