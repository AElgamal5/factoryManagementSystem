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

  check("code", "Code is required").notEmpty(),
  check("code", "Code length should be 1 to 20 characters").isLength({
    min: 1,
    max: 20,
  }),

  check("role.title")
    .notEmpty()
    .withMessage("Role's title is required")
    .isString()
    .withMessage("Role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role's title length should be 3 to 200 characters"),

  check("role.num")
    .notEmpty()
    .withMessage("Role's num is required")
    .isNumeric()
    .withMessage("Role's num must be a number"),

  check("phoneNo")
    .isLength({
      min: 11,
      max: 11,
    })
    .withMessage("Phone number must be 11 numbers")
    .isNumeric()
    .withMessage("Phone number contain numbers only"),

  check("NID")
    .isLength({
      min: 14,
      max: 14,
    })
    .withMessage("National number must be 14 numbers")
    .isNumeric()
    .withMessage("National number contain numbers only"),

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

  check("code")
    .optional()
    .isLength({ min: 1, max: 20 })
    .withMessage("Code length should be 1 to 20 characters"),

  check("role.title")
    .optional()
    .isString()
    .withMessage("Role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role's title length should be 3 to 200 characters"),

  check("role.num")
    .optional()
    .isNumeric()
    .withMessage("Role's num must be a number"),

  check("phoneNo")
    .optional()
    .isLength({ min: 11, max: 11 })
    .withMessage("Phone number must be 11 numbers")
    .isNumeric()
    .withMessage("Phone number contain numbers only"),

  check("NID")
    .optional()
    .isLength({
      min: 14,
      max: 14,
    })
    .withMessage("National number must be 14 numbers")
    .isNumeric()
    .withMessage("National number contain numbers only"),

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
