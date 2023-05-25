const { Role } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/role/
 */
const create = async (req, res) => {
  const { title, number } = req.body;
  try {
    const role = await Role.create({ title, number });
    res.status(201).json({ data: role });
  } catch (error) {
    console.log("Error is in: ".bgRed, "role.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/role/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const role = await Role.findById(id);
    if (!role) {
      return res
        .status(400)
        .json(errorFormat(id, "No Role with this ID", "id", "header"));
    }

    res.status(200).json({ data: role });
  } catch (error) {
    console.log("Error is in: ".bgRed, "role.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/role/
 */
const getAll = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ data: roles });
  } catch (error) {
    console.log("Error is in: ".bgRed, "role.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/role/id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const role = await Role.findByIdAndDelete(id);

    if (!role) {
      return res
        .status(400)
        .json(errorFormat(id, "No Role with this ID", "id", "header"));
    }

    res.status(200).json({ msg: "Role deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "role.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};
module.exports = { create, getByID, getAll, deleteOne };
