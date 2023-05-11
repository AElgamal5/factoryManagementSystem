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
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
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

    for (let i = 0; i < cartons.length; i++) {
      const carton = await Carton.findById(cartons[i].id);

      if (!carton) {
        return res
          .status(404)
          .json(
            errorFormat(
              cartons[i].id,
              "No carton with this id",
              "cartons[i].id",
              "params"
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
              "cartons[i].quantity",
              "body"
            )
          );
      }
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

    res.status(200).json({ msg: "Cartons added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "addCartons".bgYellow);
    console.log(error);
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
              "No carton with this _id",
              "cartons[i]",
              "body"
            )
          );
      }

      //get carton , update quantity and save doc
      const carton = await Carton.findById(shipment.cartons[index].id);
      if (!carton) {
        return res
          .status(404)
          .json(
            errorFormat(
              cartons[i].id,
              "No carton with this id",
              "cartons[i].id",
              "params"
            )
          );
      }
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
    console.log("Error is in: ".bgRed, "removeCartons".bgYellow);
    console.log(error);
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
    }

    //approve & save it
    shipment.history.push({
      state: "Approved",
      date: new Date(currentTime()),
    });
    await shipment.save();

    res.status(200).json({ msg: "Shipment approved tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "approve".bgYellow);
    console.log(error);
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
    }

    //ship & save it
    shipment.history.push({
      state: "Shipped",
      date: new Date(currentTime()),
    });
    await shipment.save();

    res.status(200).json({ msg: "Shipment shipped tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "ship".bgYellow);
    console.log(error);
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
    }

    const shipment = await Shipment.findByIdAndUpdate(id, {
      name,
      order: orderID,
      details,
      note,
    });
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    shipment.history.push({
      state: "Update profile",
      data: new Date(currentTime()),
    });

    await shipment.save();

    res.status(200).json({ msg: "shipment profile updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/shipment/
 */
const getAll = async (req, res) => {
  try {
    const shipments = await Shipment.find();

    res.status(200).json({ data: shipments });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/shipment/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await Shipment.findById(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    res.status(200).json({ data: shipment });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/shipment/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const shipment = await Shipment.findByIdAndDelete(id);
    if (!shipment) {
      return res
        .status(404)
        .json(errorFormat(id, "No shipment with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Shipment deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
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
};
