const express = require("express");

const router = express.Router();

const { stageEmployeeController } = require("../controllers");
const {
  // validationResult,
  // idValidation,
  authenticate,
} = require("../middlewares");

router.use(authenticate);

router.post("/addEmployee", stageEmployeeController.addEmployee);

router.patch("/removeEmployee", stageEmployeeController.removeEmployee);

router.get(
  "/details/order/:oid/model/:mid/stage/:sid",
  stageEmployeeController.details
);

module.exports = router;
