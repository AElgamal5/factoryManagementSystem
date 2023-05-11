const { check } = require("express-validator");

const maxNo = 2147483646;

const validate = [
  check("material")
    .notEmpty()
    .withMessage("Material id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong material ID"),

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

  // check("order")
  //   .optional()
  //   .isAlphanumeric()
  //   .isLength({ min: 24, max: 24 })
  //   .withMessage("Wrong order ID"),

  // check("model")
  //   .optional()
  //   .isAlphanumeric()
  //   .isLength({ min: 24, max: 24 })
  //   .withMessage("Wrong model ID"),
];

const noteValidate = [
  check("note")
    .notEmpty()
    .withMessage("Note is required")
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),
];

module.exports = {
  validate,
  noteValidate,
};
