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

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Details length should be 3 to 200 characters"),
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

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Details length should be 3 to 200 characters"),
];

const materialValidate = [
  check("materials")
    .notEmpty()
    .withMessage("Buy Request's materials array is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Buy Request's materials must be array with length 1 to 1000"),

  check("materials.*.material")
    .notEmpty()
    .withMessage("material's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong material id"),

  check("materials.*.quantity")
    .notEmpty()
    .withMessage("Material's quantity is required")
    .isNumeric()
    .withMessage("Material's quantity bust be a number")
    .isFloat({ min: 0.1 })
    .withMessage("Material's quantity must be greater than 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Material's quantity is too big"),

  check("materials.*.price")
    .optional()
    .isNumeric()
    .withMessage("Material's price bust be a number")
    .isFloat({ min: 0.1 })
    .withMessage("Material's price must be greater than 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Material's price is too big"),

  check("materials.*.supplier")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong material supplier"),
];

const custodyValidate = [
  check("custodies")
    .notEmpty()
    .withMessage("Buy Request's custodies is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Buy Request's custodies must be array with length 1 to 1000"),

  check("custodies.*.custody")
    .notEmpty()
    .withMessage("Custody's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong custody id"),

  check("custodies.*.quantity")
    .notEmpty()
    .withMessage("Custody's quantity is required")
    .isNumeric()
    .withMessage("Custody's quantity bust be a number")
    .isFloat({ min: 0.1 })
    .withMessage("Custody's quantity must be greater than 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Custody's quantity is too big"),

  check("custodies.*.price")
    .optional()
    .isNumeric()
    .withMessage("Custody's price bust be a number")
    .isFloat({ min: 0.1 })
    .withMessage("Custody's price must be greater than 0.1")
    .isFloat({ max: maxNo })
    .withMessage("Custody's price is too big"),

  check("custodies.*.supplier")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong custody supplier"),
];

module.exports = {
  createValidate,
  updateValidate,
  materialValidate,
  custodyValidate,
};
