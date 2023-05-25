const express = require("express");

const router = express.Router();

const { clientController } = require("../controllers");

// supplierMiddlewares is the same checks for client
const {
  supplierMiddlewares,
  validationResult,
  idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  supplierMiddlewares.createValidate,
  validationResult,
  clientController.create
);

router.get("/", clientController.getAll);

router.get("/:id", idValidation, clientController.getByID);

router.patch(
  "/:id",
  idValidation,
  supplierMiddlewares.updateValidate,
  validationResult,
  clientController.update
);

router.delete("/:id", idValidation, clientController.deleteOne);

module.exports = router;
