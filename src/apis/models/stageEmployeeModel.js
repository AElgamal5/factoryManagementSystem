const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const stageEmployeeSchema = new Schema(
  {
    stage: { type: mongoose.Types.ObjectId, ref: "Stage" },

    order: { type: mongoose.Types.ObjectId, ref: "Order" },

    model: { type: mongoose.Types.ObjectId, ref: "Model" },

    employees: [
      {
        employee: { type: mongoose.Types.ObjectId, ref: "Employee" },
        in: { type: Date },
        out: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("StageEmployee", stageEmployeeSchema);
