const express = require("express");

const router = express.Router();

const { materialEmployeeController } = require("../controllers");
const {
  validationResult,
  materialEmployeeMiddlewares,
  idValidation,
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

router.get(
  "/employee/:id",
  idValidation,
  materialEmployeeController.allMaterialsForEmployee
);

router.get(
  "/material/:id",
  idValidation,
  materialEmployeeController.allEmployeesForMaterial
);

router.patch(
  "/note/:id",
  materialEmployeeMiddlewares.noteValidate,
  validationResult,
  materialEmployeeController.updateNote
);

router.get("/:id", idValidation, materialEmployeeController.getByID);

router.get(
  "/material/:mid/employee/:eid",
  materialEmployeeController.getByMaterialIDAndEmployeeID
);

module.exports = router;
