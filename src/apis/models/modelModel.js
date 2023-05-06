const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    name: { type: String, required: true },

    image: { type: String },

    stages: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Stage" },
        priority: { type: Number },
        machineType: { type: String },
      },
    ],

    consumption: [
      {
        material: {
          id: { type: mongoose.Types.ObjectId, ref: "Material" },
          quantity: { type: Number },
        },

        color: {
          name: { type: String },
          code: { type: String },
        },

        size: {
          name: { type: String },
          code: { type: String },
        },
      },
    ],

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Model", modelSchema);
