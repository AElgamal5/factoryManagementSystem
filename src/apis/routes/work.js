const express = require("express");

const router = express.Router();

const { workController } = require("../controllers");
const { authenticate } = require("../middlewares");

router.use(authenticate);

router.get("/employee/:eid", workController.getAllForEmployee);

module.exports = router;
