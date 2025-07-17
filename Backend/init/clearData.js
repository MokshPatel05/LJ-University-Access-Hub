const mongoose = require("mongoose");
const Batch = require("../models/batchSchema");
const Schedule = require("../models/scheduleSchema");
const Student = require("../models/studentSchema");
const Teacher = require("../models/teacherSchema");
const Attendance = require("../models/attendanceSchema");
const dburl =
  "mongodb+srv://Moksh:Host-2005@ljaccesshub.blceukc.mongodb.net/LJAccessHub?retryWrites=true&w=majority&appName=LJAccessHub";

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
