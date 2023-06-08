const express = require("express");

const router = express.Router();

const { userEmployeeController } = require("../controllers");
const {
  validationResult,
  idValidation,
  userEmployeeMiddlewares,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  userEmployeeMiddlewares.createValidate,
  validationResult,
  userEmployeeController.create
);

router.get("/", userEmployeeController.getAll);

router.get("/:id", idValidation, userEmployeeController.getByID);

router.patch(
  "/:id",
  idValidation,
  userEmployeeMiddlewares.updateValidate,
  validationResult,
  userEmployeeController.update
);

router.get("/state/activate", userEmployeeController.getAllActivate);

router.get("/state/deactivate", userEmployeeController.getAllDeactivate);

router.patch(
  "/work/:id",
  idValidation,
  userEmployeeMiddlewares.workValidate,
  validationResult,
  userEmployeeController.workAdding
);

router.delete("/:id", idValidation, userEmployeeController.deleteOne);

module.exports = router;
