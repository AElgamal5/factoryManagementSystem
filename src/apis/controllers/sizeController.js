const { Size } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/size/
 */
const create = async (req, res) => {
  const { name, code } = req.body;

  try {
    const size = await Size.create({
      name,
      code,
    });

    res.status(201).json({ data: size });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/size/
 */
const getAll = async (req, res) => {
  try {
    const sizes = await Size.find();

    res.status(200).json({ data: sizes });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/size/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const size = await Size.findById(id);

    if (!size) {
      return res
        .status(400)
        .json(errorFormat(id, "No size with this ID", "id", "header"));
    }

    res.status(200).json({ data: size });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/size/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const size = await Size.findByIdAndDelete(id);

    if (!size) {
      return res
        .status(400)
        .json(errorFormat(id, "No size with this ID", "id", "header"));
    }

    res.status(200).json({ msg: "Size deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

module.exports = { create, getAll, getByID, deleteOne };
