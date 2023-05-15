const { check } = require("express-validator");

const validate = [
  check("name")
    .notEmpty()
    .withMessage("Machine type's name is required")
    .isString()
    .withMessage("Machine type's name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Machine type's name length should be 1 to 200 characters"),
];

module.exports = { validate };
