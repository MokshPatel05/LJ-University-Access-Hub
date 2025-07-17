const mongoose = require("mongoose");
const Batch = require("../models/batchSchema");
const Schedule = require("../models/scheduleSchema");
const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");
const Attendance = require("../models/attendanceSchema");
require('dotenv').config();

const dburl = process.env.MONGO_URL;

async function clearData() {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to database");

    await Attendance.deleteMany({});
    console.log("All attendance deleted");

    await Schedule.deleteMany({});
    console.log("All schedules deleted");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  } catch (err) {
    console.error("Error clearing data:", err);
    process.exit(1);
  }
}

clearData();
