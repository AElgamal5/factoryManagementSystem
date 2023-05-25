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
        // machineType: { type: mongoose.Types.ObjectId, ref: "MachineType" },
      },
    ],

    colors: [{ type: mongoose.Types.ObjectId, ref: "Color" }],

    sizes: [{ type: mongoose.Types.ObjectId, ref: "Size" }],

    consumptions: [
      {
        material: { type: mongoose.Types.ObjectId, ref: "Material" },

        quantity: { type: Number },

        colors: [{ type: mongoose.Types.ObjectId, ref: "Color" }],

        sizes: [{ type: mongoose.Types.ObjectId, ref: "Size" }],
      },
    ],

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Model", modelSchema);
