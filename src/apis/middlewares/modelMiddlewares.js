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
    .withMessage("Model's colors is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's colors must be array with length 1 to 1000"),

  check("colors.*")
    .notEmpty()
    .withMessage("Color is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong color id"),

  check("sizes")
    .notEmpty()
    .withMessage("Model's sizes is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's sizes must be array with length 1 to 1000"),

  check("sizes.*")
    .notEmpty()
    .withMessage("Size is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong size id"),
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

  check("code")
    .optional()
    .isString()
    .withMessage("Code must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Code length should be 1 to 200 characters"),

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
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's colors must be array with length 1 to 1000"),

  check("colors.*")
    .notEmpty()
    .withMessage("Color is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong color id"),

  check("sizes")
    .optional()
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's sizes must be array with length 1 to 1000"),

  check("sizes.*")
    .notEmpty()
    .withMessage("Size is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong size id"),
];

const addStagesValidation = [
  check("stages")
    .notEmpty()
    .withMessage("Model's stages is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's stages must be array with length 1 to 1000"),

  check("stages.*.id")
    .notEmpty()
    .withMessage("stage's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong stage id"),

  check("stages.*.priority")
    .notEmpty()
    .withMessage("stage's priority is required")
    .isInt({ min: 0 })
    .withMessage("Minimum stage's priority is 1")
    .isInt({ max: 1000 })
    .withMessage("Maximum stage's priority is 1000"),

  // check("stages.*.machineType")
  //   .notEmpty()
  //   .withMessage("stage's machineType is required")
  //   .isString()
  //   .isLength({ min: 3 })
  //   .withMessage("Minimum stage's machineType is 3")
  //   .isLength({ max: 200 })
  //   .withMessage("Maximum stage's machineType is 200"),
];

const removeStagesValidation = [
  check("stages")
    .notEmpty()
    .withMessage("Model's stages is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's stages must be array with length 1 to 1000"),
];

const addConsumptionsValidation = [
  check("consumptions")
    .notEmpty()
    .withMessage("Model's consumptions is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's consumptions must be array with length 1 to 1000"),

  check("consumptions.*.material")
    .notEmpty()
    .withMessage("material's id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong material id"),

  check("consumptions.*.quantity")
    .notEmpty()
    .withMessage("material's quantity is required")
    .isFloat({ min: 0.001 })
    .withMessage("material's quantity minimum is 0.1")
    .isFloat({ max: maxNo })
    .withMessage(`material's quantity maximum is ${maxNo}`),

  check("consumptions.*.colors")
    .notEmpty()
    .withMessage("Colors array is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Colors array must be array with length 1 to 1000"),

  check("consumptions.*.sizes")
    .notEmpty()
    .withMessage("Sizes array is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Sizes array must be array with length 1 to 1000"),
];

const removeConsumptionsValidation = [
  check("consumptions")
    .notEmpty()
    .withMessage("Model's consumptions is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage("Model's consumptions must be array with length 1 to 1000"),
];

module.exports = {
  createValidate,
  updateValidate,
  addStagesValidation,
  removeStagesValidation,
  addConsumptionsValidation,
  removeConsumptionsValidation,
};
