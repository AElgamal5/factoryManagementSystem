const express = require("express");

const router = express.Router();

const { machineTypeController } = require("../controllers");
const {
  validationResult,
  idValidation,
  machineTypeMiddleware,
} = require("../middlewares");

router.post(
  "/",
  machineTypeMiddleware.validate,
  validationResult,
  machineTypeController.create
);

router.get("/:id", idValidation, machineTypeController.getByID);

router.get("/", machineTypeController.getAll);

router.delete("/:id", idValidation, machineTypeController.deleteOne);

module.exports = router;
