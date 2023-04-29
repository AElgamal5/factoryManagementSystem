const express = require("express");

const router = express.Router();

const { custodyEmployeeController } = require("../controllers");
const {
  validationResult,
  custodyEmployeeMiddlewares,
} = require("../middlewares");

router.post(
  "/assign",
  custodyEmployeeMiddlewares.validate,
  validationResult,
  custodyEmployeeController.assign
);

router.patch(
  "/back",
  custodyEmployeeMiddlewares.validate,
  validationResult,
  custodyEmployeeController.back
);

module.exports = router;
