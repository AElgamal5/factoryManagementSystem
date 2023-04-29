const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const materialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },

    available: {
      type: Number,
      default: 0,
    },

    details: {
      type: String,
    },

    type: {
      type: String,
      required: true,
    },

    unit: { type: string, required: true },

    role: { type: String, required: true },

    image: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
