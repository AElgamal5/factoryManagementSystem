const { check } = require("express-validator");

const createValidate = [
  check("user")
    .notEmpty()
    .withMessage("User's ID is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("User's ID length must be 24"),

  check("employee")
    .notEmpty()
    .withMessage("Employee's ID is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Employee's ID length must be 24"),

  check("details")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Details length must be at least 1 characters")
    .isLength({ max: 200 })
    .withMessage("Details length must be at most 200 characters"),

  check("note")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Note length must be at least 1 characters")
    .isLength({ max: 200 })
    .withMessage("Note length must be at most 200 characters"),
];

const updateValidate = [
  check("user")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("User's ID length must be 24"),

  check("employee")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Employee's ID length must be 24"),

  check("details")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Details length must be at least 1 characters")
    .isLength({ max: 200 })
    .withMessage("Details length must be at most 200 characters"),

  check("note")
    .optional()
    .isString()
    .isLength({ min: 1 })
    .withMessage("Note length must be at least 1 characters")
    .isLength({ max: 200 })
    .withMessage("Note length must be at most 200 characters"),

  check("state")
    .optional()
    .isBoolean()
    .withMessage("State must be Boolean: true or false"),
];

const workValidate = [
  check("order")
    .notEmpty()
    .withMessage("Order's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Order's ID length must be 24"),

  check("model")
    .notEmpty()
    .withMessage("Model's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Model's ID length must be 24"),
];

module.exports = { createValidate, updateValidate, workValidate };
