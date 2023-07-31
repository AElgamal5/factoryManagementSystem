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

    cutNumber: { type: Number },

    boxNumber: { type: Number },

    details: { type: String },

    done: { type: Boolean, default: false },

    color: { type: mongoose.Types.ObjectId, ref: "Color" },

    size: { type: mongoose.Types.ObjectId, ref: "Size" },

    history: [
      {
        state: { type: String },
        type: { type: String },
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

            // modifyNumber: { type: Number, default: 0 },
          },
        ],
      },
    ],

    globalErrors: [
      {
        pieceNo: { type: Number },
        description: { type: String },
        addedBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
        dateIn: { type: Date },

        dateOut: { type: Date },
        verifiedBy: { type: mongoose.Types.ObjectId, ref: "Employee" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", cardSchema);
