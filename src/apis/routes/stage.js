const express = require("express");

const router = express.Router();

const { stageController } = require("../controllers");
const {
  stageMiddlewares,
  validationResult,
  idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  stageMiddlewares.createValidate,
  validationResult,
  stageController.create
);

router.get("/", stageController.getAll);

router.get("/:id", idValidation, stageController.getByID);

router.patch(
  "/:id",
  idValidation,
  stageMiddlewares.updateValidate,
  validationResult,
  stageController.update
);

router.delete("/:id", idValidation, stageController.deleteOne);

module.exports = router;
