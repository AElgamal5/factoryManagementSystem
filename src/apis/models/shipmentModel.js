const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const shipmentSchema = new Schema(
  {
    name: { type: String, required: true },

    history: [
      {
        state: { type: String },
        date: { type: Date },
      },
    ],

    cartons: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Carton" },
        quantity: { type: Number },
      },
    ],

    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    exitPermission: { type: String },

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shipment", shipmentSchema);
