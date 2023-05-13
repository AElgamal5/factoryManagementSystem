const { check } = require("express-validator");

const maxNo = 2147483646;

const createValidate = [
  check("name")
    .notEmpty()
    .withMessage("Shipment's name is required")
    .isString()
    .withMessage("Shipment's name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Shipment's name length should be 1 to 200 characters"),

  check("order")
    .notEmpty()
    .withMessage("Order id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong order ID"),

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

const addCartonsValidate = [
  check("cartons")
    .notEmpty()
    .withMessage("Shipment's cartons is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Shipment's cartons must be an array in range 1 to 1000"),

  check("cartons.*.id")
    .notEmpty()
    .withMessage("Carton id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong carton id"),

  check("cartons.*.quantity")
    .notEmpty()
    .withMessage("Carton's quantity is required")
    .isNumeric()
    .withMessage("Carton's quantity must be a number")
    .isInt({ min: 1 })
    .withMessage("carton's quantity must be greater than or equal to 1")
    .isInt({ max: maxNo })
    .withMessage("carton's quantity is too big"),
];

const removeCartonsValidate = [
  check("cartons")
    .notEmpty()
    .withMessage("Shipment's cartons is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Shipment's cartons must be an array in range 1 to 1000"),
];

const updateValidate = [
  check("name")
    .optional()
    .isString()
    .withMessage("Shipment's name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Shipment's name length should be 1 to 200 characters"),

  check("order")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong order ID"),

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

module.exports = {
  createValidate,
  addCartonsValidate,
  removeCartonsValidate,
  updateValidate,
};
