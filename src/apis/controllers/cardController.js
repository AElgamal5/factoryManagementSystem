const { Card, Salary, Employee, Stage, Order, Model } = require("../models");
const { idCheck, errorFormat, currentDate, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/card/
 */
const create = async (req, res) => {
  const { code, order: orderID, model: modelID, quantity, details } = req.body;

  try {
    //code check
    const exist = await Card.findOne({ code });
    if (exist) {
      return res
        .status(400)
        .json(
          errorFormat(code, "Code must be unique for each card", "code", "body")
        );
    }

    //order checks
    if (!idCheck(orderID)) {
      return res
        .status(400)
        .json(errorFormat(orderID, "Invalid order id", "order", "body"));
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(orderID, "No order with this id", "order", "body"));
    }

    //model checks
    if (!idCheck(modelID)) {
      return res
        .status(400)
        .json(errorFormat(modelID, "Invalid model id", "model", "body"));
    }
    const model = await Model.findById(modelID);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(modelID, "No model with this id", "model", "body"));
    }
    const orderModel = await Order.findOne({
      _id: orderID,
      "models.id": modelID,
    });
    if (!orderModel) {
      return res
        .status(400)
        .json(
          errorFormat("the order do not have model", "order&model", "body")
        );
    }

    const card = await Card.create({
      code,
      order: orderID,
      model: modelID,
      quantity,
      details,
    });

    card.history.push({ state: "Created", date: currentTime() });
    await card.save();

    res.status(201).json({ data: card });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/
 */
const getAll = async (req, res) => {
  try {
    const docs = await Card.find();

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Card.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/card/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await Card.findByIdAndDelete(id);

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Card deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { code, order: orderID, model: modelID, quantity, details } = req.body;

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //code check
    if (code) {
      const exist = await Card.findOne({ code });
      if (exist) {
        return res
          .status(400)
          .json(
            errorFormat(
              code,
              "Code must be unique for each card",
              "code",
              "body"
            )
          );
      }
    }

    let order, model;

    //order checks
    if (orderID) {
      if (!idCheck(orderID)) {
        return res
          .status(400)
          .json(errorFormat(orderID, "Invalid order id", "order", "body"));
      }
      order = await Order.findById(orderID);
      if (!order) {
        return res
          .status(404)
          .json(errorFormat(orderID, "No order with this id", "order", "body"));
      }
    }

    //model checks
    if (modelID) {
      if (!idCheck(modelID)) {
        return res
          .status(400)
          .json(errorFormat(modelID, "Invalid model id", "model", "body"));
      }
      model = await Model.findById(modelID);
      if (!model) {
        return res
          .status(404)
          .json(errorFormat(modelID, "No model with this id", "model", "body"));
      }
    }

    //check if the order have model
    if (order && model) {
      const orderModel = await Order.findOne({
        _id: orderID,
        "models.id": modelID,
      });
      if (!orderModel) {
        return res
          .status(400)
          .json(
            errorFormat("the order do not have model", "order&model", "body")
          );
      }
    } else if (order) {
      const orderModel = await Order.findOne({
        _id: orderID,
        "models.id": card.model,
      });
      if (!orderModel) {
        return res
          .status(400)
          .json(
            errorFormat("the order do not have model", "order&model", "body")
          );
      }
    } else if (model) {
      const orderModel = await Order.findOne({
        _id: card.order,
        "models.id": modelID,
      });
      if (!orderModel) {
        return res
          .status(400)
          .json(
            errorFormat("the order do not have model", "order&model", "body")
          );
      }
    }

    await Card.findByIdAndUpdate(id, {
      code,
      order: orderID,
      model: modelID,
      quantity,
      details,
    });

    card.history.push({ state: "Updated", date: currentTime() });
    await card.save();

    res.status(200).json({ msg: "Card updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/tracking/add
 */
const addTracking = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, employee: employeeID } = req.body;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //stage check
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No Stage with this id", "stage", "body"));
    }

    //check if card.model have the givin stage
    const modelStage = await Model.findOne({
      _id: card.model,
      "stages.id": stageID,
    });
    if (!modelStage) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "This stage does not exist in card model",
            "stage",
            "body"
          )
        );
    }

    //employee check
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "No employee with this id",
            "employee",
            "body"
          )
        );
    }

    const current = currentDate();

    const salary = await Salary.findOne({
      employee: employeeID,
      "date.month": current.month,
      "date.year": current.year,
    });

    //if salary exist then deal with the doc and if not exist create new one
    if (salary) {
      const workIndex = salary.work.findIndex(
        (obj) => obj.stage.toString() === stageID
      );

      console.log(workIndex);

      //update work array and total by card.quantity
      if (workIndex === -1) {
        salary.work.push({
          stage: stageID,
          quantity: card.quantity,
        });
      } else {
        salary.work[workIndex].quantity += card.quantity;
      }
      salary.total += card.quantity;
      await salary.save();
    } else {
      const salary = await Salary.create({
        employee: employeeID,
        date: {
          month: current.month,
          year: current.year,
        },
      });

      salary.work.push({
        stage: stageID,
        quantity: card.quantity,
      });

      salary.total += card.quantity;

      await salary.save();
    }

    card.tracking.push({
      stage: stageID,
      employee: employeeID,
      dateOut: currentTime(),
    });
    await card.save();

    res.status(200).json({ msg: "Tracking added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addTracking".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/tracking/remove
 */
const removeTracking = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, employee: employeeID } = req.body;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //stage check
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No Stage with this id", "stage", "body"));
    }

    //check if card.model have the givin stage
    const modelStage = await Model.findOne({
      _id: card.model,
      "stages.id": stageID,
    });
    if (!modelStage) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "This stage does not exist in card model",
            "stage",
            "body"
          )
        );
    }

    //employee check
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "No employee with this id",
            "employee",
            "body"
          )
        );
    }

    //find tracking index
    const trackingIndex = card.tracking.findIndex(
      (obj) =>
        obj.employee.toString() === employeeID &&
        obj.stage.toString() === stageID
    );

    const current = currentDate();

    const salary = await Salary.findOne({
      employee: employeeID,
      "date.month": current.month,
      "date.year": current.year,
    });

    if (!salary) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This card did not assign by the givin employee",
            "employee",
            "body"
          )
        );
    }

    //find work index
    const workIndex = salary.work.findIndex(
      (obj) => obj.stage.toString() === stageID
    );

    if (workIndex === -1) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This card did not assign by the givin employee",
            "employee",
            "body"
          )
        );
    }

    //update salary.work and card.tracking
    salary.total -= card.quantity;
    salary.work.pull(salary.work[workIndex]._id);
    await salary.save();

    card.tracking.pull(card.tracking[trackingIndex]._id);
    await card.save();

    res.status(200).json({ msg: "Tracking removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addTracking".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  deleteOne,
  update,
  addTracking,
  removeTracking,
};
