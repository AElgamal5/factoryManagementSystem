const express = require("express");

const router = express.Router();

const { cardController } = require("../controllers");
const {
  cardMiddlewares,
  validationResult,
  idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  cardMiddlewares.createValidate,
  validationResult,
  cardController.create
);

router.get("/", cardController.getAll);

router.get("/:id", idValidation, cardController.getByID);

router.delete("/:id", idValidation, cardController.deleteOne);

router.patch(
  "/:id",
  idValidation,
  cardMiddlewares.updateValidate,
  validationResult,
  cardController.update
);

router.patch(
  "/:id/tracking/add",
  idValidation,
  cardMiddlewares.trackingValidate,
  validationResult,
  cardController.addTracking
);

router.patch(
  "/:id/tracking/remove",
  idValidation,
  cardMiddlewares.trackingValidate,
  validationResult,
  cardController.removeTracking
);

module.exports = router;
