const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: { type: String, required: true },

    models: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Model" },
        color: { name: { type: String }, code: { type: String } },
        size: { name: { type: String }, code: { type: String } },
        quantity: { type: Number },
      },
    ],

    shipments: [{ type: mongoose.Types.ObjectId, ref: "Shipment" }],

    totalQuantity: { type: Number },

    client: { type: mongoose.Types.ObjectId, ref: "Client" },

    totalMaterialsRequired: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Material" },
        quantity: { type: Number },
      },
    ],

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
