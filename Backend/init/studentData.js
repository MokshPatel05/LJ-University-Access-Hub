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

const studentData = [];

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
