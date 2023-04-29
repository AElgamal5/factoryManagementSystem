const { errorFormat, idCheck } = require("../utils");

const idValidation = (req, res, next) => {
  const id = req.params.id;

  if (!idCheck(id)) {
    return res
      .status(400)
      .json(errorFormat(id, "This id is invalid", "id", "header"));
  }
  next();
};

module.exports = idValidation;
