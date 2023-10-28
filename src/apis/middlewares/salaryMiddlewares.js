const { check } = require("express-validator");

const maxNo = 2147483646;

const addIdleValidate = [
  check("reason")
    .notEmpty()
    .withMessage("Idle's reason is required")
    .isString()
    .withMessage("Idle's reason must be a String")
    .isLength({
      min: 1,
      max: 200,
    })
    .withMessage("Idle's reason length should be 1 to 200 characters"),

  check("employee")
    .notEmpty()
    .withMessage("employee id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong employee ID"),

  check("addedBy")
    .notEmpty()
    .withMessage("addedBy id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong addedBy ID"),
];

const removeIdleValidate = [
  check("employee")
    .notEmpty()
    .withMessage("employee id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong employee ID"),

  check("doneBy")
    .notEmpty()
    .withMessage("doneBy id is required")
    .isAlphanumeric()
    .isLength({ min: 24, max: 24 })
    .withMessage("Wrong doneBy ID"),

  check("minus")
    .optional()
    .isInt({ min: 1, max: maxNo })
    .withMessage("minus must be a number greater than 0"),
];

module.exports = {
  addIdleValidate,
  removeIdleValidate,
};
