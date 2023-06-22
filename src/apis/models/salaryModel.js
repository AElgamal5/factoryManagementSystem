const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salarySchema = new Schema(
  {
    employee: { type: mongoose.Types.ObjectId, ref: "Employee" },

    totalWorkPerMonth: [
      {
        stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
        quantity: { type: Number },
      },
    ],

    totalPieces: { type: Number, default: 0 },

    totalCost: { type: Number, default: 0 },

    todayPieces: { type: Number, default: 0 },

    todayCost: { type: Number, default: 0 },

    details: [
      {
        day: { type: Number },
        work: [
          {
            stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
            quantity: { type: Number },
          },
        ],
      },
    ],

    state: { type: Boolean, default: false },

    date: {
      year: { type: Number },
      month: { type: Number },
      day: { type: Number },
    },

    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
