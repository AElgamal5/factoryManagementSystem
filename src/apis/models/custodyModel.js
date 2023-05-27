const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const custodySchema = new Schema(
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

    currentEmployees: [
      {
        id: {
          type: mongoose.Types.ObjectId,
          ref: "Employee",
        },
        totalQuantity: {
          type: Number,
        },
      },
    ],

    unit: { type: String, required: true },

    role: {
      type: mongoose.Types.ObjectId,
      ref: "Role",
    },

    details: { type: String },

    image: { type: mongoose.Types.ObjectId, ref: "Image" },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Custody", custodySchema);
