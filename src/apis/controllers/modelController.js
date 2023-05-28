const {
  Model,
  Stage,
  Material,
  Color,
  Size,
  MachineType,
  Image,
} = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/model/
 */
const create = async (req, res) => {
  const { name, note, details, colors, sizes, image } = req.body;

  try {
    for (let i = 0; i < colors.length; i++) {
      if (!idCheck(colors[i])) {
        return res
          .status(400)
          .json(
            errorFormat(colors[i], "Not valid color", `colors[${i}]`, "body")
          );
      }
      const color = await Color.findById(colors[i]);
      if (!color) {
        return res
          .status(404)
          .json(
            errorFormat(
              colors[i],
              "No color with this id",
              `colors[${i}]`,
              "body"
            )
          );
      }
    }
    for (let i = 0; i < sizes.length; i++) {
      if (!idCheck(sizes[i])) {
        return res
          .status(400)
          .json(
            errorFormat(colors[i], "Not valid size", `sizes[${i}]`, "body")
          );
      }
      const size = await Size.findById(sizes[i]);
      if (!size) {
        return res
          .status(404)
          .json(
            errorFormat(
              sizes[i],
              "No color with this id",
              `sizes[${i}]`,
              "body"
            )
          );
      }
    }

    //image checks
    let imageDocID;
    if (image) {
      imageDocID = (await Image.create({ data: image }))._id;
    }

    const model = await Model.create({
      name,
      note,
      details,
      colors,
      sizes,
      image: imageDocID,
    });

    res.status(201).json({ data: model });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/model/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const model = await Model.findById(id)
      .populate("colors", "name")
      .populate("sizes", "name")
      .populate("stages.id")
      .populate("consumptions.material", "name")
      .populate("consumptions.colors", "name")
      .populate("consumptions.sizes", "name")
      .populate("image");

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    res.status(200).json({ data: model });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/model/
 */
const getAll = async (req, res) => {
  try {
    const models = await Model.find()
      .populate("colors", "name")
      .populate("sizes", "name");

    res.status(200).json({ data: models });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Model deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/:id
 */
const updateProfile = async (req, res) => {
  const id = req.params.id;
  const { name, note, details, colors, sizes, image } = req.body;

  try {
    const model = await Model.findById(id);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    if (colors) {
      for (let i = 0; i < colors.length; i++) {
        if (!idCheck(colors[i])) {
          return res
            .status(400)
            .json(
              errorFormat(colors[i], "Not valid color", `colors[${i}]`, "body")
            );
        }
        const color = await Color.findById(colors[i]);
        if (!color) {
          return res
            .status(404)
            .json(
              errorFormat(
                colors[i],
                "No color with this id",
                `colors[${i}]`,
                "body"
              )
            );
        }
      }
    }

    if (sizes) {
      for (let i = 0; i < sizes.length; i++) {
        if (!idCheck(sizes[i])) {
          return res
            .status(400)
            .json(
              errorFormat(colors[i], "Not valid size", `sizes[${i}]`, "body")
            );
        }
        const size = await Size.findById(sizes[i]);
        if (!size) {
          return res
            .status(404)
            .json(
              errorFormat(
                sizes[i],
                "No color with this id",
                `sizes[${i}]`,
                "body"
              )
            );
        }
      }
    }

    let imageDocID;
    if (image) {
      const exist = await Image.findById(model.image);
      if (exist) {
        await Image.findByIdAndDelete(model.image);
      }
      imageDocID = (await Image.create({ data: image }))._id;
    }

    await Model.findByIdAndUpdate(id, {
      name,
      note,
      details,
      colors,
      sizes,
      image: imageDocID,
    });

    res.status(200).json({ msg: "Model profile updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.updateProfile".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/colors/add/:id
 */
// const addColors = async (req, res) => {
//   const id = req.params.id;

//   const colors = req.body.colors;

//   try {
//     const model = await Model.findById(id);

//     if (!model) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No model with this id", "id", "header"));
//     }

//     for (let i = 0; i < colors.length; i++) {
//       if (!colors[i].name || !colors[i].code) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               colors[i],
//               "there is no name or code",
//               "name || code",
//               "body"
//             )
//           );
//       }

//       model.colors.push({
//         name: colors[i].name,
//         code: colors[i].code,
//       });
//     }

//     await model.save();

//     res.status(200).json({ msg: "Colors added tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "model.addColors".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/model/sizes/add/:id
 */
// const addSizes = async (req, res) => {
//   const id = req.params.id;

//   const sizes = req.body.sizes;

//   try {
//     const model = await Model.findById(id);

//     if (!model) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No model with this id", "id", "header"));
//     }

//     for (let i = 0; i < sizes.length; i++) {
//       if (!sizes[i].name || !sizes[i].code) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               sizes[i],
//               "there is no name or code",
//               "name || code",
//               "body"
//             )
//           );
//       }

//       model.sizes.push({
//         name: sizes[i].name,
//         code: sizes[i].code,
//       });
//     }

//     await model.save();

//     res.status(200).json({ msg: "Sizes added tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "model.addSizes".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/model/colors/remove/:id
 */
// const removeColors = async (req, res) => {
//   const id = req.params.id;
//   const colors = req.body.colors;

//   try {
//     const model = await Model.findById(id);

//     if (!model) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No model with this id", "id", "header"));
//     }

//     for (let i = 0; i < colors.length; i++) {
//       model.colors.pull(colors[i]);
//     }

//     await model.save();

//     res.status(200).json({ msg: "Colors removed tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "model.removeColors".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/model/sizes/remove/:id
 */
// const removeSizes = async (req, res) => {
//   const id = req.params.id;
//   const sizes = req.body.sizes;

//   try {
//     const model = await Model.findById(id);

//     if (!model) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No model with this id", "id", "header"));
//     }

//     for (let i = 0; i < sizes.length; i++) {
//       model.sizes.pull(sizes[i]);
//     }

//     await model.save();

//     res.status(200).json({ msg: "Sizes removed tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "model.removeSizes".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

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
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    for (let i = 0; i < stages.length; i++) {
      //covered in middleware
      // if (!stages[i].id || !stages[i].priority || !stages[i].machineType) {
      //   return res
      //     .status(404)
      //     .json(
      //       errorFormat(
      //         stages[i],
      //         "there is no id , priority or machineType",
      //         "id || priority || machineType",
      //         "body"
      //       )
      //     );
      // }

      const stage = await Stage.findById(stages[i].id);
      if (!stage) {
        return res
          .status(404)
          .json(errorFormat(id, "No stage with this id", "id", "body"));
      }

      // const machineType = await MachineType.findById(stages[i].machineType);
      // if (!machineType) {
      //   return res
      //     .status(404)
      //     .json(
      //       errorFormat(
      //         stages[i].machineType,
      //         "No machine type with this id",
      //         `stages[${i}].machineType`,
      //         "body"
      //       )
      //     );
      // }

      model.stages.push({
        id: stages[i].id,
        priority: stages[i].priority,
        // machineType: stages[i].machineType,
      });
    }

    await model.save();

    res.status(200).json({ msg: "Stages added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.addStages".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    for (let i = 0; i < stages.length; i++) {
      if (!idCheck(stages[i])) {
        return res
          .status(400)
          .json(
            errorFormat(stages[i], "Not invalid array id", "stages[i]", "body")
          );
      }

      model.stages.pull(stages[i]);
    }

    await model.save();

    res.status(200).json({ msg: "Stages removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.removeStages".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/materials/add/:id
 */
// const addMaterials = async (req, res) => {
//   const id = req.params.id;

//   const materials = req.body.materials;

//   try {
//     const model = await Model.findById(id);

//     if (!model) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No model with this id", "id", "header"));
//     }

//     for (let i = 0; i < materials.length; i++) {
//       if (!materials[i].id || !materials[i].quantity) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               materials[i],
//               "there is no id or quantity",
//               "id || quantity ",
//               "body"
//             )
//           );
//       }

//       let material = await Material.findById(materials[i].id);
//       if (!material) {
//         return res
//           .status(404)
//           .json(errorFormat(id, "No material with this id", "id", "header"));
//       }

//       model.materials.push({
//         id: materials[i].id,
//         quantity: materials[i].quantity,
//       });
//     }

//     await model.save();

//     res.status(200).json({ msg: "Materials added tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "model.addStages".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/model/materials/remove/:id
 */
// const removeMaterials = async (req, res) => {
//   const id = req.params.id;

//   const materials = req.body.materials;

//   try {
//     const model = await Model.findById(id);

//     if (!model) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No model with this id", "id", "header"));
//     }

//     for (let i = 0; i < materials.length; i++) {
//       model.materials.pull(materials[i]);
//     }

//     await model.save();

//     res.status(200).json({ msg: "Materials removed tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "model.removeMaterials".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/model/consumptions/add/:id
 */
const addConsumptions = async (req, res) => {
  const id = req.params.id;
  const consumptions = req.body.consumptions;

  try {
    const model = await Model.findById(id);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    //checks
    for (let i = 0; i < consumptions.length; i++) {
      if (!idCheck(consumptions[i].material)) {
        return res
          .status(400)
          .json(
            errorFormat(
              consumptions[i].material,
              "Not valid material id",
              `consumptions[${i}].material`,
              "body"
            )
          );
      }

      const material = await Material.findById(consumptions[i].material);
      if (!material) {
        return res
          .status(404)
          .json(
            errorFormat(
              consumptions[i].material,
              "No material with with this id",
              `consumptions[${i}].material`,
              "body"
            )
          );
      }

      const exist = await Model.findOne({
        _id: model._id,
        "consumptions.material": material._id,
      });

      if (exist) {
        return res
          .status(400)
          .json(
            errorFormat(
              material._id,
              "This material is exist in consumptions array",
              `consumptions[${i}].material`,
              "body"
            )
          );
      }

      for (let j = 0; j < consumptions[i].colors.length; j++) {
        if (!idCheck(consumptions[i].colors[j])) {
          return res
            .status(400)
            .json(
              errorFormat(
                consumptions[i].colors[j],
                "Not valid color id",
                `consumptions[${i}].colors[${j}]`,
                "body"
              )
            );
        }

        const color = await Color.findById(consumptions[i].colors[j]);
        if (!color) {
          return res
            .status(404)
            .json(
              errorFormat(
                consumptions[i].colors[j],
                "No color with this id",
                `consumptions[${i}].colors[${i}]`,
                "body"
              )
            );
        }
      }

      for (let j = 0; j < consumptions[i].sizes.length; j++) {
        if (!idCheck(consumptions[i].sizes[j])) {
          return res
            .status(400)
            .json(
              errorFormat(
                consumptions[i].sizes[j],
                "Not valid size id",
                `consumptions[${i}].sizes[${j}]`,
                "body"
              )
            );
        }

        const size = await Size.findById(consumptions[i].sizes[j]);
        if (!size) {
          return res
            .status(404)
            .json(
              errorFormat(
                consumptions[i].sizes[j],
                "No size with this id",
                `consumptions[${i}].sizes[${i}]`,
                "body"
              )
            );
        }
      }
    }

    for (let i = 0; i < consumptions.length; i++) {
      model.consumptions.push(consumptions[i]);
    }

    await model.save();

    res.status(200).json({ msg: "Model's consumptions updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.addConsumptions".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/model/consumptions/remove/:id
 */
const removeConsumptions = async (req, res) => {
  const id = req.params.id;
  const consumptions = req.body.consumptions;
  try {
    const model = await Model.findById(id);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(id, "No model with this id", "id", "params"));
    }

    for (let i = 0; i < consumptions.length; i++) {
      if (!idCheck(consumptions[i])) {
        return res
          .status(400)
          .json(
            errorFormat(
              consumptions[i],
              "No valid material id",
              `consumptions[${i}]`,
              "body"
            )
          );
      }

      model.consumptions.pull(consumptions[i]);
    }

    await model.save();

    res.status(200).json({ msg: "model updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.removeConsumptions".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/model/material/:mid
 */
const getModelsUsingMaterial = async (req, res) => {
  const mid = req.params.mid;

  try {
    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(mid, "Not valid material id", "mid", "params"));
    }

    const models = await Model.find({
      "consumptions.material": mid,
    }).select("_id name consumptions.material consumptions.quantity");

    if (models) {
      for (let i = 0; i < models.length; i++) {
        const index = models[i].consumptions.findIndex(
          (con) => con.material.toString() === mid
        );
        models[i].consumptions = models[i].consumptions[index];
      }
    }

    res.status(200).json({ data: models });
  } catch (error) {
    console.log("Error is in: ".bgRed, "model.getModelsUsingMaterial".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: POST
 * path: /api/model/consumptions/:mid
 */
const getConsumptionsByIDAndStyle = async (req, res) => {
  const mid = req.params.mid;
  const { color: colorID, size: sizeID } = req.body;

  try {
    //checks
    if (!idCheck(colorID)) {
      return res
        .status(400)
        .json(errorFormat(colorID, "Not valid color id", "color", "body"));
    }
    const color = await Color.findById(colorID);
    if (!color) {
      return res
        .status(404)
        .json(errorFormat(colorID, "NO color with this id", "color", "body"));
    }

    if (!idCheck(sizeID)) {
      return res
        .status(400)
        .json(errorFormat(sizeID, "Not valid size id", "size", "body"));
    }
    const size = await Size.findById(sizeID);
    if (!size) {
      return res
        .status(404)
        .json(errorFormat(sizeID, "NO size with this id", "size", "body"));
    }

    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(mid, "Not valid model id", "mid", "params"));
    }

    const model = await Model.findById(mid)
      .populate("consumptions.material", "name")
      .populate("consumptions.colors", "name")
      .populate("consumptions.sizes", "name");

    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "NO model with this id", "mid", "params"));
    }

    let consumptions = [];

    for (let i = 0; i < model.consumptions.length; i++) {
      const colorIndex = model.consumptions[i].colors.findIndex(
        (color) => color._id.toString() === colorID
      );
      if (colorIndex < 0) {
        continue;
      }
      const sizeIndex = model.consumptions[i].sizes.findIndex(
        (size) => size._id.toString() === sizeID
      );
      if (sizeIndex < 0) {
        continue;
      }

      model.consumptions[i].colors = model.consumptions[i].colors[colorIndex];
      model.consumptions[i].sizes = model.consumptions[i].sizes[sizeIndex];

      consumptions.push(model.consumptions[i]);
    }
    res.status(200).json({ data: consumptions });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "model.getConsumptionsByIDAndStyle".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  create,
  getByID,
  getAll,
  deleteOne,
  updateProfile,
  // addColors,
  // addSizes,
  // removeColors,
  // removeSizes,
  addStages,
  removeStages,
  // addMaterials,
  // removeMaterials,
  addConsumptions,
  removeConsumptions,
  getModelsUsingMaterial,
  getConsumptionsByIDAndStyle,
};
