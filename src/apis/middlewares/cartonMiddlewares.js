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

  check("shipment")
    .notEmpty()
    .withMessage("Shipment id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong shipment ID"),

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

  check("colors")
    .notEmpty()
    .withMessage("Carton's colors is required")
    .isArray()
    .withMessage("Carton's colors must be an array"),

  check("colors.*.name").notEmpty().withMessage("colors name is required"),
  check("colors.*.code").notEmpty().withMessage("colors code is required"),

  check("sizes")
    .notEmpty()
    .withMessage("Carton's sizes is required")
    .isArray()
    .withMessage("Carton's sizes must be an array"),

  check("sizes.*.name").notEmpty().withMessage("sizes name is required"),
  check("sizes.*.code").notEmpty().withMessage("sizes code is required"),
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

  check("shipment")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong shipment ID"),

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

  check("colors")
    .optional()
    .isArray()
    .withMessage("Carton's colors must be an array"),

  check("colors.*.name").notEmpty().withMessage("colors name is required"),
  check("colors.*.code").notEmpty().withMessage("colors code is required"),

  check("sizes")
    .optional()
    .isArray()
    .withMessage("Carton's sizes must be an array"),

  check("sizes.*.name").notEmpty().withMessage("sizes name is required"),
  check("sizes.*.code").notEmpty().withMessage("sizes code is required"),
];

module.exports = { createValidate, updateValidate };
