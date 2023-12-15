const { Employee, Group, Stage, Order, Model, Card } = require("../models");
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
 * path: /api/group/production/order/:oid/model/:mid/date/:date
 */
const dailyProduction = async (req, res) => {
  const { oid, mid, date } = req.params;
  try {
    //check id for order and model
    if (!idCheck(oid)) {
      return res
        .status(400)
        .json(errorFormat(id, "Invalid order ID", "id", "params"));
    }
    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(id, "Invalid model ID", "id", "params"));
    }

    //check if the order and model exist
    const order = await Order.findById(oid);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(oid, "No order with this id", "oid", "params"));
    }
    const model = await Model.findById(mid);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "No model with this id", "mid", "params"));
    }

    //get all groups with the givin order and model
    const groups = await Group.find({ order: oid, model: mid })
      .populate("endStage", "name type rate")
      .populate("startStage", "name type rate")
      .populate("employee", "name");
    if (!groups.length) {
      res
        .status(404)
        .json(
          errorFormat(
            `${oid}&${mid}`,
            "No groups for these order and model",
            "oid&mid",
            "params"
          )
        );
    }

    let result = [];
    for (let i = 0; i < groups.length; i++) {
      result.push({
        groupID: groups[i]._id.toString(),
        groupAdminID: groups[i].employee.id,
        groupAdminName: groups[i].employee.name,
        stageID: groups[i].endStage.id.toString(),

        endStageID: groups[i].endStage.id.toString(),
        endStageName: groups[i].endStage.name,
        endStageType: groups[i].endStage.type,
        endStageRate: groups[i].endStage.rate,

        startStageID: groups[i].startStage.id.toString(),
        startStageName: groups[i].startStage.name,
        startStageType: groups[i].startStage.type,
        startStageRate: groups[i].startStage.rate,

        totalTrack: 0,
        totalError: 0,
        required: groups[i].endStage.rate * 8,
        track: [],
        error: [],
      });
    }

    const givenDate = new Date(date);

    //get all cards for order and model
    const cards = await Card.find({ order: oid, model: mid });

    for (let i = 0; i < cards.length; i++) {
      //card.tracking
      for (let j = 0; j < cards[i].tracking.length; j++) {
        const trackDate = new Date(cards[i].tracking[j].dateOut);
        if (
          givenDate.getDate() === trackDate.getDate() &&
          givenDate.getMonth() === trackDate.getMonth() &&
          givenDate.getFullYear() === trackDate.getFullYear()
        ) {
          const stageIndex = result.findIndex((obj) => {
            return (
              obj.stageID.toString() ===
              cards[i].tracking[j].stage._id.toString()
            );
          });
          if (stageIndex !== -1) {
            result[stageIndex].totalTrack += cards[i].quantity;

            const trackHour = trackDate.getHours();
            let temp = result[stageIndex].track;
            if (!temp[trackHour]) {
              temp[trackHour] = 0;
            }
            temp[trackHour] += cards[i].quantity;
            result[stageIndex].track = temp;
          }
        }
      }
      //card.cardErrors
      for (let j = 0; j < cards[i].cardErrors.length; j++) {
        for (let k = 0; k < cards[i].cardErrors[j].pieceErrors.length; k++) {
          console.log(cards[i].cardErrors[j].pieceErrors[k].dateIn);
          const addedDate = new Date(
            cards[i].cardErrors[j].pieceErrors[k].dateIn
          );

          if (
            givenDate.getDate() === addedDate.getDate() &&
            givenDate.getMonth() === addedDate.getMonth() &&
            givenDate.getFullYear() === addedDate.getFullYear()
          ) {
            const stageIndex = result.findIndex((obj) => {
              return (
                obj.stageID ===
                cards[i].cardErrors[j].pieceErrors[k].stage.toString()
              );
            });
            if (stageIndex !== -1) {
              console.log("1".repeat(30));
              result[stageIndex].totalError += 1;

              const addHour = addedDate.getHours();
              let temp = result[stageIndex].error;
              if (!temp[addHour]) {
                temp[addHour] = 0;
              }
              temp[addHour] += 1;
              result[stageIndex].error = temp;
            }
          }
        }
      }
    }

    res.status(200).json({ msg: "tmam", result });
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
  dailyProduction,
};
