const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartonSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    model: {
      type: mongoose.Types.ObjectId,
      ref: "Model",
    },

    details: { type: String },

    shipment: {
      type: mongoose.Types.ObjectId,
      ref: "Shipment",
    },

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

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carton", cartonSchema);
