const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Teacher = require("../models/teacherSchema");
const Subject = require("../models/subjectSchema");
const Admin = require("../models/adminSchema");

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

const rawTeacherData = [
  {
    name: "Amit Patel",
    ID_Name: "APT",
    password: "teach123",
    subjects: ["Introduction to Programming"],
    batch: ["B1", "B2"],
  },
  {
    name: "Sneha Shah",
    ID_Name: "SSH",
    password: "teach123",
    subjects: ["Engineering Mathematics"],
    batch: ["B3", "B4"],
  },
  {
    name: "Ravi Mehta",
    ID_Name: "RMT",
    password: "teach123",
    subjects: ["Data Structures", "Engineering Mathematics"],
    batch: ["B2", "B5"],
  },
  {
    name: "Neha Desai",
    ID_Name: "NDS",
    password: "teach123",
    subjects: ["Computer Networks"],
    batch: ["B3", "B6"],
  },
  {
    name: "Karan Bhatt",
    ID_Name: "KBT",
    password: "teach123",
    subjects: ["Operating Systems"],
    batch: ["B4", "B5"],
  },
  {
    name: "Pooja Trivedi",
    ID_Name: "PTD",
    password: "teach123",
    subjects: ["Database Management Systems"],
    batch: ["B5", "B6"],
  },
  {
    name: "Yash Rajput",
    ID_Name: "YRP",
    password: "teach123",
    subjects: ["Machine Learning"],
    batch: ["B7", "B8"],
  },
  {
    name: "Disha Patel",
    ID_Name: "DPT",
    password: "teach123",
    subjects: ["Cloud Computing"],
    batch: ["B8", "B9"],
  },
];

async function insertTeacherData() {
  try {
    const adminId = "68678d8ed864520bdc2a32f8"; // ✅ Replace with your real Admin ID

    // Check admin exists
    const admin = await Admin.findById(adminId);
    if (!admin) throw new Error("Admin ID not found in DB");

    await Teacher.deleteMany({});

    const allSubjects = await Subject.find();

    const finalTeachers = [];

    for (let teacher of rawTeacherData) {
      const hashedPassword = await bcrypt.hash(teacher.password, 10);

      // Map subject names to ObjectIds
      const subjectIds = allSubjects
        .filter((subj) => teacher.subjects.includes(subj.name))
        .map((subj) => subj._id);

      if (subjectIds.length !== teacher.subjects.length) {
        console.warn(`⚠️ Some subjects not found for teacher ${teacher.name}`);
      }

      finalTeachers.push({
        name: teacher.name,
        ID_Name: teacher.ID_Name,
        password: hashedPassword,
        subjects: subjectIds,
        batch: teacher.batch,
        admin: adminId,
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
