const { Employee } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/employee/
 */
const create = async (req, res) => {
  const {
    name,
    code,
    "role.title": roleTitle,
    "role.num": roleNum,
    image,
    phoneNo,
    NID,
    note,
  } = req.body;

  try {
    //check if the code exist
    const exist = await Employee.findOne({ code });
    if (exist) {
      return res
        .status(400)
        .json(errorFormat(code, "This code is used", "code", "body"));
    }

    const employee = await Employee.create({
      name,
      code,
      "role.title": roleTitle,
      "role.num": roleNum,
      phoneNo,
      NID,
      note,
    });
    res.status(201).json({ data: employee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/employee/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(400)
        .json(errorFormat(id, "No Employee with this id", "id", "header"));
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/employee/
 */
const getAll = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json({ date: employees });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: POST
 * path: /api/employee/code/
 */
const getByCode = async (req, res) => {
  const code = req.body.code;

  try {
    if (!code) {
      return res
        .status(400)
        .json(errorFormat(code, "Code is required", "code", "body"));
    }
    const employee = await Employee.findOne({ code });
    if (!employee) {
      return res
        .status(400)
        .json(errorFormat(code, "No Employee with this code", "code", "body"));
    }
    res.status(200).json({ data: employee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByCode".bgYellow);
    console.log(error);
  }
};

/*
 * method: POST
 * path: /api/employee/name/
 */
const searchByName = async (req, res) => {
  const name = req.body.name;

  try {
    if (!name) {
      return res
        .status(400)
        .json(errorFormat(name, "Name is required", "name", "body"));
    }

    //search like and case insensitive
    const employees = await Employee.find({
      name: { $regex: ".*" + name + ".*", $options: "i" },
    });

    if (!employees || employees.length === 0) {
      return res
        .status(400)
        .json(errorFormat(name, "No Employees with this name", "name", "body"));
    }
    res.status(200).json({ date: employees });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByCode".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/employee/:id
 */
const updateProfile = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    code,
    "role.title": roleTitle,
    "role.num": roleNum,
    image,
    phoneNo,
    NID,
    note,
  } = req.body;
  try {
    //check if the code exist
    if (code) {
      const exist = await Employee.findOne({ code });
      if (exist && id !== exist._id.toString()) {
        return res
          .status(400)
          .json(errorFormat(code, "This code is used", "code", "body"));
      }
    }

    //update the employee
    await Employee.findByIdAndUpdate(id, {
      name,
      code,
      "role.title": roleTitle,
      "role.num": roleNum,
      phoneNo,
      NID,
      note,
    });

    res.status(200).json({ msg: "Employee is updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "updateProfile".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/employee/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const employee = await Employee.findByIdAndDelete(id);

    if (!employee) {
      return res
        .status(400)
        .json(errorFormat(id, "No Employee with this id", "id", "header"));
    }

    //delete all custodyEmployee with this id
    // await CustodyEmployee.deleteMany({ "employee.id": id });

    //delete all employees in add custodies with given id
    // await Custody.updateMany(
    //   { "employees.id": id },
    //   { $pull: { employees: { id: id } } }
    // );

    res.status(200).json({ msg: "Employee deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

module.exports = {
  create,
  getByID,
  getAll,
  getByCode,
  searchByName,
  updateProfile,
  deleteOne,
};
