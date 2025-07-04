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
  { year: 1, name: "Introduction to Programming" },
  { year: 1, name: "Engineering Mathematics" },
  { year: 2, name: "Data Structures" },
  { year: 2, name: "Computer Networks" },
  { year: 3, name: "Operating Systems" },
  { year: 3, name: "Database Management Systems" },
  { year: 4, name: "Machine Learning" },
  { year: 4, name: "Cloud Computing" },
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
