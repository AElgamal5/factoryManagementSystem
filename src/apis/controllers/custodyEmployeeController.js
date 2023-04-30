const { CustodyEmployee, Custody, Employee } = require("../models");
const { errorFormat, idCheck, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/custodyEmployee/assign
 */
const assign = async (req, res) => {
  const {
    custody: custodyID,
    employee: employeeID,
    quantity,
    operation,
  } = req.body;

  try {
    //check custodyID validity
    if (!idCheck(custodyID)) {
      return res
        .status(400)
        .json(
          errorFormat(custodyID, "custody.id is invalid", "custody.id", "body")
        );
    }

    //check employeeID validity
    if (!idCheck(employeeID)) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "employee.id is invalid",
            "employee.id",
            "body"
          )
        );
    }

    //check if custody exist
    const custody = await Custody.findById(custodyID);
    if (!custody) {
      return res
        .status(400)
        .json(
          errorFormat(
            custodyID,
            "No custody with this ID",
            "custody.id",
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
            "employee.id",
            "body"
          )
        );
    }

    //check roles
    if (custody.role.num > employee.role.num) {
      return res
        .status(400)
        .json(
          errorFormat(
            custody.role,
            "Custody role is not suitable for this employee",
            "custody.role",
            "other"
          )
        );
    }

    //check the quantity availability
    if (custody.available < quantity) {
      return res
        .status(400)
        .json(
          errorFormat(
            quantity,
            "quantity is bigger than custody's available",
            "quantity",
            "body"
          )
        );
    }

    //check if document exist
    let custodyEmployee = await CustodyEmployee.findOne({
      custody: custodyID,
      employee: employeeID,
    });

    //if not exist create new one
    if (!custodyEmployee) {
      custodyEmployee = await CustodyEmployee.create({
        custody: custody._id,
        employee: employee._id,
      });
    }

    //check array max length
    if (custodyEmployee.history.length > 10000) {
      //remove last element
      custodyEmployee.history.pop();
    }

    custodyEmployee.history.push({
      quantity,
      operation: operation || "Take",
      date: new Date(currentTime()),
    });

    //update total quantity taken and lastDate
    custodyEmployee.totalQuantity += +quantity;
    custodyEmployee.lastDate = new Date(currentTime());

    //update the custody available
    custody.available -= +quantity;

    //update custody currentEmployees array
    const employeeIndex = custody.currentEmployees.findIndex(
      (emp) => emp.id.toString() === employeeID
    );

    //update if exist
    if (employeeIndex !== -1) {
      custody.currentEmployees[employeeIndex].totalQuantity =
        custodyEmployee.totalQuantity;
    }
    //push to array if no exist
    else {
      custody.currentEmployees.push({
        id: employeeID,
        totalQuantity: custodyEmployee.totalQuantity,
      });
    }

    //update employee.custodies array
    const custodyIndex = employee.currentCustodies.findIndex(
      (cus) => cus.id.toString() === custodyID
    );
    //update if exist
    if (custodyIndex !== -1) {
      employee.currentCustodies[custodyIndex].totalQuantity =
        custodyEmployee.totalQuantity;
    }
    //push to array if no exist
    else {
      employee.currentCustodies.push({
        id: custodyID,
        totalQuantity: custodyEmployee.totalQuantity,
      });
    }

    //save the updated/created documents
    await custodyEmployee.save();
    await custody.save();
    await employee.save();

    res.status(201).json({ msg: "Custody assigned tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "assign".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/custodyEmployee/back
 */
const back = async (req, res) => {
  const {
    custody: custodyID,
    employee: employeeID,
    quantity,
    operation,
  } = req.body;

  try {
    //check custodyID validity
    if (!idCheck(custodyID)) {
      return res
        .status(400)
        .json(
          errorFormat(custodyID, "custody.id is invalid", "custody.id", "body")
        );
    }

    //check employeeID validity
    if (!idCheck(employeeID)) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "employee.id is invalid",
            "employee.id",
            "body"
          )
        );
    }

    //check if custody exist
    const custody = await Custody.findById(custodyID);
    if (!custody) {
      return res
        .status(400)
        .json(
          errorFormat(
            custodyID,
            "No custody with this ID",
            "custody.id",
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
            "employee.id",
            "body"
          )
        );
    }

    //check roles
    if (custody.role.num > employee.role.num) {
      return res
        .status(400)
        .json(
          errorFormat(
            custody.role,
            "custody role and employee role does not match",
            "custody.role",
            "other"
          )
        );
    }

    //check if document exist
    let custodyEmployee = await CustodyEmployee.findOne({
      custody: custodyID,
      employee: employeeID,
    });

    //if not exist error
    if (!custodyEmployee) {
      return res
        .status(400)
        .json(
          errorFormat(
            custodyID,
            "No Custody-Employee with this data",
            "custodyID, employeeID",
            "body"
          )
        );
    }

    //update history array
    custodyEmployee.history.push({
      quantity,
      operation: operation || "Back",
      date: new Date(currentTime()),
    });

    //update total quantity taken
    if (custodyEmployee.totalQuantity < quantity) {
      return res
        .status(400)
        .json(
          errorFormat(
            quantity,
            "Quantity must be less than or equal total quantity",
            "quantity",
            "body"
          )
        );
    }
    custodyEmployee.totalQuantity -= +quantity;
    custodyEmployee.lastDate = new Date(currentTime());

    //update the custody available
    custody.available += +quantity;

    //update custody.currentEmployees array
    const employeeIndex = custody.currentEmployees.findIndex(
      (emp) => emp.id.toString() === employeeID
    );
    //update if exist
    if (employeeIndex !== -1) {
      custody.currentEmployees[employeeIndex].totalQuantity =
        custodyEmployee.totalQuantity;
    }

    //update employee.currentCustodies array
    const custodyIndex = employee.currentCustodies.findIndex(
      (cus) => cus.id.toString() === custodyID
    );
    //update if exist
    if (custodyIndex !== -1) {
      employee.currentCustodies[custodyIndex].totalQuantity =
        custodyEmployee.totalQuantity;
    }

    //error custodyIndex or employeeIndex if not exist
    if (custodyIndex === -1 || employeeIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            quantity,
            "Can't return custody did not take",
            "quantity",
            "body"
          )
        );
    }

    //if totalQuantity = 0 remove form employee.currentCustodies and custody.currentEmployees
    if (custodyEmployee.totalQuantity === 0) {
      employee.currentCustodies.pop(
        employee.currentCustodies[custodyIndex]._id
      );

      custody.currentEmployees.pop(custody.currentEmployees[employeeIndex]._id);
    }

    //save the documents
    await custodyEmployee.save();
    await employee.save();
    await custody.save();

    res.status(200).json({ msg: "Custody returned tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "back".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custodyEmployee/employee/:id
 */
const allCustodiesForEmployee = async (req, res) => {
  const employeeID = req.params.id;
  try {
    const employee = await Employee.findById(employeeID);
    if (!employee) {
      return res
        .status(400)
        .json(
          errorFormat(employeeID, "No employee with this ID", "id", "header")
        );
    }

    const custodies = await CustodyEmployee.find({
      employee: employeeID,
    })
      .populate("custody", ["-createdAt", "-updatedAt", "-__v"])
      .select(["-history", "-__v", "-createdAt", "-updatedAt", "-employee"]);

    res.status(200).json({ data: custodies });
  } catch (error) {
    console.log("Error is in: ".bgRed, "allCustodiesForEmployee".bgYellow);
    console.log(error);
  }
};

/*
 * method: get
 * path: /api/materialEmployee/custody/:id
 */
const allEmployeesForCustody = async (req, res) => {
  const custodyID = req.params.id;
  try {
    const custody = await Custody.findById(custodyID);
    if (!custody) {
      return res
        .status(400)
        .json(
          errorFormat(custodyID, "No custody with this ID", "id", "header")
        );
    }

    const employees = await CustodyEmployee.find({
      custody: custodyID,
    })
      .populate("employee", ["-createdAt", "-updatedAt", "-__v"])
      .select(["-history", "-__v", "-createdAt", "-updatedAt", "-custody"]);

    res.status(200).json({ data: employees });
  } catch (error) {
    console.log("Error is in: ".bgRed, "allEmployeesForCustody".bgYellow);
    console.log(error);
  }
};

/*
 * method: get
 * path: /api/materialEmployee/note/:id
 */
const updateNote = async (req, res) => {
  const id = req.params.id;
  const note = req.body.note;

  try {
    const custodyEmployee = await CustodyEmployee.findById(id);
    if (!custodyEmployee) {
      return res
        .status(400)
        .json(
          errorFormat(id, "No CustodyEmployee doc with this ID", id, "header")
        );
    }

    custodyEmployee.note = note;
    await custodyEmployee.save();

    res.status(200).json({ msg: "note added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "updateNote".bgYellow);
    console.log(error);
  }
};

module.exports = {
  assign,
  back,
  allCustodiesForEmployee,
  allEmployeesForCustody,
  updateNote,
};
