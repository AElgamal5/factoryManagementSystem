const jwt = require("jsonwebtoken");

const { errorFormat } = require("../utils");

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res
      .status(401)
      .json(
        errorFormat(authHeader, "No sent token", "authorization", "headers")
      );
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json(
          errorFormat(token, "Invalid user's token", "authorization", "headers")
        );
    }

    req.user = decoded.userID;

    next();
  });
};

module.exports = auth;
