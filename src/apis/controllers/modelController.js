const { Model, Stage, Material } = require("../models");
const { errorFormat } = require("../utils");

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

/*
 * method: PATCH
 * path: /api/model/stages/add/:id
 */
const addStages = async (req, res) => {
  const id = req.params.id;

  const stages = req.body.stages;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < stages.length; i++) {
      if (!stages[i].id || !stages[i].priority || !stages[i].machineType) {
        return res
          .status(404)
          .json(
            errorFormat(
              stages[i],
              "there is no id , priority or machineType",
              "id || priority || machineType",
              "body"
            )
          );
      }

      let stage = await Stage.findById(stages[i].id);
      if (!stage) {
        return res
          .status(404)
          .json(errorFormat(id, "No stage with this id", "id", "header"));
      }

      model.stages.push({
        id: stages[i].id,
        priority: stages[i].priority,
        machineType: stages[i].machineType,
      });
    }

    await model.save();

    res.status(200).json({ msg: "Stages added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "addStages".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/stages/remove/:id
 */
const removeStages = async (req, res) => {
  const id = req.params.id;

  const stages = req.body.stages;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < stages.length; i++) {
      model.stages.pull(stages[i]);
    }

    await model.save();

    res.status(200).json({ msg: "Stages removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "removeStages".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/materials/add/:id
 */
const addMaterials = async (req, res) => {
  const id = req.params.id;

  const materials = req.body.materials;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < materials.length; i++) {
      if (!materials[i].id || !materials[i].quantity) {
        return res
          .status(404)
          .json(
            errorFormat(
              materials[i],
              "there is no id or quantity",
              "id || quantity ",
              "body"
            )
          );
      }

      let material = await Material.findById(materials[i].id);
      if (!material) {
        return res
          .status(404)
          .json(errorFormat(id, "No material with this id", "id", "header"));
      }

      model.materials.push({
        id: materials[i].id,
        quantity: materials[i].quantity,
      });
    }

    await model.save();

    res.status(200).json({ msg: "Materials added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "addStages".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/materials/remove/:id
 */
const removeMaterials = async (req, res) => {
  const id = req.params.id;

  const materials = req.body.materials;

  try {
    const model = await Model.findById(id);

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "header"));
    }

    for (let i = 0; i < materials.length; i++) {
      model.materials.pull(materials[i]);
    }

    await model.save();

    res.status(200).json({ msg: "Materials removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "removeMaterials".bgYellow);
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
  addStages,
  removeStages,
  addMaterials,
  removeMaterials,
};
