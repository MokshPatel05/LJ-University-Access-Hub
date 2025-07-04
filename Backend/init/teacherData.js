const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Teacher = require("../models/teacherSchema");

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

const teacherData = [
  {
    name: "Nidhi Seta",
    ID_Name: "NAS",
    password: "teach123",
    subject: "Math",
    batch: ["B4","B6"],
  },
  {
    name: "Tejas Thakkar",
    ID_Name: "TAT",
    password: "teach456",
    subject: "Physics",
    batch: ["B1","B3"],
  },
  {
    name: "Dipali Parekh",
    ID_Name: "DDP",
    password: "teach789",
    subject: "Chemistry",
    batch: ["B2","B7"],
  },
  {
    name: "Vikas Yadav",
    ID_Name: "VBY",
    password: "password123",
    subject: "Biology",
    batch: ["B2","B5"],
  },
];

async function insertTeacherData() {
  try {
    await Teacher.deleteMany({});

    for (let teacher of teacherData) {
      teacher.password = await bcrypt.hash(teacher.password, 10);
    }

    await Teacher.insertMany(teacherData);
    console.log("Sample teacher data inserted successfully!");
  } catch (e) {
    console.error("Error inserting teacher data:", e);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

main().then(() => {
  insertTeacherData();
});
