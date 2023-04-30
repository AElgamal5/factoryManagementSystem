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

router.patch(
  "/materials/add/:id",
  idValidation,
  buyRequestController.addMaterials
);

router.patch(
  "/custodies/add/:id",
  idValidation,
  buyRequestController.addCustodies
);

module.exports = router;
