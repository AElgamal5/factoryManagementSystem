const express = require("express");

const router = express.Router();

const { sizeController } = require("../controllers");
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
  sizeController.create
);

router.get("/", sizeController.getAll);

router.get("/:id", idValidation, sizeController.getByID);

router.delete("/:id", idValidation, sizeController.deleteOne);

module.exports = router;
