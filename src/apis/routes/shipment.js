const express = require("express");

const router = express.Router();

const { shipmentController } = require("../controllers");
const {
  validationResult,
  idValidation,
  shipmentMiddlewares,
  authenticate,
  imageValidate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  shipmentMiddlewares.createValidate,
  validationResult,
  imageValidate,
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
  imageValidate,
  shipmentController.update
);

router.get("/", shipmentController.getAll);

router.get("/:id", idValidation, shipmentController.getByID);

router.delete("/:id", idValidation, shipmentController.deleteOne);

router.get("/carton/:cid", shipmentController.getShipmentsByCartonID);

module.exports = router;
