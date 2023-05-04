const express = require("express");

const router = express.Router();

const { modelController } = require("../controllers");
const {
  modelMiddlewares,
  validationResult,
  idValidation,
} = require("../middlewares");

router.post(
  "/",
  modelMiddlewares.createValidate,
  validationResult,
  modelController.create
);

router.get("/:id", idValidation, modelController.getByID);

router.get("/", modelController.getAll);

router.delete("/:id", idValidation, modelController.deleteOne);

router.patch("/:id", idValidation, modelController.updateProfile);

router.patch("/colors/add/:id", idValidation, modelController.addColors);

router.patch("/sizes/add/:id", idValidation, modelController.addSizes);

router.patch("/colors/remove/:id", idValidation, modelController.removeColors);

router.patch("/sizes/remove/:id", idValidation, modelController.removeSizes);

module.exports = router;
