const { MaterialType } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/materialType/
 */
const create = async (req, res) => {
  const type = req.body.type;

  try {
    const materialType = await MaterialType.create({ type });

    res.status(201).json({ data: materialType });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialType.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/materialType/
 */
const getAll = async (req, res) => {
  try {
    const materialTypes = await MaterialType.find();

    res.status(200).json({ data: materialTypes });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialType.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/materialType/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const materialType = await MaterialType.findById(id);

    if (!materialType) {
      return res
        .status(404)
        .json(errorFormat(id, "No materialType with this id", "id", "header"));
    }

    res.status(200).json({ data: materialType });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialType.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/materialType/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const materialType = await MaterialType.findByIdAndDelete(id);

    if (!materialType) {
      return res
        .status(404)
        .json(errorFormat(id, "No materialType with this id", "id", "header"));
    }

    res.status(200).json({ msg: "MaterialType deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialType.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { create, getAll, getByID, deleteOne };
