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

    lastPrice: { type: Number },

    lastDate: { type: Date },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierMaterial", supplierMaterialSchema);
