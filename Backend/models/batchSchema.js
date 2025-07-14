const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const batchSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      enum: ["1", "2", "3", "4"],
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index on name, department, and year
batchSchema.index({ name: 1, department: 1, year: 1 }, { unique: true });

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;
