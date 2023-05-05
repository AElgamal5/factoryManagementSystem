const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    name: { type: String, required: true },

    colors: [
      {
        name: { type: String },
        code: { type: String },
      },
    ],

    sizes: [
      {
        name: { type: String },
        code: { type: String },
      },
    ],

    details: { type: String },

    image: { type: String },

    stages: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Stage" },
        priority: { type: Number },
        machineType: { type: String },
      },
    ],

    materials: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Material" },
        quantity: { type: Number },
      },
    ],

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Model", modelSchema);
