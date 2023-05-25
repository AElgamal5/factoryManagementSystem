const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { idCheck, errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/auth/login
 */
const login = async (req, res) => {
  const { code, password } = req.body;
  try {
    const user = await User.findOne({ code });

    if (!user) {
      return res
        .status(404)
        .json(errorFormat(code, "No user with this code", "code", "body"));
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(404)
        .json(
          errorFormat(password, "Wrong user's password", "password", "body")
        );
    }

    const accessToken = jwt.sign(
      { userID: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
      { userID: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ accessToken: accessToken, refreshToken: refreshToken });
  } catch (error) {
    console.log("Error is in: ".bgRed, "auth.login".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: POST
 * path: /api/auth/token
 */
const regenerateToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    if (!refreshToken) {
      return res
        .status(400)
        .json(
          errorFormat(
            refreshToken,
            "Refresh token is required",
            "refreshToken",
            "body"
          )
        );
    }

    const exist = await User.findOne({ refreshToken: refreshToken });
    if (!exist) {
      return res
        .status(404)
        .json(
          errorFormat(
            refreshToken,
            "No user with this refreshToken",
            "refreshToken",
            "body"
          )
        );
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || exist._id.toString() !== decoded.userID) {
          return res
            .status(403)
            .json(
              errorFormat(
                refreshToken,
                "Wrong in refreshToken",
                "refreshToken",
                "body"
              )
            );
        }
      }
    );

    const accessToken = jwt.sign(
      { userID: exist._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ accessToken });
  } catch (error) {
    console.log("Error is in: ".bgRed, "auth.regenerateToken".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/auth/logout
 */
const logout = async (req, res) => {
  const userID = req.user;
  try {
    const user = await User.findById(userID);

    if (!user) {
      return res
        .status(404)
        .json(
          errorFormat(userID, "No user with this id", "req.user", "others")
        );
    }

    user.refreshToken = "";

    await user.save();

    res.status(200).json({ msg: "user logged out tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "auth.logout".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = { login, regenerateToken, logout };
