const { UserEmployee, User, Employee, Order, Model } = require("../models");
const { errorFormat, idCheck, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/userEmployee/
 */
const create = async (req, res) => {
  const { user: userID, employee: employeeID, details, note } = req.body;

  try {
    //user checks
    if (!idCheck(userID)) {
      return res
        .status(400)
        .json(errorFormat(userID, "Invalid user id", "user", "body"));
    }
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json(errorFormat(userID, "No user with this id", "user", "body"));
    }

    //employee check
    if (!idCheck(employeeID)) {
      return res
        .status(400)
        .json(
          errorFormat(employeeID, "Invalid employee id", "employee", "body")
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

    //code check
    if (user.code !== employee.code) {
      return res
        .status(400)
        .json(
          errorFormat(
            user.code,
            "User's code is different from employee's code",
            "user.code",
            "other"
          )
        );
    }

    //uniqueness check
    const exist = await UserEmployee.findOne({
      user: userID,
      employee: employeeID,
    });
    if (exist) {
      return res
        .status(400)
        .json(errorFormat(userID, "Already exist", "user&employee", "body"));
    }

    const userEmployee = await UserEmployee.create({
      user: userID,
      employee: employeeID,
      details,
      note,
    });

    res.status(201).json({ data: userEmployee });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/userEmployee/
 */
const getAll = async (req, res) => {
  try {
    const docs = await UserEmployee.find()
      .populate({
        path: "user",
        select: "name role code",
        populate: { path: "role" },
      })
      .populate({
        path: "employee",
        select: "name role code",
        populate: { path: "role" },
      })
      .slice("work", -1)
      .populate("work.model", "name")
      .populate("work.order", "name");

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/userEmployee/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await UserEmployee.findById(id)
      .populate({
        path: "user",
        select: "name role code",
        populate: { path: "role" },
      })
      .populate({
        path: "employee",
        select: "name role code",
        populate: { path: "role" },
      })
      .populate("work.model", "name")
      .populate("work.order", "name");

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No document with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/userEmployee/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { user: userID, employee: employeeID, details, note, state } = req.body;

  try {
    let user;
    let employee;

    const doc = await UserEmployee.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No document with this id", "id", "params"));
    }

    if (userID) {
      if (!idCheck(userID)) {
        return res
          .status(400)
          .json(errorFormat(userID, "Invalid user id", "user", "body"));
      }
      user = await User.findById(userID);
      if (!user) {
        return res
          .status(404)
          .json(errorFormat(userID, "No user with this id", "user", "body"));
      }
    }

    if (employeeID) {
      if (!idCheck(employeeID)) {
        return res
          .status(400)
          .json(
            errorFormat(employeeID, "Invalid employee id", "employee", "body")
          );
      }
      employee = await Employee.findById(employeeID);
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
    }

    if (userID && employeeID && user.code !== employee.code) {
      return res
        .status(400)
        .json(
          errorFormat(
            user.code,
            "User's code and employee's code does not match",
            "user.code&employee.code",
            "others"
          )
        );
    } else if (userID) {
      employee = await Employee.findById(doc.employee);
      if (user.code !== employee.code) {
        return res
          .status(400)
          .json(
            errorFormat(
              user.code,
              "User's code and employee's code does not match",
              "user.code & employee.code",
              "others"
            )
          );
      }
    } else if (employeeID) {
      user = await User.findById(doc.user);
      if (user.code !== employee.code) {
        return res
          .status(400)
          .json(
            errorFormat(
              user.code,
              "User's code and employee's code does not match",
              "user.code&employee.code",
              "others"
            )
          );
      }
    }

    await UserEmployee.findByIdAndUpdate(id, {
      user: userID,
      employee: employeeID,
      details,
      note,
      state,
    });

    res.status(200).json({ msg: "userEmployee doc updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/userEmployee/activate
 */
const getAllActivate = async (req, res) => {
  try {
    const docs = await UserEmployee.find({ state: true })
      .populate({
        path: "user",
        select: "name role code",
        populate: { path: "role" },
      })
      .populate({
        path: "employee",
        select: "name role code",
        populate: { path: "role" },
      })
      .slice("work", 1)
      .populate("work.model", "name")
      .populate("work.order", "name");

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/userEmployee/deactivate
 */
const getAllDeactivate = async (req, res) => {
  try {
    const docs = await UserEmployee.find({ state: false })
      .populate({
        path: "user",
        select: "name role code",
        populate: { path: "role" },
      })
      .populate({
        path: "employee",
        select: "name role code",
        populate: { path: "role" },
      })
      .slice("work", 1)
      .populate("work.model", "name")
      .populate("work.order", "name");

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/userEmployee/work/:id
 */
const workAdding = async (req, res) => {
  const id = req.params.id;
  const { order: orderID, model: modelID } = req.body;

  try {
    const doc = await UserEmployee.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No document with this id", "id", "params"));
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

    if (doc.work.length > 9999) {
      doc.work.shift();
    }
    doc.work.push({
      order: orderID,
      model: modelID,
      date: currentTime(),
    });

    await doc.save();

    req.io.emit("assistantUpdated", { msg: "assistantUpdated" });

    res.status(200).json({ msg: "work added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.workAdding".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/userEmployee/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await UserEmployee.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No document with this id", "id", "params"));
    }

    await UserEmployee.findByIdAndDelete(id);

    res.status(200).json({ msg: "Document deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "userEmployee.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  update,
  getAllActivate,
  getAllDeactivate,
  workAdding,
  deleteOne,
};
