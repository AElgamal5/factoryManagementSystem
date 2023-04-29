const { check } = require("express-validator");

const maxNo = 2147483646;

const validate = [
  check("custody")
    .notEmpty()
    .withMessage("Custody id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong custody ID"),

  check("employee")
    .notEmpty()
    .withMessage("Employee id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong employee ID"),

  check("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Quantity must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Quantity value is too large"),

  check("operation")
    .notEmpty()
    .withMessage("Operation is required")
    .isString()
    .withMessage("Operation must be String")
    .isLength({ min: 3, max: 20 })
    .withMessage("Operation must contain from 3 to 20 characters"),
];

module.exports = {
  validate,
};
