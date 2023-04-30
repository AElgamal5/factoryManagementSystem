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

    max: {
      type: Number,
      default: 0,
    },

    min: {
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

    unit: { type: String, required: true },

    role: {
      title: { type: String, required: true },
      num: { type: Number, required: true },
    },

    image: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Material", materialSchema);
