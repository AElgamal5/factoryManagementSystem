const { Color, Image } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/color/
 */
const create = async (req, res) => {
  const { name, code, image } = req.body;

  try {
    let imageDocID;
    if (image) {
      imageDocID = (await Image.create({ data: image }))._id;
    }

    const color = await Color.create({
      name,
      code,
      image: imageDocID,
    });

    res.status(201).json({ data: color });
  } catch (error) {
    console.log("Error is in: ".bgRed, "color.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/color/
 */
const getAll = async (req, res) => {
  try {
    const colors = await Color.find();

    res.status(200).json({ data: colors });
  } catch (error) {
    console.log("Error is in: ".bgRed, "color.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/color/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const color = await Color.findById(id).populate("image");

    if (!color) {
      return res
        .status(400)
        .json(errorFormat(id, "No color with this ID", "id", "header"));
    }

    res.status(200).json({ data: color });
  } catch (error) {
    console.log("Error is in: ".bgRed, "color.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/color/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const color = await Color.findByIdAndDelete(id);

    if (!color) {
      return res
        .status(400)
        .json(errorFormat(id, "No color with this ID", "id", "header"));
    }

    res.status(200).json({ msg: "Color deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "color.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { create, getAll, getByID, deleteOne };
