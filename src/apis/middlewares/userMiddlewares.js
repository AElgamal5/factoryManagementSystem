const { check } = require("express-validator");

const createValidate = [
  check("name")
    .notEmpty()
    .withMessage("User's name is required")
    .isString()
    .withMessage("User's name must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("User's name length should be 3 to 200 characters"),

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

  check("role")
    .notEmpty()
    .withMessage("User's role is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("User's role length must be 24"),

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
    .withMessage("User's password is weak"),
];

const updateValidate = [
  check("name")
    .optional()
    .isString()
    .withMessage("User's name must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("User's name length should be 3 to 200 characters"),

  check("code")
    .optional()
    .isString()
    .withMessage("User's code must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("User's code length should be 1 to 20 characters"),

  check("role")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("User's role length must be 24"),

  check("password")
    .optional()
    .isString()
    .withMessage("User's password must be a String")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("User's password is weak"),

  check("state")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage("User's state 0 for disable and 1 for enable"),
];

module.exports = { createValidate, updateValidate };
