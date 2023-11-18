const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stageStaticsSchema = new Schema(
  {
    stage: { type: mongoose.Types.ObjectId, ref: "Stage" },

    order: { type: mongoose.Types.ObjectId, ref: "Order" },

    model: { type: mongoose.Types.ObjectId, ref: "Model" },

    employees: [{ type: mongoose.Types.ObjectId, ref: "Employee" }],

    totalQuantity: { type: Number, default: 0 },

    totalErrors: { type: Number, default: 0 },

    // totalIdleTime: { type: Number, default: 0 },

    details: [
      {
        employee: { type: mongoose.Types.ObjectId, ref: "Employee" },
        card: { type: mongoose.Types.ObjectId, ref: "Card" },
        type: { type: Number }, // 1: track,,2:replace, 3:addError, 4:repairError & 5:confirm
        quantity: { type: Number },
        date: { type: Date },
      },
    ],

    overView: [
      {
        day: { type: Number },
        track: [],
        faults: [],
      },
    ],

    date: {
      day: { type: Number },
      month: { type: Number },
      year: { type: Number },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StageStatics", stageStaticsSchema);
