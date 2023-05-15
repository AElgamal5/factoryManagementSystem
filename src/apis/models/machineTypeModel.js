const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const machineTypeSchema = new Schema({
  name: { type: String, required: true },
});

module.exports = mongoose.model("MachineType", machineTypeSchema);
