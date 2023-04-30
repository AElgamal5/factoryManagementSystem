const {
  Employee,
  Material,
  MaterialEmployee,
  Order,
  Model,
} = require("../models");
const { idCheck, errorFormat, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/materialEmployee/assign
 */
const assign = async (req, res) => {
  const {
    material: materialID,
    employee: employeeID,
    order: orderID,
    model: modelID,
    quantity,
    operation,
  } = req.body;

  let statusCode = 200;

  try {
    //check materialID validity
    if (!idCheck(materialID)) {
      return res
        .status(400)
        .json(
          errorFormat(materialID, "material id is invalid", "material", "body")
        );
    }

    //check employeeID validity
    if (!idCheck(employeeID)) {
      return res
        .status(400)
        .json(
          errorFormat(employeeID, "employee id is invalid", "employee", "body")
        );
    }

    //check orderID validity
    if (orderID && !idCheck(orderID)) {
      return res
        .status(400)
        .json(errorFormat(orderID, "order id is invalid", "order", "body"));
    }

    //check modelID validity
    if (modelID && !idCheck(modelID)) {
      return res
        .status(400)
        .json(errorFormat(modelID, "model id is invalid", "model", "body"));
    }

    //check if material exist
    const material = await Material.findById(materialID);
    if (!material) {
      return res
        .status(400)
        .json(
          errorFormat(
            materialID,
            "No material with this ID",
            "material",
            "body"
          )
        );
    }

    //check if employee exist
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "No employee with this ID",
            "employee",
            "body"
          )
        );
    }

    //check if order exist
    if (orderID) {
      const order = await Order.findById(orderID);
      if (!order) {
        return res
          .status(400)
          .json(errorFormat(orderID, "No order with this ID", "order", "body"));
      }
    }

    //check if model exist
    if (modelID) {
      const model = await Model.findById(modelID);
      if (!model) {
        return res
          .status(400)
          .json(errorFormat(modelID, "No model with this ID", "model", "body"));
      }
    }

    //check roles
    if (material.role.num > employee.role.num) {
      return res
        .status(400)
        .json(
          errorFormat(
            material.role.num,
            "material role is not suitable for this employee",
            "material.role.num",
            "other"
          )
        );
    }

    //check the quantity availability
    if (material.available < quantity) {
      return res
        .status(400)
        .json(
          errorFormat(
            quantity,
            "quantity is bigger than material's available",
            "quantity",
            "body"
          )
        );
    }

    //check if document exist
    let materialEmployee = await MaterialEmployee.findOne({
      material: materialID,
      employee: employeeID,
    });

    //if not exist create new one
    if (!materialEmployee) {
      materialEmployee = await MaterialEmployee.create({
        material: material._id,
        employee: employee._id,
      });
      statusCode = 201;
    }

    //check array max length
    if (materialEmployee.history.length > 100000) {
      //remove last element
      materialEmployee.history.pop();
    }

    materialEmployee.history.push({
      quantity,
      operation: operation || "Take",
      date: new Date(currentTime()),
      model: modelID,
      order: orderID,
    });

    //update total quantity taken and lastDate
    materialEmployee.totalQuantity += +quantity;
    materialEmployee.lastDate = new Date(currentTime());

    //update the custody available
    material.available -= +quantity;

    //save docs
    material.save();
    materialEmployee.save();

    res.status(statusCode).json({ msg: "material assigned tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "assign".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/materialEmployee/back
 */
const back = async (req, res) => {
  const {
    material: materialID,
    employee: employeeID,
    order: orderID,
    model: modelID,
    quantity,
    operation,
  } = req.body;

  try {
    //check materialID validity
    if (!idCheck(materialID)) {
      return res
        .status(400)
        .json(
          errorFormat(materialID, "material id is invalid", "material", "body")
        );
    }

    //check employeeID validity
    if (!idCheck(employeeID)) {
      return res
        .status(400)
        .json(
          errorFormat(employeeID, "employee id is invalid", "employee", "body")
        );
    }

    //check orderID validity
    if (orderID && !idCheck(orderID)) {
      return res
        .status(400)
        .json(errorFormat(orderID, "order id is invalid", "order", "body"));
    }

    //check modelID validity
    if (modelID && !idCheck(modelID)) {
      return res
        .status(400)
        .json(errorFormat(modelID, "model id is invalid", "model", "body"));
    }

    //check if material exist
    const material = await Material.findById(materialID);
    if (!material) {
      return res
        .status(400)
        .json(
          errorFormat(
            materialID,
            "No material with this ID",
            "material",
            "body"
          )
        );
    }

    //check if employee exist
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "No employee with this ID",
            "employee",
            "body"
          )
        );
    }

    //check if order exist
    if (orderID) {
      const order = await Order.findById(orderID);
      if (!order) {
        return res
          .status(400)
          .json(errorFormat(orderID, "No order with this ID", "order", "body"));
      }
    }

    //check if model exist
    if (modelID) {
      const model = await Model.findById(modelID);
      if (!model) {
        return res
          .status(400)
          .json(errorFormat(modelID, "No model with this ID", "model", "body"));
      }
    }

    //check if document exist
    const materialEmployee = await MaterialEmployee.findOne({
      material: materialID,
      employee: employeeID,
    });
    if (!materialEmployee) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "Can not return material that did not take ",
            "employee & material",
            "body"
          )
        );
    }

    if (materialEmployee.totalQuantity === 0) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "Can not return material that did not take ",
            "employee & material",
            "body"
          )
        );
    }

    //check back quantity
    if (materialEmployee.totalQuantity < quantity) {
      return res
        .status(400)
        .json(
          errorFormat(
            quantity,
            "quantity is bigger than total materials token",
            "quantity",
            "body"
          )
        );
    }

    //check roles
    if (material.role.num > employee.role.num) {
      return res
        .status(400)
        .json(
          errorFormat(
            material.role.num,
            "material role is not suitable for this employee",
            "material.role.num",
            "other"
          )
        );
    }

    //check array max length
    if (materialEmployee.history.length > 100000) {
      //remove last element
      materialEmployee.history.pop();
    }

    materialEmployee.history.push({
      quantity,
      operation: operation || "Back",
      date: new Date(currentTime()),
      model: modelID,
      order: orderID,
    });

    //update total quantity taken and lastDate
    materialEmployee.totalQuantity -= +quantity;
    materialEmployee.lastDate = new Date(currentTime());

    //update the custody available
    material.available += +quantity;

    //save docs
    material.save();
    materialEmployee.save();

    res.status(200).json({ msg: "material returned tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "back".bgYellow);
    console.log(error);
  }
};

module.exports = { assign, back };
