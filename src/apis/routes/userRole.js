const express = require("express");

const router = express.Router();

const { userRoleController } = require("../controllers");
const {
  userRoleMiddlewares,
  validationResult,
  idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  userRoleMiddlewares.createValidate,
  validationResult,
  userRoleController.create
);

router.get("/", userRoleController.getAll);

router.get("/:id", idValidation, userRoleController.getByID);

router.patch(
  "/:id",
  idValidation,
  userRoleMiddlewares.updateValidation,
  validationResult,
  userRoleController.update
);

router.delete("/:id", idValidation, userRoleController.deleteOne);

module.exports = router;
