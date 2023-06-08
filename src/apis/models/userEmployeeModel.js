const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userEmployeeSchema = new Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },

  employee: { type: mongoose.Types.ObjectId, ref: "Employee" },

  work: [
    {
      model: { type: mongoose.Types.ObjectId, ref: "Model" },
      order: { type: mongoose.Types.ObjectId, ref: "Order" },
      date: { type: Date, default: new Date() },
    },
  ],

  state: { type: Boolean, default: true },

  details: { type: String },

  note: { type: String },
});

module.exports = mongoose.model("UserEmployee", userEmployeeSchema);
