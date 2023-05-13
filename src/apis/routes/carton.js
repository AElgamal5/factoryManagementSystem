const express = require("express");
const router = express.Router();

const { cartonController } = require("../controllers");
const {
  cartonMiddlewares,
  idValidation,
  validationResult,
} = require("../middlewares");

router.post(
  "/",
  cartonMiddlewares.createValidate,
  validationResult,
  cartonController.create
);

router.get("/", cartonController.getAll);

router.get("/:id", idValidation, cartonController.getByID);

router.patch(
  "/:id",
  idValidation,
  cartonMiddlewares.updateValidate,
  validationResult,
  cartonController.update
);

router.delete("/:id", idValidation, cartonController.deleteOne);

router.patch(
  "/updateStyles/:id",
  idValidation,
  cartonMiddlewares.stylesValidate,
  validationResult,
  cartonController.updateStyles
);

module.exports = router;
