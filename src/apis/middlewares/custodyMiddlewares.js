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

  check("role")
    .notEmpty()
    .withMessage("Role id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Role id must be 24 characters"),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Details length should be 3 to 200 characters"),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),

  check("max")
    .notEmpty()
    .withMessage("Max quantity is required")
    .isNumeric()
    .withMessage("Max quantity must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Max quantity must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Max quantity value is too large"),

  check("min")
    .notEmpty()
    .withMessage("Min quantity is required")
    .isNumeric()
    .withMessage("Min quantity must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Min quantity must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Min quantity value is too large"),
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

  check("unit")
    .optional()
    .isString()
    .withMessage("Unit must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("Unit length should be 1 to 20 characters"),

  check("role")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Role id must be 24 characters"),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Details length should be 3 to 200 characters"),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),

  check("max")
    .optional()
    .isNumeric()
    .withMessage("Max quantity must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Max quantity must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Max quantity value is too large"),

  check("min")
    .optional()
    .isNumeric()
    .withMessage("Min quantity must contain numbers only")
    .isFloat({ min: 0.1 })
    .withMessage("Min quantity must be greater than or equal 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Min quantity value is too large"),
];

module.exports = {
  createValidate,
  updateValidate,
};
