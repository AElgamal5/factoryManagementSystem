const express = require("express");

const router = express.Router();

const { shipmentController } = require("../controllers");
const {
  validationResult,
  idValidation,
  shipmentMiddlewares,
} = require("../middlewares");

router.post(
  "/",
  shipmentMiddlewares.createValidate,
  validationResult,
  shipmentController.create
);

router.patch(
  "/addCartons/:id",
  idValidation,
  shipmentMiddlewares.addCartonsValidate,
  validationResult,
  shipmentController.addCartons
);

router.patch(
  "/removeCartons/:id",
  idValidation,
  shipmentMiddlewares.removeCartonsValidate,
  validationResult,
  shipmentController.removeCartons
);

router.patch("/approved/:id", idValidation, shipmentController.approve);

router.patch("/shipped/:id", idValidation, shipmentController.ship);

router.patch(
  "/:id",
  idValidation,
  shipmentMiddlewares.updateValidate,
  validationResult,
  shipmentController.update
);

router.get("/", shipmentController.getAll);

router.get("/:id", idValidation, shipmentController.getByID);

router.delete("/:id", idValidation, shipmentController.deleteOne);

module.exports = router;
