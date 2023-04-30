const { check } = require("express-validator");

const maxNo = 2147483646;

const validate = [
  check("title")
    .notEmpty()
    .withMessage("Role's title is required")
    .isString()
    .withMessage("Role's title must be a String")
    .isLength({
      min: 3,
      max: 200,
    })
    .withMessage("Role's title length should be 3 to 200 characters"),

  check("number")
    .notEmpty()
    .withMessage("Role's number is required")
    .isInt({ min: 1, max: maxNo })
    .withMessage("Role's number min should be at lest = 1"),
];

module.exports = { validate };
