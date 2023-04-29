const express = require("express");

const router = express.Router();

const { employeeController } = require("../controllers");
const { employeeMiddlewares, idValidation } = require("../middlewares");

router.post(
  "/",
  employeeMiddlewares.createValidate,
  employeeMiddlewares.result,
  employeeController.create
);

router.get("/:id", idValidation, employeeController.getByID);

router.get("/", employeeController.getAll);

router.post("/code", employeeController.getByCode);

router.post("/name", employeeController.searchByName);

router.patch("/:id", idValidation, employeeController.updateProfile);

router.delete("/:id", idValidation, employeeController.deleteOne);

module.exports = router;
