const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cardSchema = new Schema(
  {
    code: { type: String },

    order: { type: mongoose.Types.ObjectId, ref: "Order" },

    modelIndex: { type: String },

    model: { type: mongoose.Types.ObjectId, ref: "Model" },

    quantity: { type: Number },

    startRange: { type: Number },

    endRange: { type: Number },

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
        enteredBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
        dateOut: { type: Date },
      },
    ],

    currentErrors: [{ type: mongoose.Types.ObjectId, ref: "Stage" }],

    cardErrors: [
      {
        pieceNo: { type: Number },
        pieceErrors: [
          {
            stage: { type: mongoose.Types.ObjectId, ref: "Stage" },
            description: { type: String },
            dateIn: { type: Date },
            addedBy: { type: mongoose.Types.ObjectId, ref: "Employee" },

            enteredBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
            doneBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
            doneIn: { type: Date },

            dateOut: { type: Date },
            verifiedBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
