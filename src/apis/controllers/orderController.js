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
    const orders = await Order.find();

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
    const order = await Order.findById(id);

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
        "consumptions.color": models[i].color,
        "consumptions.size": models[i].size,
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

    for (let i = 0; i < models.length; i++) {
      const model = await Model.findOne({
        _id: models[i].id,
        "consumptions.color": models[i].color,
        "consumptions.size": models[i].size,
      });

      order.totalQuantity = 0;
      order.totalQuantity += +models[i].quantity;
      order.models.push({
        id: models[i].id,
        color: models[i].color,
        size: models[i].size,
        quantity: models[i].quantity,
      });
      await order.save();

      const index = model.consumptions.findIndex(
        (con) =>
          con.color.toString() === models[i].color &&
          con.size.toString() === models[i].size
      );

      console.log(model.consumptions[index].materials);

      for (let j = 0; j < model.consumptions[index].materials.length; j++) {
        const exist = await Order.findOneAndUpdate(
          {
            _id: order._id,
            "totalMaterialsRequired.id":
              model.consumptions[index].materials[j].id,
          },
          {
            $inc: {
              "totalMaterialsRequired.$.quantity":
                +model.consumptions[index].materials[j].quantity *
                +models[i].quantity,
            },
          }
        );

        if (!exist) {
          order.totalMaterialsRequired.push({
            id: model.consumptions[index].materials[j].id,
            quantity:
              +model.consumptions[index].materials[j].quantity *
              +models[i].quantity,
          });
          await order.save();
        }
      }
    }

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

module.exports = { create, getAll, getByID, update, updateModels, deleteOne };
