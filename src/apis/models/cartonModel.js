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
      default: 0,
    },

    model: {
      type: mongoose.Types.ObjectId,
      ref: "Model",
    },

    styles: [
      {
        color: { type: mongoose.Types.ObjectId, ref: "Color" },
        size: { type: mongoose.Types.ObjectId, ref: "Size" },
        quantity: { type: Number },
      },
    ],

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carton", cartonSchema);
