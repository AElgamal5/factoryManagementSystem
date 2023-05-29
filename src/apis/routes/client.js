const express = require("express");

const router = express.Router();

const { clientController } = require("../controllers");

// supplierMiddlewares is the same checks for client
const {
  supplierMiddlewares,
  orderMiddlewares,
  validationResult,
  idValidation,
  authenticate,
  imageValidate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  supplierMiddlewares.createValidate,
  validationResult,
  imageValidate,
  clientController.create
);

router.get("/", clientController.getAll);

router.get("/:id", idValidation, clientController.getByID);

router.patch(
  "/:id",
  idValidation,
  supplierMiddlewares.updateValidate,
  validationResult,
  imageValidate,
  clientController.update
);

router.delete("/:id", idValidation, clientController.deleteOne);

router.patch(
  "/updateMaterials/:id",
  idValidation,
  orderMiddlewares.updateClientMaterialsValidate,
  validationResult,
  clientController.updateMaterials
);

module.exports = router;
