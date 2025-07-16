const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subjectSchema = new Schema({
  year: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true, // Optional: prevents duplicate subject names
  },
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
    },
  ],
  totalLectures: {
    type: Number,
    default: 0,
  },
});

const Subject = mongoose.model("Subject", subjectSchema);
module.exports = Subject;
