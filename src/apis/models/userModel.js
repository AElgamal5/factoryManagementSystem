const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },

  code: { type: String, required: true },

  role: { type: mongoose.Types.ObjectId, ref: "UserRole" },

  password: { type: String },

  image: { type: String },

  token: { type: String },

  state: { type: Number, default: 1 },
});

module.exports = mongoose.model("User", userSchema);
