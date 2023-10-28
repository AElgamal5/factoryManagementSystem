const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const salarySchema = new Schema(
  {
    employee: { type: mongoose.Types.ObjectId, ref: "Employee" },

    totalWorkPerMonth: [
      {
        stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
        quantity: { type: Number, default: 0 },
        noOfErrors: { type: Number, default: 0 },
      },
    ],

    totalPieces: { type: Number, default: 0 },

    totalCost: { type: Number, default: 0 },

    totalIdle: { type: Number, default: 0 },

    todayPieces: { type: Number, default: 0 },

    todayCost: { type: Number, default: 0 },

    todayIdle: { type: Number, default: 0 },

    idle: { type: Boolean, default: false },

    workDetails: [
      {
        day: { type: Number },
        work: [
          {
            stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
            quantity: { type: Number },
            noOfErrors: { type: Number, default: 0 },
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

    priceHistory: [
      {
        stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
        price: { type: Number },
      },
    ],

    idleDetails: [
      {
        day: { type: Number },
        idles: [
          {
            start: { type: Date },
            reason: { type: String },
            addedBy: { type: mongoose.Types.ObjectId, ref: "Employee" },

            end: { type: Date },
            doneBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
            minus: { type: Number },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Salary", salarySchema);
