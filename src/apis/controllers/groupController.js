const { Employee, Group, Stage, Order, Model } = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/group/
 */
const create = async (req, res) => {
  const { employee, startStage, endStage, model, order } = req.body;

  try {
    //check employee id
    if (!idCheck(employee)) {
      return res
        .status(400)
        .json(errorFormat(employee, "Invalid employee ID", "employee", "body"));
    }
    //check order id
    if (!idCheck(order)) {
      return res
        .status(400)
        .json(errorFormat(order, "Invalid order ID", "order", "body"));
    }
    //check model id
    if (!idCheck(model)) {
      return res
        .status(400)
        .json(errorFormat(model, "Invalid model ID", "model", "body"));
    }
    //check startStage id
    if (!idCheck(startStage)) {
      return res
        .status(400)
        .json(
          errorFormat(startStage, "Invalid startStage ID", "startStage", "body")
        );
    }
    //check endStage id
    if (!idCheck(endStage)) {
      return res
        .status(400)
        .json(errorFormat(endStage, "Invalid endStage ID", "endStage", "body"));
    }

    //check if employee exist
    const employeeDoc = await Employee.findById(employee);
    if (!employeeDoc) {
      return res
        .status(404)
        .json(
          errorFormat(employee, "No employee with this ID", "employee", "body")
        );
    }
    //check if order exist
    const orderDoc = await Order.findById(order);
    if (!orderDoc) {
      return res
        .status(404)
        .json(errorFormat(order, "No order with this ID", "order", "body"));
    }
    //check if model exist
    const modelDoc = await Model.findById(model);
    if (!modelDoc) {
      return res
        .status(404)
        .json(errorFormat(model, "No model with this ID", "model", "body"));
    }
    //check if startStage exist
    const startStageDoc = await Stage.findById(startStage);
    if (!startStageDoc) {
      return res
        .status(404)
        .json(
          errorFormat(startStage, "No Stage with this ID", "startStage", "body")
        );
    }
    //check if endStage exist
    const endStageDoc = await Stage.findById(endStage);
    if (!endStageDoc) {
      return res
        .status(404)
        .json(
          errorFormat(endStage, "No Stage with this ID", "endStage", "body")
        );
    }

    //check if order contain the givin model
    const modelIndex = orderDoc.models.findIndex(
      (obj) => obj.id.toString() === model
    );
    if (modelIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            model,
            "The order does not contain the givin model",
            "model",
            "body"
          )
        );
    }

    //check if model contain the givin startStage
    const startStageIndex = modelDoc.stages.findIndex(
      (obj) => obj.id.toString() === startStage
    );
    if (startStageIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            startStage,
            "The model does not contain the givin startStage",
            "startStage",
            "body"
          )
        );
    }

    //check if model contain the givin endStage
    const endStageIndex = modelDoc.stages.findIndex(
      (obj) => obj.id.toString() === endStage
    );
    if (endStageIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            endStage,
            "The model does not contain the givin endStage",
            "endStage",
            "body"
          )
        );
    }

    //check if the startStage exist in other group
    const startStageExist = await Group.findOne({
      model,
      order,
      $or: [
        { startStage: startStage },
        { endStage: startStage },
        { stages: { $elemMatch: { $eq: startStage } } },
      ],
    });
    if (startStageExist) {
      return res
        .status(400)
        .json(
          errorFormat(
            startStage,
            "This stage is exist in other group",
            "startStage",
            "body"
          )
        );
    }
    //check if the endStage exist in other group
    const endStageExist = await Group.findOne({
      model,
      order,
      $or: [
        { startStage: endStage },
        { endStage: endStage },
        { stages: { $elemMatch: { $eq: endStage } } },
      ],
    });
    if (endStageExist) {
      return res
        .status(400)
        .json(
          errorFormat(
            endStage,
            "This stage is exist in other group",
            "endStage",
            "body"
          )
        );
    }

    //check if startStage is before endStage
    const startStagePriority = modelDoc.stages[startStageIndex].priority;
    const endStagePriority = modelDoc.stages[endStageIndex].priority;
    if (startStagePriority > endStagePriority) {
      return res
        .status(400)
        .json(
          errorFormat(
            `${startStage} > ${endStage}`,
            "endStage must be after startStage",
            `startStage&endStage`,
            "body"
          )
        );
    }

    //get stages in range form startStage to endStage
    let stages = [startStage];
    for (let i = startStagePriority + 1; i < endStagePriority; i++) {
      const stageIndex = modelDoc.stages.findIndex((obj) => obj.priority === i);
      if (stageIndex === -1) {
        return res
          .status(404)
          .json(
            errorFormat(
              i,
              "missing priority in model's stages",
              "priority",
              "others"
            )
          );
      }
      stages.push(modelDoc.stages[stageIndex].id);
    }
    stages.push(endStage);

    const doc = await Group.create({
      order,
      model,
      employee,
      stages,
      startStage,
      endStage,
    });

    res.status(201).json({ msg: "Group created tmam", data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "group.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/group/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    if (!idCheck(id)) {
      return res
        .status(400)
        .json(errorFormat(id, "Invalid group ID", "id", "params"));
    }

    const doc = await Group.findById(id)
      .populate("employee", "name code")
      .populate("order", "name")
      .populate("model", "name code")
      .populate("startStage", "name code rate")
      .populate("endStage", "name code rate")
      .populate("stages", "name code rate");

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No group with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
  } catch (error) {
    console.log("Error is in: ".bgRed, "group.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/group/
 */
const getAll = async (req, res) => {
  try {
    const docs = await Group.find({})
      .populate("employee", "name code")
      .populate("order", "name")
      .populate("model", "name code")
      .populate("startStage", "name code rate")
      .populate("endStage", "name code rate")
      .populate("stages", "name code rate");

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "groups.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/group/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { employee, startStage, endStage, model, order } = req.body;
  try {
    if (!idCheck(id)) {
      return res
        .status(400)
        .json(errorFormat(id, "Invalid group ID", "id", "params"));
    }
    const doc = await Group.findById(id);
    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No group with this id", "id", "params"));
    }

    if (employee) {
      doc.employee = employee;
    }
    await doc.save();

    res.status(200).json({ msg: "Group is updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "group.updateProfile".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/group/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    if (!idCheck(id)) {
      return res
        .status(400)
        .json(errorFormat(id, "Invalid group ID", "id", "params"));
    }

    const doc = await Group.findByIdAndDelete(id);

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No group with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Group deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "group.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/group/production/order/:oid/model/:mid
 */
const dailyProduction = async (req, res) => {
  const id = req.params.id;
  try {
    // if (!idCheck(id)) {
    //   return res
    //     .status(400)
    //     .json(errorFormat(id, "Invalid group ID", "id", "params"));
    // }
    // const doc = await Group.findByIdAndDelete(id);
    // if (!doc) {
    //   return res
    //     .status(404)
    //     .json(errorFormat(id, "No group with this id", "id", "params"));
    // }
    // res.status(200).json({ msg: "Group deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "group.dailyProduction".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  create,
  getByID,
  getAll,
  update,
  deleteOne,
  production,
};
