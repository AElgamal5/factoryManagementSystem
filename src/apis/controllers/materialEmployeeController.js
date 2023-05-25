const {
  Employee,
  Material,
  MaterialEmployee,
  // Order,
  // Model,
  Role,
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
    // order: orderID,
    // model: modelID,
    quantity,
    operation,
    note,
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
    // if (orderID && !idCheck(orderID)) {
    //   return res
    //     .status(400)
    //     .json(errorFormat(orderID, "order id is invalid", "order", "body"));
    // }

    //check modelID validity
    // if (modelID && !idCheck(modelID)) {
    //   return res
    //     .status(400)
    //     .json(errorFormat(modelID, "model id is invalid", "model", "body"));
    // }

    //check if material exist
    const material = await Material.findById(materialID);
    if (!material) {
      return res
        .status(404)
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
        .status(404)
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
    // if (orderID) {
    //   const order = await Order.findById(orderID);
    //   if (!order) {
    //     return res
    //       .status(400)
    //       .json(errorFormat(orderID, "No order with this ID", "order", "body"));
    //   }
    // }

    //check if model exist
    // if (modelID) {
    //   const model = await Model.findById(modelID);
    //   if (!model) {
    //     return res
    //       .status(400)
    //       .json(errorFormat(modelID, "No model with this ID", "model", "body"));
    //   }
    // }

    //check roles
    const materialRole = await Role.findById(material.role);
    if (!materialRole) {
      return res
        .status(404)
        .json(
          errorFormat(
            material.role,
            "No material role",
            "material.role",
            "other"
          )
        );
    }

    const employeeRole = await Role.findById(employee.role);
    if (!employeeRole) {
      return res
        .status(404)
        .json(
          errorFormat(
            employee.role,
            "No employee role",
            "employee.role",
            "other"
          )
        );
    }

    if (materialRole.number < employeeRole.number) {
      return res
        .status(400)
        .json(
          errorFormat(
            materialRole.number,
            "Material role is not suitable for this employee",
            "material.role",
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
      materialEmployee.history.shift();
    }

    materialEmployee.history.push({
      quantity,
      operation: operation || "Take",
      date: new Date(currentTime()),
      // model: modelID,
      // order: orderID,
    });

    //update total quantity taken and lastDate
    materialEmployee.totalQuantity += +quantity;
    materialEmployee.lastDate = new Date(currentTime());

    //update the custody available
    material.available -= +quantity;

    //update note if exist
    if (note) {
      materialEmployee.note = note;
    }

    //save docs
    material.save();
    materialEmployee.save();

    res.status(statusCode).json({ msg: "material assigned tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialEmployee.assign".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
    // order: orderID,
    // model: modelID,
    quantity,
    operation,
    note,
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
    // if (orderID && !idCheck(orderID)) {
    //   return res
    //     .status(400)
    //     .json(errorFormat(orderID, "order id is invalid", "order", "body"));
    // }

    //check modelID validity
    // if (modelID && !idCheck(modelID)) {
    //   return res
    //     .status(400)
    //     .json(errorFormat(modelID, "model id is invalid", "model", "body"));
    // }

    //check if material exist
    const material = await Material.findById(materialID);
    if (!material) {
      return res
        .status(404)
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
        .status(404)
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
    // if (orderID) {
    //   const order = await Order.findById(orderID);
    //   if (!order) {
    //     return res
    //       .status(400)
    //       .json(errorFormat(orderID, "No order with this ID", "order", "body"));
    //   }
    // }

    //check if model exist
    // if (modelID) {
    //   const model = await Model.findById(modelID);
    //   if (!model) {
    //     return res
    //       .status(400)
    //       .json(errorFormat(modelID, "No model with this ID", "model", "body"));
    //   }
    // }

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
    const materialRole = await Role.findById(material.role);
    if (!materialRole) {
      return res
        .status(404)
        .json(
          errorFormat(
            material.role,
            "No material role",
            "material.role",
            "other"
          )
        );
    }

    const employeeRole = await Role.findById(employee.role);
    if (!employeeRole) {
      return res
        .status(404)
        .json(
          errorFormat(
            employee.role,
            "No employee role",
            "employee.role",
            "other"
          )
        );
    }

    if (materialRole.number < employeeRole.number) {
      return res
        .status(400)
        .json(
          errorFormat(
            materialRole.number,
            "Material role is not suitable for this employee",
            "material.role",
            "other"
          )
        );
    }

    //check array max length
    if (materialEmployee.history.length > 100000) {
      //remove last element
      materialEmployee.history.shift();
    }

    materialEmployee.history.push({
      quantity,
      operation: operation || "Back",
      date: new Date(currentTime()),
      // model: modelID,
      // order: orderID,
    });

    //update total quantity taken and lastDate
    materialEmployee.totalQuantity -= +quantity;
    materialEmployee.lastDate = new Date(currentTime());

    //update the custody available
    material.available += +quantity;

    //update note if exist
    if (note) {
      materialEmployee.note = note;
    }

    //save docs
    material.save();
    materialEmployee.save();

    res.status(200).json({ msg: "material returned tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialEmployee.back".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: get
 * path: /api/materialEmployee/employee/:id
 */
const allMaterialsForEmployee = async (req, res) => {
  const employeeID = req.params.id;
  try {
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      return res
        .status(404)
        .json(
          errorFormat(employeeID, "No employee with this ID", "id", "params")
        );
    }

    const materials = await MaterialEmployee.find({
      employee: employeeID,
    })
      .populate("material", ["-createdAt", "-updatedAt", "-__v"])
      .select(["-__v", "-createdAt", "-updatedAt", "-employee"]);

    res.status(200).json({ data: materials });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "materialEmployee.allMaterialsForEmployee".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: get
 * path: /api/materialEmployee/material/:id
 */
const allEmployeesForMaterial = async (req, res) => {
  const materialID = req.params.id;
  try {
    const material = await Material.findById(materialID);
    if (!material) {
      return res
        .status(404)
        .json(
          errorFormat(materialID, "No material with this ID", "id", "params")
        );
    }

    const employees = await MaterialEmployee.find({
      material: materialID,
    })
      .populate("employee", ["-createdAt", "-updatedAt", "-__v"])
      .select(["-__v", "-createdAt", "-updatedAt", "-material"]);

    res.status(200).json({ data: employees });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "materialEmployee.allEmployeesForMaterial".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/materialEmployee/note/:id
 */
const updateNote = async (req, res) => {
  const id = req.params.id;
  const note = req.body.note;

  try {
    const materialEmployee = await MaterialEmployee.findById(id);
    if (!materialEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(id, "No MaterialEmployee doc with this ID", id, "params")
        );
    }

    materialEmployee.note = note;
    await materialEmployee.save();

    res.status(200).json({ msg: "note added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialEmployee.updateNote".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/materialEmployee/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await MaterialEmployee.findById(id);

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No doc with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "materialEmployee.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/materialEmployee/material/mid/employee/eid
 */
const getByMaterialIDAndEmployeeID = async (req, res) => {
  const { mid, eid } = req.params;

  try {
    const doc = await MaterialEmployee.findOne({
      material: mid,
      employee: eid,
    });

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No doc with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "materialEmployee.getByMaterialIDAndEmployeeID".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  assign,
  back,
  allMaterialsForEmployee,
  allEmployeesForMaterial,
  updateNote,
  getByID,
  getByMaterialIDAndEmployeeID,
};
