const { check } = require("express-validator");

const loginValidate = [
  check("code")
    .notEmpty()
    .withMessage("User's code is required")
    .isString()
    .withMessage("User's code must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("User's code length should be 1 to 20 characters"),

  check("password")
    .notEmpty()
    .withMessage("User's password is required")
    .isString()
    .withMessage("User's password must be a String")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("User's password is Wrong"),
];

module.exports = { loginValidate };
