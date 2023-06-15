const { check } = require("express-validator");

const maxNo = 2147483646;

const createValidate = [
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

  check("model")
    .notEmpty()
    .withMessage("Card's model is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong card's model id"),

  check("order")
    .notEmpty()
    .withMessage("Card's order is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong card's order id"),

  check("quantity")
    .notEmpty()
    .withMessage("Card's quantity is required")
    .isNumeric()
    .withMessage("Card's quantity must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's quantity range form 1 to ${maxNo}`),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Card's details length should be 3 to 200 characters"),
];

const updateValidate = [
  check("code")
    .optional()
    .isString()
    .withMessage("Code must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Code length should be 1 to 200 characters"),

  check("model")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong card's model id"),

  check("order")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong card's order id"),

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Card's quantity must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's quantity range form 1 to ${maxNo}`),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Card's details length should be 3 to 200 characters"),
];

const trackingValidate = [
  check("stage")
    .notEmpty()
    .withMessage("Stage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong stage id"),

  check("employee")
    .notEmpty()
    .withMessage("Employee is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong employee id"),
];

const cardErrorsValidate = [
  check("cardErrors")
    .notEmpty()
    .withMessage("cardErrors is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage(
      "cardErrors must be an array with in range form 1 to 1000 elements"
    ),

  check("cardErrors.*.*.stage")
    .notEmpty()
    .withMessage("stage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong stage id"),

  check("cardErrors.*.*.description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("description must be string")
    .isLength({ min: 3 })
    .withMessage("description must be at least 3 characters")
    .isLength({ max: 300 })
    .withMessage("description must be at most 300 characters"),

  check("cardErrors.*.*.enteredBy")
    .notEmpty()
    .withMessage("enteredBy is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong enteredBy id"),
];

module.exports = {
  createValidate,
  updateValidate,
  trackingValidate,
  cardErrorsValidate,
};
