const { check } = require("express-validator");

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

  check("client")
    .notEmpty()
    .withMessage("Client id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong client ID"),

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
    .isArray()
    .withMessage("Shipment's cartons must be an array"),

  check("cartons.*.id").notEmpty().withMessage("cartons id is required"),
  check("cartons.*.quantity")
    .notEmpty()
    .withMessage("cartons quantity is required"),
];

const removeCartonsValidate = [
  check("cartons")
    .notEmpty()
    .withMessage("Shipment's cartons is required")
    .isArray()
    .withMessage("Shipment's cartons must be an array"),
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

  check("client")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong client ID"),

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
