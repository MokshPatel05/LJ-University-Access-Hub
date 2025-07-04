const mongoose = require("mongoose");
const Student = require("../models/studentSchema");
const Batch = require("../models/batchSchema");

const dburl =
  "mongodb+srv://Moksh:Host-2005@ljaccesshub.blceukc.mongodb.net/LJAccessHub?retryWrites=true&w=majority&appName=LJAccessHub";

main()
  .then(() => console.log("Connected to database"))
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(dburl);
}

const studentData = [
  // BATCH: B4 (SY2)
  {
    name: "Aayushi Patel",
    enrollmentNumber: "SY2B4EN001",
    rollNumber: 1, // ✅ numeric
    year: "2nd",
    batch: "B4",
    department: "SY2",
  },
  {
    name: "Devansh Shah",
    enrollmentNumber: "SY2B4EN002",
    rollNumber: 2,
    year: "2nd",
    batch: "B4",
    department: "SY2",
  },

  // BATCH: B5 (SY3)
  {
    name: "Kavya Mehta",
    enrollmentNumber: "SY3B5EN001",
    rollNumber: 1,
    year: "3rd",
    batch: "B5",
    department: "SY3",
  },
  {
    name: "Harshil Desai",
    enrollmentNumber: "SY3B5EN002",
    rollNumber: 2,
    year: "3rd",
    batch: "B5",
    department: "SY3",
  },
];

async function insertStudents() {
  try {
    // Optional: clear all existing students
    await Student.deleteMany({});

    for (let s of studentData) {
      const matchedBatch = await Batch.findOne({
        name: s.batch,
        department: s.department,
      });

      const student = new Student({
        ...s,
        batchRef: matchedBatch ? matchedBatch._id : null,
      });

      const savedStudent = await student.save();

      if (matchedBatch) {
        matchedBatch.students.push(savedStudent._id);
        await matchedBatch.save();
        console.log(`✅ Added ${s.name} to batch ${s.batch}`);
      } else {
        console.log(`⚠️ No matching batch for ${s.name}. Added without link.`);
      }
    }

    console.log("🎉 Sample students inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting students:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 DB connection closed.");
  }
}

main().then(() => insertStudents());
