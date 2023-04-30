const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roleSchema = new Schema({
  title: { type: String, required: true },

  number: { type: Number, required: true },
});

module.exports = mongoose.model("Role", roleSchema);
