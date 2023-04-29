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

  check("role")
    .notEmpty()
    .withMessage("Role is required")
    .isString()
    .withMessage("Role must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role length should be 3 to 200 characters"),

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

  check("role")
    .optional()
    .isString()
    .withMessage("Role must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role length should be 3 to 200 characters"),

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
];

module.exports = { createValidate, updateValidate };
