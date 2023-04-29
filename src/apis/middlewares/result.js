const { validationResult } = require("express-validator");

const result = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.json(errors);
  } else {
    next();
  }
};

module.exports = result;
