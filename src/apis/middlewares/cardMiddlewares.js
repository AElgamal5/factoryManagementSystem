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

  check("modelIndex")
    .notEmpty()
    .withMessage("Card's modelIndex is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong card's modelIndex id"),

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

  check("startRange")
    .notEmpty()
    .withMessage("Card's startRange is required")
    .isNumeric()
    .withMessage("Card's startRange must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's startRange range form 1 to ${maxNo}`),

  check("endRange")
    .notEmpty()
    .withMessage("Card's endRange is required")
    .isNumeric()
    .withMessage("Card's endRange must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's endRange range form 1 to ${maxNo}`),

  check("cutNumber")
    .notEmpty()
    .withMessage("Card's cutNumber is required")
    .isNumeric()
    .withMessage("Card's cutNumber must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's cutNumber range form 1 to ${maxNo}`),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Card's details length should be 3 to 200 characters"),

  check("boxNumber")
    .notEmpty()
    .withMessage("Card's boxNumber is required")
    .isNumeric()
    .withMessage("Card's boxNumber must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's boxNumber range form 1 to ${maxNo}`),
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

  check("modelIndex")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong card's modelIndex id"),

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

  check("startRange")
    .optional()
    .isNumeric()
    .withMessage("Card's startRange must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's startRange range form 1 to ${maxNo}`),

  check("endRange")
    .optional()
    .isNumeric()
    .withMessage("Card's endRange must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's endRange range form 1 to ${maxNo}`),

  check("details")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Card's details length should be 3 to 200 characters"),

  check("boxNumber")
    .optional()
    .isNumeric()
    .withMessage("Card's boxNumber must be a number")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`Card's boxNumber range form 1 to ${maxNo}`),
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

  check("enteredBy")
    .notEmpty()
    .withMessage("enteredBy is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong enteredBy id"),
];

const addErrorsValidate = [
  check("pieceNo")
    .notEmpty()
    .withMessage("pieceNo is required")
    .isInt({ min: 1, max: maxNo })
    .withMessage(`pieceNo range between 1 and ${maxNo}`),

  check("pieceErrors")
    .notEmpty()
    .withMessage("pieceErrors is required")
    .isArray({ min: 1, max: 1000 })
    .withMessage(
      "pieceErrors must be an array with in range form 1 to 1000 elements"
    ),

  check("pieceErrors.*.stage")
    .notEmpty()
    .withMessage("stage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong stage id"),

  check("pieceErrors.*.description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("description must be string")
    .isLength({ min: 3 })
    .withMessage("description must be at least 3 characters")
    .isLength({ max: 300 })
    .withMessage("description must be at most 300 characters"),

  check("pieceErrors.*.enteredBy")
    .notEmpty()
    .withMessage("enteredBy is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong enteredBy id"),
];

const repairValidate = [
  check("stage")
    .notEmpty()
    .withMessage("Stage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong stage id"),

  check("doneBy")
    .notEmpty()
    .withMessage("doneBy is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong doneBy id"),

  check("enteredBy")
    .notEmpty()
    .withMessage("enteredBy is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong enteredBy id"),
];

const confirmErrorsValidate = [
  check("stage")
    .notEmpty()
    .withMessage("stage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong stage id"),

  check("verifiedBy")
    .notEmpty()
    .withMessage("verifiedBy is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong verifiedBy id"),
];

module.exports = {
  createValidate,
  updateValidate,
  trackingValidate,
  addErrorsValidate,
  confirmErrorsValidate,
  repairValidate,
};
