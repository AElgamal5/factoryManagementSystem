const { check } = require("express-validator");

const maxNo = 2147483646;

const createValidate = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Name length should be 3 to 200 characters"),

  check("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Code length should be 1 to 200 characters"),

  check("type")
    .optional()
    .isString()
    .withMessage("Type must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Type length should be 3 to 200 characters"),

  check("rate")
    .optional()
    .isNumeric()
    .withMessage("Rate must be a number")
    .isFloat({ min: 0.1, max: maxNo })
    .withMessage(`Rate range form 0.1 to ${maxNo}`),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0.1, max: maxNo })
    .withMessage(`Price range form 0.1 to ${maxNo}`),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),

  check("machineType")
    .notEmpty()
    .withMessage("stage's machineType is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong machineType id"),
];

const updateValidate = [
  check("name")
    .optional()
    .isString()
    .withMessage("Name must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Name length should be 3 to 200 characters"),

  check("code")
    .optional()
    .isString()
    .withMessage("Code must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Code length should be 1 to 200 characters"),

  check("type")
    .optional()
    .isString()
    .withMessage("Type must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Type length should be 3 to 200 characters"),

  check("rate")
    .optional()
    .isNumeric()
    .withMessage("Rate must be a number")
    .isFloat({ min: 0.1, max: maxNo })
    .withMessage(`Rate range form 0.1 to ${maxNo}`),

  check("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0.1, max: maxNo })
    .withMessage(`Price range form 0.1 to ${maxNo}`),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),

  check("machineType")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong machineType id"),
];

module.exports = { createValidate, updateValidate };
