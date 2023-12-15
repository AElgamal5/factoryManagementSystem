const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const groupSchema = new Schema(
  {
    employee: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    startStage: { type: mongoose.Types.ObjectId, ref: "Stage", required: true },

    endStage: { type: mongoose.Types.ObjectId, ref: "Stage", required: true },

    order: { type: mongoose.Types.ObjectId, ref: "Order", required: true },

    model: { type: mongoose.Types.ObjectId, ref: "Model", required: true },

    stages: [{ type: mongoose.Types.ObjectId, ref: "Stage" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
