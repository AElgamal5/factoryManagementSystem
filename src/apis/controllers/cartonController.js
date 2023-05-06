const { Carton, Model, Shipment } = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/carton/
 */
const create = async (req, res) => {
  const {
    name,
    quantity,
    model: modelID,
    shipment: shipmentID,
    colors,
    sizes,
    details,
    note,
  } = req.body;

  try {
    //check model id & shipment id
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

    if (!idCheck(shipmentID)) {
      return res
        .status(400)
        .json(
          errorFormat(shipmentID, "shipment id is invalid", "shipment", "body")
        );
    }

    //later when finish shipment
    // const shipment = await Shipment.findById(shipmentID);
    // if (!shipment) {
    //   return res
    //     .status(400)
    //     .json(
    //       errorFormat(
    //         shipmentID,
    //         "No shipment with this id",
    //         "shipment",
    //         "body"
    //       )
    //     );
    // }

    const carton = await Carton.create({
      name,
      quantity,
      model: modelID,
      shipment: shipmentID,
      details,
      note,
    });

    //adding colors
    for (let i = 0; i < colors.length; i++) {
      carton.colors.push({
        name: colors[i].name,
        code: colors[i].code,
      });
    }
    //adding sizes
    for (let i = 0; i < sizes.length; i++) {
      carton.sizes.push({
        name: sizes[i].name,
        code: sizes[i].code,
      });
    }

    await carton.save();

    res.status(201).json({ data: carton });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
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
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/carton/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const carton = await Carton.findById(id);

    if (!carton) {
      return res
        .status(404)
        .json(errorFormat(id, "No carton with this id", "id", "params"));
    }

    res.status(200).json({ data: carton });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/carton/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    quantity,
    model: modelID,
    shipment: shipmentID,
    colors,
    sizes,
    details,
    note,
  } = req.body;

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
          .status(400)
          .json(errorFormat(modelID, "No model with this id", "model", "body"));
      }
    }

    if (shipmentID) {
      if (!idCheck(shipmentID)) {
        return res
          .status(400)
          .json(
            errorFormat(
              shipmentID,
              "shipment id is invalid",
              "shipment",
              "body"
            )
          );
      }

      //later when finish shipment
      // const shipment = await Shipment.findById(shipmentID);
      // if (!shipment) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         shipmentID,
      //         "No shipment with this id",
      //         "shipment",
      //         "body"
      //       )
      //     );
      // }
    }

    const carton = await Carton.findByIdAndUpdate(id, {
      name,
      quantity,
      model: modelID,
      shipment: shipmentID,
      colors,
      sizes,
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
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
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
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, deleteOne };
