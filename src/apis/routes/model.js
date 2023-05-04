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

module.exports = router;
