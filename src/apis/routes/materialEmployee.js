const express = require("express");

const router = express.Router();

const { materialEmployeeController } = require("../controllers");
const {
  validationResult,
  materialEmployeeMiddlewares,
} = require("../middlewares");

router.post(
  "/assign",
  materialEmployeeMiddlewares.validate,
  validationResult,
  materialEmployeeController.assign
);

router.patch(
  "/back",
  materialEmployeeMiddlewares.validate,
  validationResult,
  materialEmployeeController.back
);

module.exports = router;
