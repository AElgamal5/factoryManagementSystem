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

  check("unit")
    .notEmpty()
    .withMessage("Unit is required")
    .isString()
    .withMessage("Unit must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("Unit length should be 1 to 20 characters"),

  check("role.title")
    .notEmpty()
    .withMessage("Role's title is required")
    .isString()
    .withMessage("Role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role's title length should be 3 to 200 characters"),

  check("role.num")
    .notEmpty()
    .withMessage("Role's num is required")
    .isNumeric()
    .withMessage("Role's num must be a number"),

  check("details")
    .optional()
    .isAlphanumeric()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Details length should be 3 to 200 characters"),

  check("note")
    .optional()
    .isAlphanumeric()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),
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

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Quantity must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Quantity must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Quantity value is too large"),

  check("available")
    .optional()
    .isNumeric()
    .withMessage("Available must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Available must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Available value is too large"),

  check("unit")
    .optional()
    .isString()
    .withMessage("Unit must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("Unit length should be 1 to 20 characters"),

  check("role.title")
    .optional()
    .isString()
    .withMessage("Role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role's title length should be 3 to 200 characters"),

  check("role.num")
    .optional()
    .isNumeric()
    .withMessage("Role's num must be a number"),

  check("details")
    .optional()
    .isAlphanumeric()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Details length should be 3 to 200 characters"),

  check("note")
    .optional()
    .isAlphanumeric()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),
];

module.exports = {
  createValidate,
  updateValidate,
};
