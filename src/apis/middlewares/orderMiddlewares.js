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

  check("client")
    .notEmpty()
    .withMessage("Client id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong client ID"),
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

  check("client")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong client ID"),

  check("status")
    .optional()
    .isBoolean()
    .withMessage("status must be a boolean"),
];

const updateModelsValidate = [
  check("models")
    .notEmpty()
    .withMessage("Order's models is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Order's models must be array with length 1 to 1000"),

  check("models.*.id")
    .notEmpty()
    .withMessage("model's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model id"),

  check("models.*.color")
    .notEmpty()
    .withMessage("model's color is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model's color id"),

  check("models.*.size")
    .notEmpty()
    .withMessage("model's size is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model's size id"),

  check("models.*.quantity")
    .notEmpty()
    .withMessage("model's quantity is required")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`model's quantity must be in range form 1 to ${maxNo}`),

  check("models.*.code")
    .notEmpty()
    .withMessage("model's code is required")
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage(`model's code must be in range form 1 to 100`),
];

const updateClientMaterialsValidate = [
  check("order")
    .notEmpty()
    .withMessage("order's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong order id"),

  check("clientMaterials")
    .notEmpty()
    .withMessage("Client material is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Client material must be array with length 1 to 1000"),

  check("clientMaterials.*.material")
    .notEmpty()
    .withMessage("material is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong material id"),

  check("clientMaterials.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isFloat({ min: 0.1, max: maxNo })
    .withMessage(`Quantity must be in range form 0.1 to ${maxNo}`),

  // check("clientMaterials.*.date")
  //   .notEmpty()
  //   .withMessage("date is required")
  //   .isDate()
  //   .withMessage(`Wrong date format`),
];

const sequenceValidate = [
  check("sequence")
    .notEmpty()
    .withMessage("Sequence is required")
    .isBoolean()
    .withMessage("Sequence must be boolean"),
];

module.exports = {
  createValidate,
  updateValidate,
  updateModelsValidate,
  updateClientMaterialsValidate,
  sequenceValidate,
};
