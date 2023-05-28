const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { errorFormat } = require("../utils");

const auth = (req, res, next) => {
  if (process.env.PRODUCTION === "false") {
    return next();
  }

  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(403)
      .json(
        errorFormat(authHeader, "No sent token", "authorization", "headers")
      );
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json(
        errorFormat(authHeader, "No sent token", "authorization", "headers")
      );
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
    const user = await User.findById(decoded.userID);
    if (err || !user || user.refreshToken === "") {
      return res
        .status(401)
        .json(
          errorFormat(token, "Invalid user's token", "authorization", "headers")
        );
    }

    req.user = decoded.userID;

    next();
  });
};

module.exports = auth;
