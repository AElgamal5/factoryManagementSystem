const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const supplierCustodySchema = new Schema(
  {
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: "Supplier",
    },

    custody: {
      type: mongoose.Types.ObjectId,
      ref: "Custody",
    },

    lastPrice: { type: Number },

    lastDate: { type: Date },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SupplierCustody", supplierCustodySchema);
