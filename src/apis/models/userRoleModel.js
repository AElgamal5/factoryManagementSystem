const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userRoleSchema = new Schema({
  title: { type: String, required: true },

  number: { type: Number, required: true },

  privileges: [{ type: String }],
});

module.exports = mongoose.model("UserRole", userRoleSchema);
