const { Carton, Model } = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/carton/
 */
const create = async (req, res) => {
  const { name, model: modelID, details, note } = req.body;

  try {
    //check model id
    if (!idCheck(modelID)) {
      return res
        .status(400)
        .json(errorFormat(modelID, "Model id is invalid", "model", "body"));
    }
    const model = await Model.findById(modelID);
    if (!model) {
      return res
        .status(400)
        .json(errorFormat(modelID, "No model with this id", "model", "body"));
    }

    const carton = await Carton.create({
      name,
      model: modelID,
      details,
      note,
    });

    res.status(201).json({ data: carton });
  } catch (error) {
    console.log("Error is in: ".bgRed, "carton.create".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/carton/
 */
const getAll = async (req, res) => {
  try {
    const cartons = await Carton.find();

    res.status(200).json({ data: cartons });
  } catch (error) {
    console.log("Error is in: ".bgRed, "carton.getAll".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/carton/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const carton = await Carton.findById(id).populate("model", "name");

    if (!carton) {
      return res
        .status(404)
        .json(errorFormat(id, "No carton with this id", "id", "params"));
    }

    res.status(200).json({ data: carton });
  } catch (error) {
    console.log("Error is in: ".bgRed, "carton.getByID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/carton/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, quantity, model: modelID, details, note } = req.body;

  try {
    if (modelID) {
      if (!idCheck(modelID)) {
        return res
          .status(400)
          .json(errorFormat(modelID, "Model id is invalid", "model", "body"));
      }

      const model = await Model.findById(modelID);
      if (!model) {
        return res
          .status(404)
          .json(errorFormat(modelID, "No model with this id", "model", "body"));
      }
      //empty styles when changing model due to combination of size and color
      await Carton.findByIdAndUpdate(id, {
        styles: [],
      });
    }

    const carton = await Carton.findByIdAndUpdate(id, {
      name,
      quantity,
      model: modelID,
      details,
      note,
    });

    if (!carton) {
      return res
        .status(404)
        .json(errorFormat(id, "No carton with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Carton updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "carton.update".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/carton/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const carton = await Carton.findByIdAndDelete(id);

    if (!carton) {
      return res
        .status(404)
        .json(errorFormat(id, "No carton with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Carton deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "carton.deleteOne".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/carton/updateStyles/:id
 */
const updateStyles = async (req, res) => {
  const id = req.params.id;
  const styles = req.body.styles;

  try {
    //carton check
    const carton = await Carton.findById(id);
    if (!carton) {
      return res
        .status(404)
        .json(errorFormat(id, "No carton with this id", "id", "params"));
    }

    carton.quantity += 0;

    for (let i = 0; i < styles.length; i++) {
      //style checks
      if (!idCheck(styles[i].color)) {
        return res
          .status(400)
          .json(
            errorFormat(
              styles[i].color,
              "Not valid color id",
              `styles[${i}].color`,
              "body"
            )
          );
      }
      if (!idCheck(styles[i].size)) {
        return res
          .status(400)
          .json(
            errorFormat(
              styles[i].size,
              "Not valid size id",
              `styles[${i}].size`,
              "body"
            )
          );
      }

      const exist = await Model.findOne({
        _id: carton.model,
        "consumptions.colors": styles[i].color,
        "consumptions.sizes": styles[i].size,
      });

      if (!exist) {
        return res
          .status(404)
          .json(
            errorFormat(
              carton.model,
              `there is no ${styles[i].color} & ${styles[i].size} in attached model`,
              `styles[${i}]`,
              "body"
            )
          );
      }

      carton.styles.push({
        color: styles[i].color,
        size: styles[i].size,
        quantity: styles[i].quantity,
      });

      carton.quantity += styles[i].quantity;
    }

    await carton.save();

    res.status(200).json({ msg: "Carton styles updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "carton.updateStyles".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, deleteOne, updateStyles };
