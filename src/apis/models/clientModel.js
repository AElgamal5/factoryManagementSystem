const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const clientSchema = new Schema(
  {
    name: { type: String, required: true },

    phoneNo: { type: String, required: true },

    address: { type: String },

    state: { type: String },

    note: { type: String },

    image: { type: mongoose.Types.ObjectId, ref: "Image" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", clientSchema);
