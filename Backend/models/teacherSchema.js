const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const teacherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  ID_Name: {
    type: String,
    maxlength: 3,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  subjects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Subject",
    },
  ],
  batch: [
    {
      type: Schema.Types.ObjectId,
      ref: "Batch",
    },
  ],
  admin: [
    {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  ], // ✅ Changed to array to support multiple admins
});

// Hash password before saving
teacherSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const Teacher = mongoose.model("Teacher", teacherSchema);
module.exports = Teacher;
