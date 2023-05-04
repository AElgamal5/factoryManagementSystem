const { Model } = require("../models");
const {} = require("../utils");
const errorFormat = require("../utils/errorFormat");

/*
 * method: POST
 * path: /api/model/
 */
const create = async (req, res) => {
  const { name, note, details, image } = req.body;

  try {
    const model = await Model.create({ name, note, details });

    res.status(201).json({ data: model });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/model/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    res.status(200).json({ data: model });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/model/
 */
const getAll = async (req, res) => {
  try {
    const models = await Model.find();

    res.status(200).json({ data: models });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/model/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const model = await Model.findByIdAndDelete(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    res.status(200).json({ msg: "Model deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

module.exports = { create, getByID, getAll, deleteOne };
