const express = require("express");

const router = express.Router();

const { custodyController } = require("../controllers");
const {
  custodyMiddlewares,
  validationResult,
  idValidation,
} = require("../middlewares");

router.post(
  "/",
  custodyMiddlewares.createValidate,
  validationResult,
  custodyController.create
);

router.get("/", custodyController.getAll);

router.get("/:id", idValidation, custodyController.getByID);

router.patch(
  "/:id",
  idValidation,
  custodyMiddlewares.updateValidate,
  validationResult,
  custodyController.update
);

router.delete("/:id", idValidation, custodyController.deleteOne);

module.exports = router;
