const express = require("express");

const router = express.Router();

const { custodyEmployeeController } = require("../controllers");
const {
  validationResult,
  custodyEmployeeMiddlewares,
  materialEmployeeMiddlewares,
  idValidation,
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

router.get(
  "/employee/:id",
  idValidation,
  custodyEmployeeController.allCustodiesForEmployee
);

router.get(
  "/custody/:id",
  idValidation,
  custodyEmployeeController.allEmployeesForCustody
);

router.patch(
  "/note/:id",
  materialEmployeeMiddlewares.noteValidate,
  validationResult,
  custodyEmployeeController.updateNote
);

module.exports = router;
