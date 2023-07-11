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

  check("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Code length must be 1 to 20 characters"),

  check("role")
    .notEmpty()
    .withMessage("Role id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Role id must be 24 characters"),

  check("phoneNo")
    .optional()
    .isNumeric()
    .withMessage("Phone number contain numbers only")
    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage("Phone number must be 11 numbers"),

  check("NID")
    .optional()
    .isNumeric()
    .withMessage("National number contain numbers only")
    .isLength({
      min: 14,
      max: 14,
    })
    .withMessage("National number must be 14 numbers"),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),
];

const codeValidate = [
  check("code")
    .notEmpty()
    .withMessage("Code is required")
    .isString()
    .isLength({ min: 1, max: 20 })
    .withMessage("Code length must be 1 to 20 characters"),
];

const nameValidate = [
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Name length should be 1 to 200 characters"),
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
    .isLength({ min: 1, max: 20 })
    .withMessage("Code length must be 1 to 20 characters"),

  check("role")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Role id must be 24 characters"),

  check("phoneNo")
    .optional()
    .isNumeric()
    .withMessage("Phone number contain numbers only")
    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage("Phone number must be 11 numbers"),

  check("NID")
    .optional()
    .isNumeric()
    .withMessage("National number contain numbers only")
    .isLength({
      min: 14,
      max: 14,
    })
    .withMessage("National number must be 14 numbers"),

  check("note")
    .optional()
    .isString()
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Note length should be 3 to 200 characters"),
];

module.exports = { createValidate, codeValidate, nameValidate, updateValidate };
