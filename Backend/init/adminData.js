const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const Admin = require("../models/adminSchema");

// Connect to MongoDB
const dburl =
  "mongodb+srv://Moksh:Host-2005@ljaccesshub.blceukc.mongodb.net/LJAccessHub?retryWrites=true&w=majority&appName=LJAccessHub";
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
    password: "Admin123!", // Will be hashed
    year: 1,
    div: "SY1",
    teachers: [],
  },
  {
    name: "Emma Johnson",
    password: "SecurePass456!", // Will be hashed
    year: 1,
    div: "SY2",
    teachers: [],
  },
  {
    name: "Michael Brown",
    password: "Admin789!", // Will be hashed
    year: 2,
    div: "SY3",
    teachers: [],
  },
  {
    name: "Mitesh Thakkar",
    password: "IamAdmin", // Will be hashed
    year: 2,
    div: "SY2",
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
