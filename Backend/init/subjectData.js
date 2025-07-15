const mongoose = require("mongoose");
const Subject = require("../models/subjectSchema"); // adjust path if needed

// Connect to MongoDB
const dburl =
  "mongodb+srv://Moksh:Host-2005@ljaccesshub.blceukc.mongodb.net/LJAccessHub?retryWrites=true&w=majority&appName=LJAccessHub";

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Connection failed:", err);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(dburl);
}

// Sample subjects (without teacher refs yet)
const subjectData = [
  { year: 2, name: "DM" },
  { year: 2, name: "FSD-2" },
  { year: 2, name: "Python-2" },
  { year: 2, name: "COA" },
  { year: 2, name: "TOC" },
  { year: 2, name: "PS" },
  { year: 2, name: "DE" },
  { year: 2, name: "FSD-1" },
  { year: 2, name: "Python-1" },
];

// Insert data
async function seedSubjects() {
  try {
    await Subject.deleteMany({}); // clear old data

    await Subject.insertMany(subjectData);

    console.log("✅ Sample subjects inserted successfully!");
  } catch (err) {
    console.error("❌ Failed to insert subjects:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
}

main().then(seedSubjects);
