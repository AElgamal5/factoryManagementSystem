const mongoose = require("mongoose");

const idCheck = (id) => {
  const idValidation = mongoose.Types.ObjectId.isValid(id);
  return idValidation;
};

module.exports = idCheck;
