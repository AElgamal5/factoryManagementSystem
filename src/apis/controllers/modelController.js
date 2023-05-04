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

/*
 * method: PATCH
 * path: /api/model/:id
 */
const updateProfile = async (req, res) => {
  const id = req.params.id;
  const { name, note, details, image } = req.body;

  try {
    const model = await Model.findByIdAndUpdate(id, {
      name,
      note,
      details,
    });

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    res.status(200).json({ msg: "Model profile updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "updateProfile".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/colors/add/:id
 */
const addColors = async (req, res) => {
  const id = req.params.id;

  const colors = req.body.colors;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < colors.length; i++) {
      if (!colors[i].name || !colors[i].code) {
        return res
          .status(404)
          .json(
            errorFormat(
              colors[i],
              "there is no name or code",
              "name || code",
              "body"
            )
          );
      }

      model.colors.push({
        name: colors[i].name,
        code: colors[i].code,
      });
    }

    await model.save();

    res.status(200).json({ msg: "Colors added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "addColors".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/sizes/add/:id
 */
const addSizes = async (req, res) => {
  const id = req.params.id;

  const sizes = req.body.sizes;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < sizes.length; i++) {
      if (!sizes[i].name || !sizes[i].code) {
        return res
          .status(404)
          .json(
            errorFormat(
              sizes[i],
              "there is no name or code",
              "name || code",
              "body"
            )
          );
      }

      model.sizes.push({
        name: sizes[i].name,
        code: sizes[i].code,
      });
    }

    await model.save();

    res.status(200).json({ msg: "Sizes added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "addSizes".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/colors/remove/:id
 */
const removeColors = async (req, res) => {
  const id = req.params.id;
  const colors = req.body.colors;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < colors.length; i++) {
      model.colors.pull(colors[i]);
    }

    await model.save();

    res.status(200).json({ msg: "Colors removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "removeColors".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/sizes/remove/:id
 */
const removeSizes = async (req, res) => {
  const id = req.params.id;
  const sizes = req.body.sizes;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < sizes.length; i++) {
      model.sizes.pull(sizes[i]);
    }

    await model.save();

    res.status(200).json({ msg: "Sizes removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "removeSizes".bgYellow);
    console.log(error);
  }
};

module.exports = {
  create,
  getByID,
  getAll,
  deleteOne,
  updateProfile,
  addColors,
  addSizes,
  removeColors,
  removeSizes,
};
