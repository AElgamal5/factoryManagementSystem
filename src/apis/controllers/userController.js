const bcrypt = require("bcrypt");

const { User, UserRole, Image } = require("../models");
const { idCheck, errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/user/
 */
const create = async (req, res) => {
  const { name, code, role: roleID, password, image } = req.body;

  try {
    //code check
    const exist = await User.findOne({ code: code });
    if (exist) {
      return res
        .status(400)
        .json(errorFormat(code, "This code used before", "code", "body"));
    }

    //role check
    const role = await UserRole.findById(roleID);
    if (!role) {
      return res
        .status(404)
        .json(errorFormat(roleID, "No user role with this id", "role", "body"));
    }

    //hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    //image checks
    let imageDoc;
    if (image) {
      imageDoc = (await Image.create({ data: image }))._id;
    }

    const user = await User.create({
      name,
      code,
      role: roleID,
      password: hashedPassword,
      image: imageDoc,
    });

    res.status(201).json({ data: user });
  } catch (error) {
    console.log("Error is in: ".bgRed, "user.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/user/
 */
const getAll = async (req, res) => {
  try {
    const users = await User.find().populate("role").select("-password");
    res.status(200).json({ data: users });
  } catch (error) {
    console.log("Error is in: ".bgRed, "user.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/user/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id)
      .populate("role")
      .populate("image")
      .select("-password");

    if (!user) {
      return res
        .status(404)
        .json(errorFormat(id, "No user with this id", "id", "params"));
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.log("Error is in: ".bgRed, "user.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/user/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, code, role: roleID, password, image, state } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json(errorFormat(id, "No user with this id", "id", "params"));
    }

    if (roleID) {
      const role = await UserRole.findById(roleID);
      if (!role) {
        return res
          .status(404)
          .json(
            errorFormat(roleID, "No user role with this id", "role", "body")
          );
      }
      user.role = roleID;
    }

    if (code) {
      const exist = await User.findOne({ code: code });
      if (exist && exist._id.toString() !== user._id.toString()) {
        return res
          .status(400)
          .json(errorFormat(code, "This code used before", "code", "body"));
      }
      user.code = code;
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    if (image) {
      const exist = await Image.findById(user.image);
      if (exist) {
        await Image.findByIdAndDelete(user.image);
      }
      const imageDoc = await Image.create({ data: image });
      user.image = imageDoc._id;
    }

    user.name = name || user.name;
    user.state = state || user.state;

    await user.save();

    res.status(200).json({ msg: "User updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "user.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/user/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res
        .status(404)
        .json(errorFormat(id, "No user with this id", "id", "params"));
    }

    res.status(200).json({ msg: "User deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "user.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, deleteOne };
