const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    // //0 employee, 1 supervisor
    // role: {
    //   title: { type: String, required: true },
    //   num: { type: Number, required: true },
    // },
    role: { type: mongoose.Types.ObjectId, ref: "Role", required: true },

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
        totalQuantity: {
          type: Number,
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

    image: { type: mongoose.Types.ObjectId, ref: "Image" },

    phoneNo: { type: String },

    NID: { type: String },

    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
