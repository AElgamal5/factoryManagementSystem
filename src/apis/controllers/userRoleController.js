const { UserRole } = require("../models");
const { idCheck, errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/userRole/
 */
const create = async (req, res) => {
  const { title, number, privileges } = req.body;

  try {
    const doc = await UserRole.create({ title, number, privileges });

    res.status(201).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userRole.create".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/userRole/
 */
const getAll = async (req, res) => {
  try {
    const docs = await UserRole.find();
    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userRole.getAll".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/userRole/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await UserRole.findById(id);

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No user role with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userRole.getByID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/userRole/:id
 */
const update = async (req, res) => {
  const id = req.params.id;

  const { title, number, privileges } = req.body;

  try {
    const doc = await UserRole.findByIdAndUpdate(id, {
      title,
      number,
      privileges,
    });

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No user role with this id", "id", "params"));
    }

    res.status(200).json({ msg: "User role updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userRole.update".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/userRole/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await UserRole.findByIdAndDelete(id);

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No user role with this id", "id", "params"));
    }

    res.status(200).json({ msg: "User role deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userRole.deleteOne".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, deleteOne };
