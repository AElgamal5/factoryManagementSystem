const { Stage, Employee, StageEmployee, Order, Model } = require("../models");
const { errorFormat, idCheck, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/stageEmployee/addEmployee
 */
const addEmployee = async (req, res) => {
  const {
    order: orderID,
    model: modelID,
    stage: stageID,
    employee: employeeID,
  } = req.body;
  try {
    //order checks
    if (!idCheck(orderID)) {
      res
        .status(400)
        .json(errorFormat(orderID, "Not valid orderID", "order", "body"));
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(orderID, "No order with this id", "order", "body"));
    }

    //model checks
    if (!idCheck(modelID)) {
      res
        .status(400)
        .json(errorFormat(modelID, "Not valid modelID", "model", "body"));
    }
    const model = await Model.findById(modelID);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(modelID, "No model with this id", "model", "body"));
    }
    const modelExist = order.models.findIndex(
      (obj) => obj.id.toString() === modelID
    );
    if (modelExist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            modelID,
            "This model is not assigned to the order",
            "model",
            "body"
          )
        );
    }

    //stage checks
    if (!idCheck(stageID)) {
      res
        .status(400)
        .json(errorFormat(stageID, "Not valid stageID", "stage", "body"));
    }
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No stage with this id", "stage", "body"));
    }
    const stageExist = model.stages.findIndex(
      (obj) => obj.id.toString() === stageID
    );
    if (stageExist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(stageID, "This stage not exist in model", "stage", "body")
        );
    }

    //employee checks
    if (!idCheck(employeeID)) {
      res
        .status(400)
        .json(
          errorFormat(employeeID, "Not valid employeeID", "employee", "body")
        );
    }
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

    const current = currentTime();

    let stageEmployeeDoc = await StageEmployee.findOne({
      order: orderID,
      model: modelID,
      stage: stageID,
    });

    if (!stageEmployeeDoc) {
      stageEmployeeDoc = await StageEmployee.create({
        order: orderID,
        model: modelID,
        stage: stageID,
        employees: [{ employee: employeeID, in: current }],
      });

      return res.status(201).json({ msg: "Employee added tmam" });
    }
    const exist = stageEmployeeDoc.employees.findIndex(
      (obj) => obj.employee.toString() === employeeID && !obj.out
    );
    if (exist !== -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "This employee is exist in this stage",
            "employee",
            "body"
          )
        );
    }

    stageEmployeeDoc.employees.push({ employee: employeeID, in: current });
    await stageEmployeeDoc.save();

    return res.status(202).json({ msg: "Employee added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stageEmployee.addEmployee".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/stageEmployee/removeEmployee
 */
const removeEmployee = async (req, res) => {
  const {
    order: orderID,
    model: modelID,
    stage: stageID,
    employee: employeeID,
  } = req.body;
  try {
    //order checks
    if (!idCheck(orderID)) {
      res
        .status(400)
        .json(errorFormat(orderID, "Not valid orderID", "order", "body"));
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(orderID, "No order with this id", "order", "body"));
    }

    //model checks
    if (!idCheck(modelID)) {
      res
        .status(400)
        .json(errorFormat(modelID, "Not valid modelID", "model", "body"));
    }
    const model = await Model.findById(modelID);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(modelID, "No model with this id", "model", "body"));
    }
    const modelExist = order.models.findIndex(
      (obj) => obj.id.toString() === modelID
    );
    if (modelExist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            modelID,
            "This model is not assigned to the order",
            "model",
            "body"
          )
        );
    }

    //stage checks
    if (!idCheck(stageID)) {
      res
        .status(400)
        .json(errorFormat(stageID, "Not valid stageID", "stage", "body"));
    }
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No stage with this id", "stage", "body"));
    }
    const stageExist = model.stages.findIndex(
      (obj) => obj.id.toString() === stageID
    );
    if (stageExist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(stageID, "This stage not exist in model", "stage", "body")
        );
    }

    //employee checks
    if (!idCheck(employeeID)) {
      res
        .status(400)
        .json(
          errorFormat(employeeID, "Not valid employeeID", "employee", "body")
        );
    }
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

    const current = currentTime();

    const stageEmployeeDoc = await StageEmployee.findOne({
      order: orderID,
      model: modelID,
      stage: stageID,
    });
    if (!stageEmployeeDoc) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This employee is not exist in this stage",
            "employee",
            "body"
          )
        );
    }

    const exist = stageEmployeeDoc.employees.findIndex(
      (obj) => obj.employee.toString() === employeeID && !obj.out
    );
    if (exist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "This employee is not exist in this stage",
            "employee",
            "body"
          )
        );
    }

    if (stageEmployeeDoc.employees[exist].out) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "This employee has been removed form the stage",
            "employee",
            "body"
          )
        );
    }

    stageEmployeeDoc.employees[exist].out = current;
    await stageEmployeeDoc.save();

    return res.status(200).json({ msg: "Employee removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stageEmployee.removeEmployee".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/stageEmployee/order/:oid/model/:mid/stage/:sid
 */
const details = async (req, res) => {
  const { oid: orderID, mid: modelID, sid: stageID } = req.params;
  try {
    //order checks
    if (!idCheck(orderID)) {
      res
        .status(400)
        .json(errorFormat(orderID, "Not valid orderID", "oid", "params"));
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(orderID, "No order with this id", "oid", "params"));
    }

    //model checks
    if (!idCheck(modelID)) {
      res
        .status(400)
        .json(errorFormat(modelID, "Not valid modelID", "mid", "params"));
    }
    const model = await Model.findById(modelID);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(modelID, "No model with this id", "mid", "params"));
    }
    const modelExist = order.models.findIndex(
      (obj) => obj.id.toString() === modelID
    );
    if (modelExist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            modelID,
            "This model is not assigned to the order",
            "mid",
            "params"
          )
        );
    }

    //stage checks
    if (!idCheck(stageID)) {
      res
        .status(400)
        .json(errorFormat(stageID, "Not valid stageID", "sid", "params"));
    }
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No stage with this id", "sid", "params"));
    }
    const stageExist = model.stages.findIndex(
      (obj) => obj.id.toString() === stageID
    );
    if (stageExist === -1) {
      return res
        .status(400)
        .json(
          errorFormat(stageID, "This stage not exist in model", "sid", "params")
        );
    }

    const stageEmployeeDoc = await StageEmployee.findOne({
      order: orderID,
      model: modelID,
      stage: stageID,
    })
      .populate("order")
      .populate("model")
      .populate("stage")
      .populate("employees.employee");

    if (!stageEmployeeDoc) {
      return res
        .status(200)
        .json(
          errorFormat(stageID, "No details for this stage", "sid", "params")
        );
    }

    return res.status(200).json({ data: stageEmployeeDoc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stageEmployee.details".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { addEmployee, removeEmployee, details };
