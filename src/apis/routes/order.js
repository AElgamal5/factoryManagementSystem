const express = require("express");

const router = express.Router();

const { orderController } = require("../controllers");
const {
  validationResult,
  idValidation,
  orderMiddlewares,
} = require("../middlewares");

router.post(
  "/",
  orderMiddlewares.createValidate,
  validationResult,
  orderController.create
);

router.get("/", orderController.getAll);

router.get("/:id", idValidation, orderController.getByID);

router.patch(
  "/:id",
  idValidation,
  orderMiddlewares.updateValidate,
  validationResult,
  orderController.update
);

router.patch(
  "/models/:id",
  idValidation,
  orderMiddlewares.updateModelsValidate,
  validationResult,
  orderController.updateModels
);

router.delete("/:id", idValidation, orderController.deleteOne);

module.exports = router;
