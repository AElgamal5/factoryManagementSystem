const { Material } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/material/
 */
const create = async (req, res) => {
  const {
    name,
    details,
    type,
    image,
    unit,
    "role.title": roleTitle,
    "role.num": roleNum,
    note,
  } = req.body;

  try {
    const material = await Material.create({
      name,
      details,
      unit,
      type,
      "role.title": roleTitle,
      "role.num": roleNum,
      note,
    });

    res.status(201).json({ data: material });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/
 */
const getAll = async (req, res) => {
  try {
    const materials = await Material.find();

    res.status(200).json({ data: materials });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const material = await Material.findById(id);

    //check if exist
    if (!material) {
      return res
        .status(400)
        .json(errorFormat(id, "No material with this id", "id", "header"));
    }

    res.status(200).json({ data: material });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/material/:id
 */
const update = async (req, res) => {
  const id = req.params.id;

  const {
    name,
    quantity,
    available,
    details,
    image,
    unit,
    type,
    "role.title": roleTitle,
    "role.num": roleNum,
    note,
  } = req.body;

  try {
    const material = await Material.findByIdAndUpdate(id, {
      name,
      quantity,
      available,
      details,
      unit,
      type,
      "role.title": roleTitle,
      "role.num": roleNum,
      note,
    });

    //check if material exist
    if (!material) {
      return res
        .status(400)
        .json(errorFormat(id, "No material with this id", "id", "header"));
    }

    res.status(200).json({ msg: "material updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/material/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const material = await Material.findByIdAndDelete(id);

    //check if exist
    if (!material) {
      return res
        .status(400)
        .json(errorFormat(id, "No material with this id", "id", "header"));
    }

    res.status(200).json({ msg: "material deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/types/all
 */
const getAllTypes = async (req, res) => {
  try {
    const types = await Material.distinct("type");

    res.status(200).json({ data: types });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAllTypes".bgYellow);
    console.log(error);
  }
};

/*
 * method: POST
 * path: /api/material/types/all
 */
const getByType = async (req, res) => {
  const type = req.params.type;
  try {
    const materials = await Material.find({ type });
    res.status(200).json({ data: materials });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByType".bgYellow);
    console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  update,
  deleteOne,
  getAllTypes,
  getByType,
};
