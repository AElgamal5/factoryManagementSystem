const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salarySchema = new Schema(
  {
    employee: { type: mongoose.Types.ObjectId, ref: "Employee" },

    work: [
      {
        stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
        quantity: { type: Number },
      },
    ],

    total: { type: Number, default: 0 },

    state: { type: Boolean, default: false },

    date: {
      year: { type: Number },
      month: { type: Number },
    },

    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
