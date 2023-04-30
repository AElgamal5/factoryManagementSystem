const { check } = require("express-validator");

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

  check("phoneNo")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage("Phone number must be 11 numbers")
    .isNumeric()
    .withMessage("Phone number contain numbers only"),

  check("address")
    .optional()
    .isString()
    .withMessage("Address must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Address length should be 3 to 200 characters"),

  check("state")
    .optional()
    .isString()
    .withMessage("State must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("State length should be 1 to 20 characters"),

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
    .withMessage("Name must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Name length should be 3 to 200 characters"),

  check("phoneNo")
    .optional()
    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage("Phone number must be 11 numbers")
    .isNumeric()
    .withMessage("Phone number contain numbers only"),

  check("address")
    .optional()
    .isString()
    .withMessage("Address must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Address length should be 3 to 200 characters"),

  check("state")
    .optional()
    .isString()
    .withMessage("State must be a String")
    .isLength({
      min: 1,
      max: 20,
    })
    .withMessage("State length should be 1 to 20 characters"),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),
];

module.exports = { createValidate, updateValidate };
