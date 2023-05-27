const { Employee, Role, Image } = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/employee/
 */
const create = async (req, res) => {
  const { name, code, role: roleId, image, phoneNo, NID, note } = req.body;

  try {
    //check if the code exist
    let exist = await Employee.findOne({ code });
    if (exist) {
      return res
        .status(400)
        .json(errorFormat(code, "This code is used", "code", "body"));
    }

    //check role validity & existence
    if (!idCheck(roleId)) {
      return res
        .status(400)
        .json(errorFormat(roleId, "Role id is invalid", "role", "body"));
    }
    const role = await Role.findById(roleId);
    if (!role) {
      return res
        .status(404)
        .json(errorFormat(roleId, "No role with this id", "role", "body"));
    }

    //check if the phoneNo exist & uniqueness
    exist = await Employee.findOne({ phoneNo });
    if (exist) {
      return res
        .status(400)
        .json(errorFormat(phoneNo, "This phoneNo is used", "phoneNo", "body"));
    }

    //check NID existence & uniqueness if given
    if (NID) {
      exist = await Employee.findOne({ NID });
      if (exist) {
        return res
          .status(400)
          .json(errorFormat(NID, "This NID is used", "NID", "body"));
      }
    }

    //image checks
    let imageDocID;
    if (image) {
      imageDocID = (await Image.create({ data: image }))._id;
    }

    const employee = await Employee.create({
      name,
      code,
      role: role._id,
      phoneNo,
      NID,
      note,
      image: imageDocID,
    });

    res.status(201).json({ data: employee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "employee.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/employee/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const employee = await Employee.findById(id)
      .populate("role")
      .populate("image");

    if (!employee) {
      return res
        .status(404)
        .json(errorFormat(id, "No Employee with this id", "id", "params"));
    }

    res.status(200).json({ data: employee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "employee.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/employee/
 */
const getAll = async (req, res) => {
  try {
    const employees = await Employee.find({}).populate("role");

    res.status(200).json({ data: employees });
  } catch (error) {
    console.log("Error is in: ".bgRed, "employee.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: POST
 * path: /api/employee/code/
 */
const getByCode = async (req, res) => {
  const code = req.body.code;

  try {
    const employee = await Employee.findOne({ code });

    if (!employee) {
      return res
        .status(404)
        .json(errorFormat(code, "No Employee with this code", "code", "body"));
    }

    res.status(200).json({ data: employee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "employee.getByCode".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: POST
 * path: /api/employee/name/
 */
const searchByName = async (req, res) => {
  const name = req.body.name;

  try {
    //search like and case insensitive
    const employees = await Employee.find({
      name: { $regex: ".*" + name + ".*", $options: "i" },
    });

    if (!employees || employees.length === 0) {
      return res
        .status(404)
        .json(errorFormat(name, "No Employees with this name", "name", "body"));
    }
    res.status(200).json({ data: employees });
  } catch (error) {
    console.log("Error is in: ".bgRed, "employee.getByCode".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/employee/:id
 */
const updateProfile = async (req, res) => {
  const id = req.params.id;
  const { name, code, role: roleId, image, phoneNo, NID, note } = req.body;
  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .json(errorFormat(id, "No Employee with this id", "id", "params"));
    }

    //code checks
    if (code) {
      //code checks
      let exist = await Employee.findOne({ code });
      if (exist && id !== exist._id.toString()) {
        return res
          .status(400)
          .json(errorFormat(code, "This code is used", "code", "body"));
      }
    }

    //role checks
    if (roleId) {
      if (!idCheck(roleId)) {
        return res
          .status(400)
          .json(errorFormat(roleId, "Role id is invalid", "role", "body"));
      }
      const role = await Role.findById(roleId);
      if (!role) {
        return res
          .status(404)
          .json(errorFormat(roleId, "No role with this id", "role", "body"));
      }
    }

    //phoneNo checks
    if (phoneNo) {
      exist = await Employee.findOne({ phoneNo });
      if (exist && id !== exist._id.toString()) {
        return res
          .status(400)
          .json(
            errorFormat(phoneNo, "This phoneNo is used", "phoneNo", "body")
          );
      }
    }

    //NID checks
    if (NID) {
      exist = await Employee.findOne({ NID });
      if (exist && id !== exist._id.toString()) {
        return res
          .status(400)
          .json(errorFormat(NID, "This NID is used", "NID", "body"));
      }
    }

    let imageDocID;
    if (image) {
      const exist = await Image.findById(employee.image);
      if (exist) {
        await Image.findByIdAndDelete(employee.image);
      }
      imageDocID = (await Image.create({ data: image }))._id;
    }

    //update the employee
    await Employee.findByIdAndUpdate(id, {
      name,
      code,
      role: roleId,
      phoneNo,
      NID,
      note,
      image: imageDocID,
    });

    res.status(200).json({ msg: "Employee is updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "employee.updateProfile".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .status(404)
        .json(errorFormat(id, "No Employee with this id", "id", "params"));
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
    console.log("Error is in: ".bgRed, "employee.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
