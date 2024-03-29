const express = require("express");

const router = express.Router();

const { modelController } = require("../controllers");
const {
  modelMiddlewares,
  validationResult,
  idValidation,
  authenticate,
  imageValidate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  modelMiddlewares.createValidate,
  validationResult,
  imageValidate,
  modelController.create
);

router.get("/:id", idValidation, modelController.getByID);

router.get("/", modelController.getAll);

router.delete("/:id", idValidation, modelController.deleteOne);

router.patch(
  "/:id",
  idValidation,
  modelMiddlewares.updateValidate,
  validationResult,
  imageValidate,
  modelController.updateProfile
);

// router.patch("/colors/add/:id", idValidation, modelController.addColors);

// router.patch("/sizes/add/:id", idValidation, modelController.addSizes);

// router.patch("/colors/remove/:id", idValidation, modelController.removeColors);

// router.patch("/sizes/remove/:id", idValidation, modelController.removeSizes);

router.patch(
  "/stages/add/:id",
  idValidation,
  modelMiddlewares.addStagesValidation,
  validationResult,
  modelController.addStages
);

router.patch(
  "/stages/remove/:id",
  idValidation,
  modelMiddlewares.removeStagesValidation,
  validationResult,
  modelController.removeStages
);

router.patch(
  "/stages/update/:id",
  idValidation,
  modelMiddlewares.addStagesValidation,
  validationResult,
  modelController.updateStages
);

// router.patch("/materials/add/:id", idValidation, modelController.addMaterials);

// router.patch(
//   "/materials/remove/:id",
//   idValidation,
//   modelController.removeMaterials
// );

router.patch(
  "/consumptions/add/:id",
  idValidation,
  modelMiddlewares.addConsumptionsValidation,
  validationResult,
  modelController.addConsumptions
);

router.patch(
  "/consumptions/remove/:id",
  idValidation,
  modelMiddlewares.removeConsumptionsValidation,
  validationResult,
  modelController.removeConsumptions
);

router.get("/material/:mid", modelController.getModelsUsingMaterial);

router.post("/consumptions/:mid", modelController.getConsumptionsByIDAndStyle);

module.exports = router;
