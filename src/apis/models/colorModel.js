const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const colorSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  image: { type: mongoose.Types.ObjectId, ref: "Image" },
});

module.exports = mongoose.model("Color", colorSchema);
