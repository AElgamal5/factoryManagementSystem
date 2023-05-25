const express = require("express");

const router = express.Router();

const { roleController } = require("../controllers");
const {
  validationResult,
  idValidation,
  roleMiddleware,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  roleMiddleware.validate,
  validationResult,
  roleController.create
);

router.get("/", roleController.getAll);

router.get("/:id", idValidation, roleController.getByID);

router.delete("/:id", idValidation, roleController.deleteOne);

module.exports = router;
