const express = require("express");

const router = express.Router();

const { orderController } = require("../controllers");
const {
  validationResult,
  idValidation,
  orderMiddlewares,
} = require("../middlewares");

module.exports = router;
