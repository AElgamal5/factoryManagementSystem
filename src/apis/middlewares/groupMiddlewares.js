const { check } = require("express-validator");

const createValidate = [
  check("employee")
    .notEmpty()
    .withMessage("stage's employee is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong employee id"),

  check("order")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong order id"),

  check("model")
    .notEmpty()
    .withMessage("stage's model is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model id"),

  check("startStage")
    .notEmpty()
    .withMessage("stage's startStage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong startStage id"),

  check("endStage")
    .notEmpty()
    .withMessage("stage's endStage is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong endStage id"),
];

const updateValidate = [
  check("employee")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong employee id"),

  check("order")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong order id"),

  check("model")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong model id"),

  check("startStage")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong startStage id"),

  check("endStage")
    .optional()
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong endStage id"),
];

module.exports = { createValidate, updateValidate };
