const express = require("express");

const router = express.Router();

const { buyRequestController } = require("../controllers");
const {
  validationResult,
  buyRequestMiddlewares,
  idValidation,
} = require("../middlewares");

router.post(
  "/",
  buyRequestMiddlewares.createValidate,
  validationResult,
  buyRequestController.create
);

router.get("/:id", idValidation, buyRequestController.getByID);

router.get("/", buyRequestController.getAll);

router.delete("/:id", idValidation, buyRequestController.deleteOne);

router.patch("/:id", idValidation, buyRequestController.updateProfile);

router.patch("/:id", idValidation, buyRequestController.addMaterials);

module.exports = router;
