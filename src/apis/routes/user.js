const express = require("express");

const router = express.Router();

const { userController } = require("../controllers");
const {
  validationResult,
  idValidation,
  userMiddlewares,
  authenticate,
  imageValidate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  userMiddlewares.createValidate,
  validationResult,
  imageValidate,
  userController.create
);

router.get("/", userController.getAll);

router.get("/:id", idValidation, userController.getByID);

router.patch(
  "/:id",
  idValidation,
  userMiddlewares.updateValidate,
  validationResult,
  imageValidate,
  userController.update
);

router.delete("/:id", idValidation, userController.deleteOne);

router.patch("/:id", idValidation, userController.deleteOne);

module.exports = router;
