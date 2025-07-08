const mongoose = require("mongoose");
const Batch = require("../models/batchSchema");

// 👇 Set your DB connection
const dburl =
  "mongodb+srv://Moksh:Host-2005@ljaccesshub.blceukc.mongodb.net/LJAccessHub?retryWrites=true&w=majority&appName=LJAccessHub";

// 👇 Get admin ID from command line
const createdByAdminId = process.argv[2]; // usage: node seedBatches.js <adminId>

if (!createdByAdminId) {
  console.error("❌ Please provide an admin ID (e.g. node seedBatches.js <adminId>)");
  process.exit(1);
}

main()
  .then(() => console.log("✅ Connected to Database"))
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });

async function main() {
  await mongoose.connect(dburl);
}

const batchData = Array.from({ length: 9 }, (_, i) => ({
  name: `B${i + 1}`,
  department: "Computer",   // Customize this
  year: ((i % 4) + 1).toString(),
  students: [],
  createdBy: createdByAdminId,
}));

async function insertBatches() {
  try {
    await Batch.deleteMany({});
    // await Batch.insertMany(batchData);
    console.log("✅ Batches inserted successfully!");
  } catch (e) {
    console.error("❌ Error inserting batch data:", e);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed.");
  }
}

main().then(() => insertBatches());
