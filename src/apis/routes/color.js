const express = require("express");

const router = express.Router();

const { colorController } = require("../controllers");
const {
  validationResult,
  idValidation,
  colorMiddleware,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  colorMiddleware.validate,
  validationResult,
  colorController.create
);

router.get("/", colorController.getAll);

router.get("/:id", idValidation, colorController.getByID);

router.delete("/:id", idValidation, colorController.deleteOne);

module.exports = router;
