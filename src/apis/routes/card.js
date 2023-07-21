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

// router.patch(
//   "/:id/tracking/remove",
//   idValidation,
//   cardController.removeTracking
// );

router.patch(
  "/:id/errors/add",
  idValidation,
  cardMiddlewares.addErrorsValidate,
  validationResult,
  cardController.addError
);

router.patch(
  "/:id/errors/repair",
  idValidation,
  cardMiddlewares.repairValidate,
  validationResult,
  cardController.repair
);

router.patch(
  "/:id/errors/confirm",
  idValidation,
  cardMiddlewares.confirmErrorsValidate,
  validationResult,
  cardController.confirmError
);

router.get("/last/:num", cardController.getLast);

router.get("/order/:oid/model/:mid", cardController.getAllForModelOrder);

router.get(
  "/order/:oid/model/:mid/errors",
  cardController.getAllForModelOrderWithErrors
);

// router.get(
//   "/:id/errors/unconfirmed",
//   idValidation,
//   cardController.unconfirmedErrors
// );

router.patch(
  "/:id/errors/add/check",
  idValidation,
  cardMiddlewares.addErrorsValidate,
  validationResult,
  cardController.addErrorCheck
);

module.exports = router;
