const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      required: true,
      unique: true,
    },

    currentCustodies: [
      {
        id: {
          type: mongoose.Types.ObjectId,
          ref: "Custody",
        },
      },
    ],

    currentMachine: [{ type: mongoose.Types.ObjectId, ref: "Machine" }],

    currentStage: [
      {
        id: { type: mongoose.Types.ObjectId, ref: "Stage" },
        name: { type: String },
      },
    ],

    image: { type: String },

    phoneNo: { type: String },

    NID: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
