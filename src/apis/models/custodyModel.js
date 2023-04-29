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

    details: { type: String },

    currentEmployees: [
      {
        id: {
          type: mongoose.Types.ObjectId,
          ref: "Employee",
        },
      },
    ],

    unit: { type: String, required: true },

    role: { type: String, required: true },

    image: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Custody", custodySchema);
