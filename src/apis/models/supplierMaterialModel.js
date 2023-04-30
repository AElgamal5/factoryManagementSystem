const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const supplierMaterialSchema = new Schema(
  {
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "Supplier",
    },

    material: {
      type: mongoose.Types.ObjectId,
      ref: "Material",
    },

    totalQuantity: { type: Number, default: 0 },

    totalCost: { type: Number, default: 0 },

    lastPrice: { type: Number },

    lastDate: { type: Date },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierMaterial", supplierMaterialSchema);
