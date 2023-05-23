const express = require("express");

const router = express.Router();

const { userController } = require("../controllers");
const {
  validationResult,
  idValidation,
  userMiddlewares,
} = require("../middlewares");

router.post(
  "/",
  userMiddlewares.createValidate,
  validationResult,
  userController.create
);

router.get("/", userController.getAll);

router.get("/:id", idValidation, userController.getByID);

router.patch(
  "/:id",
  idValidation,
  userMiddlewares.updateValidate,
  validationResult,
  userController.update
);

router.delete("/:id", idValidation, userController.deleteOne);

router.patch("/:id", idValidation, userController.deleteOne);

module.exports = router;
