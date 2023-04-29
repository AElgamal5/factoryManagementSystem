const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const materialEmployeeSchema = new Schema(
  {
    employee: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },

    material: {
      type: mongoose.Types.ObjectId,
      ref: "Material",
    },

    totalQuantity: {
      type: Number,
      default: 0,
    },

    lastDate: {
      type: Date,
    },

    log: [
      {
        date: { type: Date },
        quantity: { type: Number },
        operation: { type: String },
      },
    ],

    order: {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },

    model: {
      type: mongoose.Types.ObjectId,
      ref: "Model",
    },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaterialEmployee", materialEmployeeSchema);
