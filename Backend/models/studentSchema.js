const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    enrollmentNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    rollNumber: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      enum: ["1", "2", "3", "4"],
      required: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    batch: {
      type: String,
      required: true,
      trim: true,
    },
    batchRef: {
      type: Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;