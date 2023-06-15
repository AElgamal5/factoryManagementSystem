const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    code: { type: String },

    model: { type: mongoose.Types.ObjectId, ref: "Model" },

    order: { type: mongoose.Types.ObjectId, ref: "Order" },

    quantity: { type: Number },

    details: { type: String },

    history: [
      {
        state: { type: String },
        date: { type: Date },
      },
    ],

    tracking: [
      {
        stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
        employee: { type: mongoose.Types.ObjectId, ref: "Employee" },
        dateOut: { type: Date },
      },
    ],

    cardErrors: [
      [
        {
          stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
          description: { type: String },
          dateIn: { type: Date },
          dateOut: { type: Date },
          enteredBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
          doneBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
        },
      ],
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
