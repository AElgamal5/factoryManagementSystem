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
        totalQuantity: {
          type: Number,
        },
      },
    ],

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

module.exports = mongoose.model("Custody", custodySchema);
