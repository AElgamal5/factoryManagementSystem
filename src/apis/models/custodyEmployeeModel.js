const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const custodyEmployeeSchema = new Schema(
  {
    employee: {
      type: mongoose.Types.ObjectId,
      ref: "Employee",
    },

    custody: {
      type: mongoose.Types.ObjectId,
      ref: "Custody",
    },

    totalQuantity: {
      type: Number,
      default: 0,
    },

    lastDate: {
      type: Date,
    },

    history: [
      {
        date: { type: Date },
        quantity: { type: Number },
        operation: { type: String },
      },
    ],

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustodyEmployee", custodyEmployeeSchema);
