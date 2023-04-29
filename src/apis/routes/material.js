const express = require("express");

const router = express.Router();

const { materialController } = require("../controllers");

const {
  materialMiddlewares,
  validationResult,
  idValidation,
} = require("../middlewares");

router.post(
  "/",
  materialMiddlewares.createValidate,
  validationResult,
  materialController.create
);

router.get("/:id", idValidation, materialController.getByID);

router.get("/", materialController.getAll);

router.patch(
  "/:id",
  idValidation,
  materialMiddlewares.updateValidate,
  validationResult,
  materialController.update
);

router.delete("/:id", idValidation, materialController.deleteOne);

router.get("/types/all", materialController.getAllTypes);

router.get("/types/:type", materialController.getByType);

module.exports = router;
