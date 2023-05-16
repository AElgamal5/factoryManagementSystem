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
        .status(404)
        .json(
          errorFormat(clientID, "No client with this id", "client", "body")
        );
    }

    const order = await Order.create({ name, client: clientID, details, note });

    res.status(201).json({ data: order });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.create".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/
 */
const getAll = async (req, res) => {
  try {
    const orders = await Order.find().populate("client", "name");

    res.status(200).json({ data: orders });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getAll".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const order = await Order.findById(id)
      .populate("client", "name")
      .populate("models.id", "name")
      .populate("models.color", "name")
      .populate("models.size", "name")
      .populate("shipments", "name createdAt");

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getByID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
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
          .status(404)
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
    console.log("Error is in: ".bgRed, "order.update".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
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

    //checks
    for (let i = 0; i < models.length; i++) {
      if (!idCheck(models[i].id)) {
        return res
          .status(400)
          .json(
            errorFormat(
              models[i].id,
              "Not valid model id",
              `models[${i}].id`,
              "body"
            )
          );
      }
      if (!idCheck(models[i].color)) {
        return res
          .status(400)
          .json(
            errorFormat(
              models[i].color,
              "Not valid model color",
              `models[${i}].color`,
              "body"
            )
          );
      }
      if (!idCheck(models[i].size)) {
        return res
          .status(400)
          .json(
            errorFormat(
              models[i].size,
              "Not valid model size",
              `models[${i}].size`,
              "body"
            )
          );
      }

      const model = await Model.findOne({
        _id: models[i].id,
        "consumptions.colors": models[i].color,
        "consumptions.sizes": models[i].size,
      });

      if (!model) {
        return res
          .status(404)
          .json(
            errorFormat(
              models[i].id,
              "no model with this data : id || color || size",
              `models[${i}].id`,
              "body"
            )
          );
      }
    }

    //empty these fields
    order.totalMaterialsRequired = [];
    order.totalQuantity = 0;
    order.models = [];

    for (let i = 0; i < models.length; i++) {
      const model = await Model.findOne({
        _id: models[i].id,
        "consumptions.colors": models[i].color,
        "consumptions.sizes": models[i].size,
      });

      for (let j = 0; j < model.consumptions.length; j++) {
        const colorIndex = model.consumptions[j].colors.findIndex(
          (color) => color.toString() === models[i].color
        );

        const sizeIndex = model.consumptions[j].sizes.findIndex(
          (size) => size.toString() === models[i].size
        );

        if (colorIndex > -1 && sizeIndex > -1) {
          const totalIndex = order.totalMaterialsRequired.findIndex(
            (tot) => tot.id.toString() === model.consumptions[j].material
          );

          if (totalIndex > -1) {
            order.totalMaterialsRequired[totalIndex].quantity +=
              +model.consumptions[j].quantity * models[i].quantity;
          } else {
            order.totalMaterialsRequired.push({
              id: model.consumptions[j].material,
              quantity: +model.consumptions[j].quantity * models[i].quantity,
            });
          }
        }
      }

      order.totalQuantity += models[i].quantity;

      order.models.push({
        id: models[i].id,
        color: models[i].color,
        size: models[i].size,
        quantity: models[i].quantity,
      });
    }

    await order.save();

    res.status(200).json({ msg: "Models added to order tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.updateModels".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/order/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Order deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.deleteOne".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/model/:mid
 */
const getOrdersByModelID = async (req, res) => {
  const mid = req.params.mid;

  try {
    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(mid, "Not valid model id", "mid", "params"));
    }
    const model = await Model.findById(mid);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "No model with this id", "mid", "params"));
    }

    const orders = await Order.find({ "models.id": mid })
      .select("name models")
      .populate("models.color", "name")
      .populate("models.size", "name");

    for (let i = 0; i < orders.length; i++) {
      let models = [];
      for (let j = 0; j < orders[i].models.length; j++) {
        if (orders[i].models[j].id.toString() === mid) {
          models.push(orders[i].models[j]);
        }
      }

      orders[i].models = models;
    }

    return res.status(200).json({ data: orders });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getOrdersByModelID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  update,
  updateModels,
  deleteOne,
  getOrdersByModelID,
};
