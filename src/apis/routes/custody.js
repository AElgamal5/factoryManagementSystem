const express = require("express");

const router = express.Router();

const { custodyController } = require("../controllers");
const {
  custodyMiddlewares,
  validationResult,
  idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post(
  "/",
  custodyMiddlewares.createValidate,
  validationResult,
  custodyController.create
);

router.get("/", custodyController.getAll);

router.get("/:id", idValidation, custodyController.getByID);

router.patch(
  "/:id",
  idValidation,
  custodyMiddlewares.updateValidate,
  validationResult,
  custodyController.update
);

router.delete("/:id", idValidation, custodyController.deleteOne);

router.get("/supplier/brief/:sid", custodyController.getCustodiesBySupplierID);

router.get(
  "/supplier/:sid",
  custodyController.getCustodiesBySupplierIDInDetails
);

module.exports = router;
