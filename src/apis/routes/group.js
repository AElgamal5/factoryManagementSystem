const express = require("express");

const router = express.Router();

const { groupController } = require("../controllers");
const {
  groupMiddlewares,
  validationResult,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  groupMiddlewares.createValidate,
  validationResult,
  groupController.create
);

router.get("/:id", groupController.getByID);

router.get("/", groupController.getAll);

router.patch(
  "/:id",
  groupMiddlewares.updateValidate,
  validationResult,
  groupController.update
);

router.delete("/:id", groupController.deleteOne);

module.exports = router;
