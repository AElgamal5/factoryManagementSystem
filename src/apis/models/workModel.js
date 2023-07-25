const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workSchema = new Schema(
  {
    employee: { type: mongoose.Types.ObjectId, ref: "Employee" },

    totalCards: { type: Number, default: 0 },

    todayCards: { type: Number, default: 0 },

    date: {
      year: { type: Number },
      month: { type: Number },
      day: { type: Number },
    },

    workHistory: [
      {
        day: { type: Number },
        cards: [
          {
            card: { type: mongoose.Types.ObjectId, ref: "Card" },
            stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
            date: { type: Date },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Work", workSchema);
