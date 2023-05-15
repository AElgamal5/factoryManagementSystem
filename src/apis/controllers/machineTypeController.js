const { MachineType } = require("../models");
const { idCheck, errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/machineType/
 */
const create = async (req, res) => {
  const name = req.body.name;

  try {
    const doc = await MachineType.create({ name });

    res.status(201).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "machineType.create".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/machineType/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await MachineType.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No machine type with this id", "id", "params"));
    }
    return res.status(200).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "machineType.getByID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/machineType/
 */
const getAll = async (req, res) => {
  try {
    const docs = await MachineType.find();

    return res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "machineType.getAll".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/machineType/
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await MachineType.findByIdAndDelete(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No machine type with this id", "id", "params"));
    }

    return res.status(200).json({ msg: "Machine type deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "machineType.deleteOne".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = { create, getByID, getAll, deleteOne };
