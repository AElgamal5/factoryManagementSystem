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

    if (+user.state === 0) {
      return res
        .status(403)
        .json(
          errorFormat(
            user.state,
            "This user is deactivated",
            "user.state",
            "others"
          )
        );
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

    const userData = await User.findById(user._id)
      .populate("role")
      .select("-password -refreshToken -__v ");

    res.status(200).json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      user: userData,
    });
  } catch (error) {
    console.log("Error is in: ".bgRed, "auth.login".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        } else {
          const accessToken = jwt.sign(
            { userID: exist._id.toString() },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
          );

          res.status(200).json({ accessToken });
        }
      }
    );
  } catch (error) {
    console.log("Error is in: ".bgRed, "auth.regenerateToken".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: POST
 * path: /api/auth/test
 */
const test = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(200)
        .json(
          errorFormat(authHeader, "No sent token", "authorization", "headers")
        );
    }
    if (!refreshToken) {
      return res
        .status(200)
        .json(
          errorFormat(
            refreshToken,
            "No sent refresh token",
            "refreshToken",
            "body"
          )
        );
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(200)
          .json(
            errorFormat(
              token,
              "Invalid user's token",
              "authorization",
              "headers"
            )
          );
      } else {
        const user = await User.findOne({ refreshToken: refreshToken });
        if (!user) {
          return res
            .status(200)
            .json(
              errorFormat(
                refreshToken,
                "No user with this refresh token",
                "refreshToken",
                "body"
              )
            );
        }

        res.status(200).json({ msg: "Token tmam" });
      }
    });

    // const user = await User.findOne({ refreshToken: refreshToken });
    // if (!user) {
    //   return res
    //     .status(200)
    //     .json(
    //       errorFormat(
    //         refreshToken,
    //         "No user with this refresh token",
    //         "refreshToken",
    //         "body"
    //       )
    //     );
    // }

    // res.status(200).json({ msg: "Token tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "auth.test".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { login, regenerateToken, logout, test };
