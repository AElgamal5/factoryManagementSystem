const { check } = require("express-validator");

const maxNo = 2147483646;

const createValidate = [
  check("name")
    .notEmpty()
    .withMessage("Carton's name is required")
    .isString()
    .withMessage("Carton's name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Carton's name length should be 1 to 200 characters"),

  check("quantity")
    .notEmpty()
    .withMessage("Carton's quantity is required")
    .isNumeric()
    .withMessage("Carton's quantity must contain numbers only")
    .isInt({ min: 1 })
    .withMessage("Carton's quantity must be greater than or equal 1")
    .isInt({ max: maxNo })
    .withMessage("Carton's quantity value is too large"),

  check("model")
    .notEmpty()
    .withMessage("Model id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model ID"),

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
];

const updateValidate = [
  check("name")
    .optional()
    .isString()
    .withMessage("Carton's name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Color's name length should be 1 to 200 characters"),

  check("quantity")
    .optional()
    .isNumeric()
    .withMessage("Carton's quantity must contain numbers only")
    .isInt({ min: 1 })
    .withMessage("Carton's quantity must be greater than or equal 1")
    .isInt({ max: maxNo })
    .withMessage("Carton's quantity value is too large"),

  check("model")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model ID"),

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
];

const stylesValidate = [
  check("styles")
    .notEmpty()
    .withMessage("Carton's styles array is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Carton's styles must be array with length 1 to 1000"),

  check("styles.*.color")
    .notEmpty()
    .withMessage("Color's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong color id"),

  check("styles.*.size")
    .notEmpty()
    .withMessage("Size's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong size id"),
];

module.exports = { createValidate, updateValidate, stylesValidate };
