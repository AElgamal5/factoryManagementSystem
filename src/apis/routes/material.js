const express = require("express");

const router = express.Router();

const { materialController } = require("../controllers");

const {
  materialMiddlewares,
  validationResult,
  idValidation,
  authenticate,
  imageValidate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  materialMiddlewares.createValidate,
  validationResult,
  imageValidate,
  materialController.create
);

router.get("/:id", idValidation, materialController.getByID);

router.get("/", materialController.getAll);

router.patch(
  "/:id",
  idValidation,
  materialMiddlewares.updateValidate,
  validationResult,
  imageValidate,
  materialController.update
);

router.delete("/:id", idValidation, materialController.deleteOne);

router.get("/types/all", materialController.getAllTypes);

router.get("/types/:type", materialController.getByType);

router.get("/supplier/brief/:sid", materialController.getMaterialsBySupplierID);

router.get(
  "/supplier/:sid",
  materialController.getMaterialsBySupplierIDInDetails
);

module.exports = router;
