const { Shipment, Order, Carton } = require("../models");
const { errorFormat, idCheck, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/shipment/
 */
const create = async (req, res) => {
  const { name, order: orderID, details, note } = req.body;

  try {
    //check validity and existence of order
    if (!idCheck(orderID)) {
      return res
        .status(400)
        .json(errorFormat(orderID, "Order id is invalid", "order", "body"));
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(orderID, "No order with this id", "order", "body"));
    }

    const shipment = await Shipment.create({
      name,
      order: orderID,
      details,
      note,
    });

    shipment.history.push({
      state: "Not approved",
      date: new Date(currentTime()),
    });

    order.shipments.push(shipment._id);

    await order.save();
    await shipment.save();

    res.status(201).json({ data: shipment });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.create".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/shipment/addCartons/:id
 */
const addCartons = async (req, res) => {
  const id = req.params.id;

  const cartons = req.body.cartons;

  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    //data checks
    for (let i = 0; i < cartons.length; i++) {
      //cartons checks
      if (!idCheck(cartons[i].id)) {
        return res
          .status(400)
          .json(
            errorFormat(
              cartons[i].id,
              "Not valid carton id",
              `cartons[${i}].id`,
              "body"
            )
          );
      }
      const carton = await Carton.findById(cartons[i].id);
      if (!carton) {
        return res
          .status(404)
          .json(
            errorFormat(
              cartons[i].id,
              "No carton with this id",
              `cartons[${i}].id`,
              "body"
            )
          );
      }

      //check carton quantity and update the doc
      if (carton.quantity < cartons[i].quantity) {
        return res
          .status(400)
          .json(
            errorFormat(
              cartons[i].quantity,
              "Carton's quantity less than given quantity",
              `cartons[${i}].quantity`,
              "body"
            )
          );
      }
    }

    //updating docs
    for (let i = 0; i < cartons.length; i++) {
      const carton = await Carton.findById(cartons[i].id);

      carton.quantity -= +cartons[i].quantity;

      await carton.save();

      shipment.cartons.push({
        id: cartons[i].id,
        quantity: cartons[i].quantity,
      });
    }

    //update history
    shipment.history.push({
      state: "Add cartons",
      date: new Date(currentTime()),
    });

    await shipment.save();

    res.status(200).json({ msg: "Cartons added to shipment tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.addCartons".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/shipment/removeCartons/:id
 */
const removeCartons = async (req, res) => {
  const id = req.params.id;

  const cartons = req.body.cartons;

  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    for (let i = 0; i < cartons.length; i++) {
      const index = shipment.cartons.findIndex((carton) => {
        return carton._id.toString() === cartons[i];
      });

      //if not find index
      if (index < 0) {
        return res
          .status(404)
          .json(
            errorFormat(
              cartons[i],
              "No carton with this id",
              `cartons[${i}]`,
              "body"
            )
          );
      }

      const carton = await Carton.findById(shipment.cartons[index].id);
      if (!carton) {
        return res
          .status(404)
          .json(
            errorFormat(
              cartons[i].id,
              "No carton with this id",
              `cartons[${i}]`,
              "params"
            )
          );
      }
    }

    for (let i = 0; i < cartons.length; i++) {
      const index = shipment.cartons.findIndex((carton) => {
        return carton._id.toString() === cartons[i];
      });

      //get carton , update quantity and save doc
      const carton = await Carton.findById(shipment.cartons[index].id);

      carton.quantity += shipment.cartons[index].quantity;
      await carton.save();

      shipment.cartons.pull(shipment.cartons[index]._id);
    }

    //update history
    shipment.history.push({
      state: "Remove cartons",
      date: new Date(currentTime()),
    });

    await shipment.save();

    res.status(200).json({ msg: "Cartons removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.removeCartons".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/shipment/approved/:id
 */
const approve = async (req, res) => {
  const id = req.params.id;

  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    for (let i = 0; i < shipment.history.length; i++) {
      if (shipment.history[i].state === "Approved") {
        return res
          .status(400)
          .json(
            errorFormat(
              shipment.history[i].state,
              "This shipment is already approved",
              "shipment.history[i].state",
              "others"
            )
          );
      }
      if (shipment.history[i].state === "Shipped") {
        return res
          .status(400)
          .json(
            errorFormat(
              shipment.history[i].state,
              "This shipment is already Shipped",
              "shipment.history[i].state",
              "others"
            )
          );
      }
    }

    //approve & save it
    shipment.history.push({
      state: "Approved",
      date: new Date(currentTime()),
    });
    await shipment.save();

    res.status(200).json({ msg: "Shipment approved tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.approve".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/shipment/shipped/:id
 */
const ship = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    let approved = false;

    for (let i = 0; i < shipment.history.length; i++) {
      if (shipment.history[i].state === "Shipped") {
        return res
          .status(400)
          .json(
            errorFormat(
              shipment.history[i].state,
              "This shipment is already Shipped",
              "shipment.history[i].state",
              "others"
            )
          );
      }
      if (shipment.history[i].state === "Approved") {
        approved = true;
      }
    }

    if (!approved) {
      return res
        .status(400)
        .json(errorFormat(id, "This shipment is not approved", "id", "others"));
    }

    //ship & save it
    shipment.history.push({
      state: "Shipped",
      date: new Date(currentTime()),
    });
    await shipment.save();

    res.status(200).json({ msg: "Shipment shipped tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.ship".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/shipment/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, order: orderID, details, note } = req.body;

  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    if (orderID) {
      //check validity and existence of order
      if (!idCheck(orderID)) {
        return res
          .status(400)
          .json(errorFormat(orderID, "Order id is invalid", "order", "body"));
      }
      const order = await Order.findById(orderID);
      if (!order) {
        return res
          .status(404)
          .json(errorFormat(orderID, "No order with this id", "order", "body"));
      }

      order.shipments.push(shipment._id);
      await order.save();

      await Order.findByIdAndUpdate(shipment.order, {
        $pull: { shipments: shipment._id },
      });
    }

    await Shipment.findByIdAndUpdate(id, {
      name,
      order: orderID,
      details,
      note,
    });

    shipment.history.push({
      state: "Update profile",
      data: new Date(currentTime()),
    });

    await shipment.save();

    res.status(200).json({ msg: "shipment profile updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.update".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/shipment/
 */
const getAll = async (req, res) => {
  try {
    const shipments = await Shipment.find().populate("order", "name");

    res.status(200).json({ data: shipments });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.getAll".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/shipment/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await Shipment.findById(id).populate("order", "name");

    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    res.status(200).json({ data: shipment });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.getByID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/shipment/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    // if (shipment.history.findIndex((his) => his.state === "Shipped") !== -1){
    //   return res.status(400).json(errorFormat("Shipped", "Can not delete Shipped"))
    // }

    const order = await Order.findById(shipment.order);
    order.shipments.pull(shipment._id);
    await order.save();

    await Shipment.findByIdAndDelete(id);

    res.status(200).json({ msg: "Shipment deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "shipment.deleteOne".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/shipment/carton/:cid
 */
const getShipmentsByCartonID = async (req, res) => {
  cid = req.params.cid;

  try {
    if (!idCheck(cid)) {
      return res
        .status(400)
        .json(errorFormat(cid, "Not valid carton id", "cid", "params"));
    }
    const carton = await Carton.findById(cid);
    if (!carton) {
      return res
        .status(404)
        .json(errorFormat(cid, "No carton with this id", "cid", "params"));
    }

    const shipments = await Shipment.find({ "cartons.id": cid });

    return res.status(200).json({ data: shipments });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "shipment.getShipmentsByCartonID".bgYellow
    );
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = {
  create,
  addCartons,
  removeCartons,
  approve,
  ship,
  update,
  getAll,
  getByID,
  deleteOne,
  getShipmentsByCartonID,
};
