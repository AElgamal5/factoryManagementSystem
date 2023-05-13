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

    styles: [
      {
        color: { type: mongoose.Types.ObjectId, ref: "Color" },
        size: { type: mongoose.Types.ObjectId, ref: "Size" },
      },
    ],

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Carton", cartonSchema);
