const express = require("express");

const router = express.Router();

const { supplierController } = require("../controllers");
const {
  supplierMiddlewares,
  validationResult,
  idValidation,
} = require("../middlewares");

router.post(
  "/",
  supplierMiddlewares.createValidate,
  validationResult,
  supplierController.create
);

router.get("/:id", idValidation, supplierController.getByID);

router.get("/", supplierController.getAll);

router.patch(
  "/:id",
  idValidation,
  supplierMiddlewares.updateValidate,
  validationResult,
  supplierController.update
);

router.delete("/:id", idValidation, supplierController.deleteOne);

router.get("/custody/:cid", supplierController.getSuppliersByCustody);

router.get("/material/:mid", supplierController.getSuppliersByMaterial);

module.exports = router;
