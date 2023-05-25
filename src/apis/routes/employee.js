const express = require("express");

const router = express.Router();

const { employeeController } = require("../controllers");
const {
  employeeMiddlewares,
  idValidation,
  validationResult,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  employeeMiddlewares.createValidate,
  validationResult,
  employeeController.create
);

router.get("/:id", idValidation, employeeController.getByID);

router.get("/", employeeController.getAll);

router.post(
  "/code",
  employeeMiddlewares.codeValidate,
  validationResult,
  employeeController.getByCode
);

router.post(
  "/name",
  employeeMiddlewares.nameValidate,
  validationResult,
  employeeController.searchByName
);

router.patch(
  "/:id",
  idValidation,
  employeeMiddlewares.updateValidate,
  validationResult,
  employeeController.updateProfile
);

router.delete("/:id", idValidation, employeeController.deleteOne);

module.exports = router;
