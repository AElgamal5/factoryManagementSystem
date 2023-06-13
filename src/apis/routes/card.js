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

module.exports = router;
