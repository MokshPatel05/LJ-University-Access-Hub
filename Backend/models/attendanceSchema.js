const mongoose = require("mongoose");

const attendanceEntrySchema = new mongoose.Schema({
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: () => new Date().setHours(0, 0, 0, 0), // same day key
  },
  isPresent: {
    type: Boolean,
    required: true,
  },
});

const attendanceRecordSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
    unique: true,
  },
  attendanceEntries: [attendanceEntrySchema],
});

attendanceRecordSchema.index({ student: 1 });

module.exports = mongoose.model("Attendance", attendanceRecordSchema);