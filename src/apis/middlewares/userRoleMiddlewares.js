const { check } = require("express-validator");

const createValidate = [
  check("title")
    .notEmpty()
    .withMessage("User role's title is required")
    .isString()
    .withMessage("User role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("User role's title length should be 3 to 200 characters"),

  check("number")
    .notEmpty()
    .withMessage("User role's number is required")
    .isNumeric()
    .withMessage("User role's number must be a number")
    .isInt({ min: 0 })
    .withMessage("User role's number minimum is zero")
    .isInt({ max: 1000 })
    .withMessage("User role's number maximum is 1000"),

  check("privileges")
    .notEmpty()
    .withMessage("User role's privileges is required")
    .isArray()
    .withMessage("User role's privileges must be an array")
    .isArray({ min: 1, max: 1000 })
    .withMessage("User role's privileges must be in range from 1 to 1000"),
];

const updateValidation = [
  check("title")
    .optional()
    .isString()
    .withMessage("User role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("User role's title length should be 3 to 200 characters"),

  check("number")
    .optional()
    .isNumeric()
    .withMessage("User role's number must be a number")
    .isInt({ min: 0 })
    .withMessage("User role's number minimum is zero")
    .isInt({ max: 1000 })
    .withMessage("User role's number maximum is 1000"),

  check("privileges")
    .optional()
    .isArray()
    .withMessage("User role's privileges must be an array")
    .isArray({ min: 1, max: 1000 })
    .withMessage("User role's privileges must be in range from 1 to 1000"),
];

module.exports = { createValidate, updateValidation };
