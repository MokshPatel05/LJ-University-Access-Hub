const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("../models/adminSchema");

// Connect to MongoDB
require('dotenv').config();
const dburl = process.env.MONGO_URL;
main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((e) => {
    console.error("Database connection failed:", e);
    process.exit(1);
  });
async function main() {
  await mongoose.connect(dburl);
}

// Sample admin data
const adminData = [
  {
    name: "John Smith",
    password: "IamAdmin", // Will be hashed
    year: 2,
    div: "SY2",
    teachers: [],
  },
  {
    name: "Prof. Mitesh Thakkar",
    password: "Admin123!", // Will be hashed
    year: 2,
    div: "SY2",
    teachers: [],
  },
  {
    name: "Test",
    password: "Test", // Will be hashed
    year: 1,
    div: "FY2",
    teachers: [],
  },
];

// Function to hash passwords and insert data
async function insertAdminData() {
  try {
    // ✅ Clear existing data
    await Admin.deleteMany({}); // clear data to prevent duplicate data.

    // Hash passwords for each admin
    for (let admin of adminData) {
      admin.password = await bcrypt.hash(admin.password, 10);
    }

    // Insert data into the admins collection
    await Admin.insertMany(adminData);
    console.log("Sample admin data inserted successfully!");
  } catch (e) {
    console.error("Error inserting admin data:", e);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the script
main().then(() => {
  insertAdminData();
});
