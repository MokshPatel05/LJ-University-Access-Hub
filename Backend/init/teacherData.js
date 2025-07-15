const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");
const Batch = require("../models/batchSchema"); // ✅ Import Batch model

const dburl =
  "mongodb+srv://Moksh:Host-2005@ljaccesshub.blceukc.mongodb.net/LJAccessHub?retryWrites=true&w=majority&appName=LJAccessHub";

main()
  .then(() => console.log("Connected to Database"))
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(dburl);
}

const rawTeacherData = [];

async function insertTeacherData() {
  try {
    const adminId = "68678d8ed864520bdc2a32f8"; // ✅ Replace with real Admin ID
    
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error("Admin ID not found in DB");

    await Teacher.deleteMany({});

    const allSubjects = await Subject.find();
    const allBatches = await Batch.find();

    const finalTeachers = [];

    for (let teacher of rawTeacherData) {
      const hashedPassword = await bcrypt.hash(teacher.password, 10);

      // Convert subject names to IDs
      const subjectIds = allSubjects
        .filter((subj) => teacher.subjects.includes(subj.name))
        .map((subj) => subj._id);

      // Convert batch names to IDs
      const batchIds = allBatches
        .filter((b) => teacher.batch.includes(b.name))
        .map((b) => b._id);

      if (subjectIds.length !== teacher.subjects.length) {
        console.warn(`⚠️ Some subjects not found for teacher ${teacher.name}`);
      }

      if (batchIds.length !== teacher.batch.length) {
        console.warn(`⚠️ Some batches not found for teacher ${teacher.name}`);
      }

      finalTeachers.push({
        name: teacher.name,
        ID_Name: teacher.ID_Name,
        password: hashedPassword,
        subjects: subjectIds,
        batch: batchIds,
        admin: [adminId], // ✅ should be an array
      });
    }

    await Teacher.insertMany(finalTeachers);
    console.log("✅ Sample teacher data inserted successfully!");
  } catch (e) {
    console.error("❌ Error inserting teacher data:", e);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

main().then(() => {
  insertTeacherData();
});
