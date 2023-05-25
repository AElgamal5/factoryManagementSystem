const express = require("express");

const router = express.Router();

const { materialTypeController } = require("../controllers");
const {
  validationResult,
  idValidation,
  materialTypeMiddleware,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  materialTypeMiddleware.validate,
  validationResult,
  materialTypeController.create
);

router.get("/", materialTypeController.getAll);

router.get("/:id", idValidation, materialTypeController.getByID);

router.delete("/:id", idValidation, materialTypeController.deleteOne);

module.exports = router;
