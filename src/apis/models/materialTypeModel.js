const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const materialTypeSchema = new Schema({
  type: { type: String, required: true },
});

module.exports = mongoose.model("MaterialType", materialTypeSchema);
