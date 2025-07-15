// backend/models/Schedule.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new mongoose.Schema(
  {
    day: { type: String, required: true },
    department: { type: String, required: true },
    year: { type: Number, required: true },
    batch: { type: String, required: true },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    time: { type: String, required: true },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    room: { type: String, required: true },
  },
  { timestamps: true }
);

scheduleSchema.index({ department: 1, year: 1 });

const Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;
