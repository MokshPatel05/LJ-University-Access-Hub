// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// this file handles the reset-password changes.

router.post("/reset-password", async (req, res) => {
  const { username, oldPassword, newPassword, role, userId } = req.body;

  try {
    let UserModel;

    if (role === "admin") {
      UserModel = require("../models/adminSchema");
    } else if (role === "teacher") {
      UserModel = require("../models/teacherSchema");
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await UserModel.findOne({
      _id: userId,
      ...(role === "admin" ? { name: username } : { ID_Name: username }),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
