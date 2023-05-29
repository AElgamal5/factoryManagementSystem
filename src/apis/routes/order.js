const express = require("express");

const router = express.Router();

const { orderController } = require("../controllers");
const {
  validationResult,
  idValidation,
  orderMiddlewares,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

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

router.get("/model/:mid", orderController.getOrdersByModelID);

router.get(
  "/clientMaterial/:id",
  idValidation,
  orderController.getClientMaterial
);

router.post(
  "/consumption",
  orderMiddlewares.updateModelsValidate,
  validationResult,
  orderController.consumption
);

module.exports = router;
