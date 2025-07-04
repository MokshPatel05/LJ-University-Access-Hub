// models/studentSchema.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  enrollmentNumber: {
    type: String,
    required: true,
    unique: true,
  },
  rollNumber: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    enum: ["1st", "2nd", "3rd", "4th"],
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  batchRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Batch",
  },
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
