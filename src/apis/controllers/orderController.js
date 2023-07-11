const { Order, Client, Color, Size, Model, Card } = require("../models");
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
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/
 */
const getAll = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("client", "name")
      .populate("models.id", "name")
      .populate("models.color")
      .populate("models.size");

    res.status(200).json({ data: orders });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/state/inProduction
 */
const getAllInProduction = async (req, res) => {
  try {
    const orders = await Order.find({ status: false })
      .populate("client", "name")
      .populate("models.id", "name");

    res.status(200).json({ data: orders });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getAllInProduction".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
      .populate("shipments", "name createdAt")
      .populate("totalMaterialsRequired.id", "name available unit")
      .populate("clientMaterial.material", "name available unit");

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/order/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, client: clientID, details, note, status } = req.body;

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
      status,
    });

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ msg: "order updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
            (tot) =>
              tot.id.toString() === model.consumptions[j].material.toString()
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
        code: models[i].code,
      });
    }

    // let TMR = [];

    // for (let i = 0; i < order.totalMaterialsRequired.length; i++) {
    //   const index = TMR.findIndex((obj) => {
    //     obj.id === order.totalMaterialsRequired[i].id;
    //   });

    //   if (index > -1) {
    //     TMR[index].quantity += +order.totalMaterialsRequired[i].quantity;
    //   } else {
    //     TMR.push(order.totalMaterialsRequired[i]);
    //   }
    // }

    // order.totalMaterialsRequired = TMR;

    await order.save();

    res.status(200).json({ msg: "Models added to order tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.updateModels".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
    if (process.env.PRODUCTION === "false") console.log(error);
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
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/clientMaterial/:id
 */
const getClientMaterial = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await Order.findById(id)
      .populate("clientMaterial.material", "name available unit")
      .select("clientMaterial");

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    res.status(200).json({ data: order });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getClientMaterial".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/consumption/:id
 */
const consumption = async (req, res) => {
  // const id = req.params.id;
  const models = req.body.models;

  try {
    const order = new Order();

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
            (tot) =>
              tot.id.toString() === model.consumptions[j].material.toString()
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
    }

    const data = await order.populate(
      "totalMaterialsRequired.id",
      "name unit available"
    );

    res.status(200).json({ data: data.totalMaterialsRequired });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.consumption".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/order/client/:id
 */
const getByClientID = async (req, res) => {
  const id = req.params.id;
  try {
    const client = await Client.findById(id);
    if (!client) {
      return res.status(404).json(errorFormat(id, "No client"));
    }

    const docs = await Order.find({ client: id });
    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.getByClientID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/order/:id/models/add
 */
const addToModels = async (req, res) => {
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

      //consumption check
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

      //model, color & size check
      const exist = await Order.findOne({
        _id: id,
        "models.id": models[i].id,
        "models.color": models[i].color,
        "models.size": models[i].size,
      });
      if (exist) {
        return res
          .status(400)
          .json(
            errorFormat(
              models[i].id,
              "The given combination exist before in this order",
              `models[${i}].id`,
              "body"
            )
          );
      }

      //code check
      const codeExist = await Order.findOne({
        _id: id,
        "models.code": models[i].code,
      });
      if (codeExist) {
        return res
          .status(400)
          .json(
            errorFormat(
              models[i].code,
              "the code must be unique for every combination",
              `models[${i}].code`,
              "body"
            )
          );
      }
    }

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
            (tot) =>
              tot.id.toString() === model.consumptions[j].material.toString()
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
        code: models[i].code,
      });
    }

    await order.save();

    res.status(200).json({ msg: "Models added to order tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.addToModels".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/order/:id/models/remove
 */
const removeFromModel = async (req, res) => {
  const id = req.params.id;
  const index = req.body.index;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(id, "no order with this id", "id", "params"));
    }

    if (!idCheck(index)) {
      return res
        .status(400)
        .json(errorFormat(index, "Invalid index:id", "index", "body"));
    }

    const exist = order.models.findIndex((obj) => obj._id.toString() === index);
    if (exist === -1) {
      return res
        .status(404)
        .json(errorFormat(index, "Not exist index:id", "index", "body"));
    }

    const cardExist = await Card.findOne({ order: id, modelIndex: index });
    if (cardExist) {
      return res
        .status(400)
        .json(
          errorFormat(
            index,
            "There ara cards related to this combination",
            "index",
            "body"
          )
        );
    }

    order.models.pull(index);

    await order.save();

    res.status(200).json({ msg: "Models removed from order tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "order.removeFromModel".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
  getClientMaterial,
  consumption,
  getByClientID,
  getAllInProduction,
  addToModels,
  removeFromModel,
};
