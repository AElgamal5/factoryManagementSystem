const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: { type: String, required: true },

    details: { type: String },

    models: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Model" },
        color: { type: String },
        size: { type: String },
        quantity: { type: Number },
      },
    ],

    shipments: [{ type: mongoose.Types.ObjectId, ref: "Shipment" }],

    totalQuantity: { type: Number },

    client: { type: mongoose.Types.ObjectId, ref: "Client" },

    materials: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Material" },
        quantity: { type: Number },
      },
    ],

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
