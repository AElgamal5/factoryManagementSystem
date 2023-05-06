const { check } = require("express-validator");

const validate = [
  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isString()
    .withMessage("Type must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Type length should be 1 to 200 characters"),
];

module.exports = { validate };
