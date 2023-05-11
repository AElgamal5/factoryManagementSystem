const { Order, Client, Color, Size, Model } = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/order/
 */
const create = async (req, res) => {
  const { name, client: clientID, details, note } = req.body;

  try {
    //check validity and existence
    if (!idCheck(clientID)) {
      return res
        .status(400)
        .json(errorFormat(clientID, "Not valid client id", "client", "body"));
    }
    const client = await Client.findById(clientID);
    if (!client) {
      return res
        .status(400)
        .json(
          errorFormat(clientID, "No client with this id", "client", "body")
        );
    }

    const order = await Order.create({ name, client: clientID, details, note });

    res.status(201).json({ data: order });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/
 */
const getAll = async (req, res) => {
  try {
    const orders = await Order.find();

    res.status(200).json({ data: orders });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/order/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, client: clientID, details, note } = req.body;

  try {
    //check validity and existence of clientID
    if (clientID) {
      if (!idCheck(clientID)) {
        return res
          .status(400)
          .json(errorFormat(clientID, "Not valid client id", "client", "body"));
      }
      const client = await Client.findById(clientID);
      if (!client) {
        return res
          .status(400)
          .json(
            errorFormat(clientID, "No client with this id", "client", "body")
          );
      }
    }

    const order = await Order.findByIdAndUpdate(id, {
      name,
      client: clientID,
      details,
      note,
    });
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ msg: "order updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/order/models/:id
 */
const updateModels = async (req, res) => {
  const id = req.params.id;
  const models = req.body.models;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    for (let i = 0; i < models.length; i++) {
      const model = await Model.findById(models[i].id);
      if (!model) {
        return res
          .status(404)
          .json(
            errorFormat(
              models[i].id,
              "no model with this id",
              "models[i].id",
              "body"
            )
          );
      }
    }
    return res.send("tmam");
  } catch (error) {
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, updateModels };
