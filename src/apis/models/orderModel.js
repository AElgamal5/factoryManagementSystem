const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    name: { type: String, required: true },

    models: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Model" },
        color: { type: mongoose.Types.ObjectId, ref: "Color" },
        size: { type: mongoose.Types.ObjectId, ref: "Size" },
        quantity: { type: Number },
      },
    ],

    shipments: [{ type: mongoose.Types.ObjectId, ref: "Shipment" }],

    client: { type: mongoose.Types.ObjectId, ref: "Client" },

    totalMaterialsRequired: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Material" },
        quantity: { type: Number },
      },
    ],

    totalQuantity: { type: Number, default: 0 },

    // image: { type: mongoose.Types.ObjectId, ref: "Image" },

    details: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
