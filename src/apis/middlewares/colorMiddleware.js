const { check } = require("express-validator");

const validate = [
  check("name")
    .notEmpty()
    .withMessage("Color's name is required")
    .isString()
    .withMessage("Color's name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Color's name length should be 1 to 200 characters"),

  check("code")
    .notEmpty()
    .withMessage("Color's code is required")
    .isString()
    .withMessage("Color's code must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Color's code length should be 1 to 200 characters"),
];

module.exports = { validate };
