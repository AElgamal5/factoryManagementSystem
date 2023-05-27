const express = require("express");

const router = express.Router();

const { authController } = require("../controllers");
const {
  validationResult,
  authMiddlewares,
  authenticate,
} = require("../middlewares");

router.post(
  "/login",
  authMiddlewares.loginValidate,
  validationResult,
  authController.login
);

router.post("/token", authController.regenerateToken);

router.get("/logout", authenticate, authController.logout);

router.post("/test", authController.test);

router.post("/testCredentials", authenticate, authController.testCredentials);

module.exports = router;
