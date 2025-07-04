const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // 👈 Reference to Student schema
    },
  ],
  createdBy: {
    type: String,
    required: true,
  },
});

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
