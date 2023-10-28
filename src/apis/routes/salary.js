const express = require("express");

const router = express.Router();

const { salaryController } = require("../controllers");
const {
  authenticate,
  salaryMiddlewares,
  validationResult,
} = require("../middlewares");

router.use(authenticate);

router.get("/employee/:eid", salaryController.getAllForEmployee);

router.patch("/:id/done", salaryController.paid);

router.get("/recalculate", salaryController.recalculate);

router.get("/all", salaryController.salaryForAll);

router.get("/summary", salaryController.summary);

router.patch(
  "/idle/add",
  salaryMiddlewares.addIdleValidate,
  validationResult,
  salaryController.addIdleToEmp
);

router.patch(
  "/idle/remove",
  salaryMiddlewares.removeIdleValidate,
  validationResult,
  salaryController.removeIdleFromEmp
);

module.exports = router;
