const express = require("express");
const router = express.Router();
const Batch = require("../models/batchSchema");

// 🔹 GET all batches (optionally filter by admin)
router.get("/", async (req, res) => {
  try {
    const { adminId } = req.query;

    const filter = adminId ? { createdBy: adminId } : {};

    const batches = await Batch.find(filter).populate("createdBy", "name");
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches" });
  }
});

// 🔹 POST - Create new batch
router.post("/", async (req, res) => {
  try {
    const { name, department, year, students, createdBy } = req.body;
    const newBatch = new Batch({ name, department, year, students, createdBy });

    await newBatch.save();
    res.status(201).json(newBatch);
  } catch (error) {
    console.error("Error creating batch:", error);
    res.status(500).json({ message: "Error creating batch" });
  }
});

// 🔹 PUT - Update batch by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedBatch = await Batch.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updatedBatch);
  } catch (error) {
    res.status(500).json({ message: "Error updating batch" });
  }
});

// 🔹 DELETE - Delete batch by ID
router.delete("/:id", async (req, res) => {
  try {
    await Batch.findByIdAndDelete(req.params.id);
    res.json({ message: "Batch deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting batch" });
  }
});

module.exports = router;
