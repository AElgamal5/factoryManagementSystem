const express = require("express");

const router = express.Router();

const { salaryController } = require("../controllers");
const { authenticate } = require("../middlewares");

router.use(authenticate);

router.get("/employee/:eid", salaryController.getAllForEmployee);

module.exports = router;