const express = require("express");

const router = express.Router();

const { buyRequestController } = require("../controllers");
const {
  validationResult,
  buyRequestMiddlewares,
  idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

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

router.patch(
  "/materials/remove/:id",
  idValidation,
  buyRequestController.removeMaterials
);

router.patch(
  "/custodies/remove/:id",
  idValidation,
  buyRequestController.removeCustodies
);

router.patch("/approve/:id", idValidation, buyRequestController.approve);

router.patch("/delivered/:id", idValidation, buyRequestController.delivered);

router.patch(
  "/materials/update/:id",
  idValidation,
  buyRequestMiddlewares.materialValidate,
  validationResult,
  buyRequestController.updateMaterials
);

router.patch(
  "/custodies/update/:id",
  idValidation,
  buyRequestMiddlewares.custodyValidate,
  validationResult,
  buyRequestController.updateCustodies
);

module.exports = router;
