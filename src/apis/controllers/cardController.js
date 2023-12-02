const {
  Card,
  Salary,
  Employee,
  Stage,
  Order,
  Model,
  Work,
  StageEmployee,
  StageStatics,
} = require("../models");
const { idCheck, errorFormat, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/card/
 */
const create = async (req, res) => {
  const {
    code,
    order: orderID,
    modelIndex,
    quantity,
    details,
    startRange,
    endRange,
    cutNumber,
    boxNumber,
  } = req.body;

  try {
    //code check
    const exist = await Card.findOne({ code, order: orderID, modelIndex });
    if (exist) {
      return res
        .status(400)
        .json(
          errorFormat(
            code,
            "Code must be unique for each card in model in order",
            "code",
            "body"
          )
        );
    }

    //order checks
    if (!idCheck(orderID)) {
      return res
        .status(400)
        .json(errorFormat(orderID, "Invalid order id", "order", "body"));
    }
    if (!idCheck(modelIndex)) {
      return res
        .status(400)
        .json(
          errorFormat(modelIndex, "Invalid model index", "modelIndex", "body")
        );
    }
    const order = await Order.findById(orderID);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(orderID, "No order with this id", "order", "body"));
    }

    //model check
    const index = order.models.findIndex(
      (obj) => obj._id.toString() === modelIndex
    );
    if (index === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            index,
            "can not find model in order.models",
            "index",
            "others"
          )
        );
    }

    //quantity check
    let diff = endRange - startRange + 1;
    if (diff !== quantity) {
      return res
        .status(400)
        .json(
          errorFormat(
            quantity,
            "Quantity not equal range difference",
            quantity,
            "body"
          )
        );
    }

    //box number check
    const boxNumberUsed = await Card.findOne({
      done: false,
      boxNumber: boxNumber,
    }).populate("tracking.stage", "type");

    if (boxNumberUsed) {
      const finishIndex = boxNumberUsed.tracking.findIndex(
        (obj) => obj.stage.type === "finishing"
      );
    }

    if (finishIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            boxNumber,
            `The box number is use in card: ${boxNumberUsed.code}`,
            "boxNumber",
            "body"
          )
        );
    }

    const card = await Card.create({
      code,
      order: orderID,
      modelIndex,
      model: order.models[index].id,
      color: order.models[index].color,
      size: order.models[index].size,
      quantity,
      details,
      startRange,
      endRange,
      cutNumber,
      boxNumber,
    });

    card.history.push({
      state: "Card created",
      type: "create",
      date: currentTime(),
    });
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
    const docs = await Card.find()
      .populate("model", "name")
      .populate("order", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/last/:num
 */
const getLast = async (req, res) => {
  const num = req.params.num;

  try {
    const docs = await Card.find()
      .populate("model", "name")
      .populate("order", "name")
      .populate("tracking.stage", "name type")
      .populate("color", "name code")
      .populate("size", "name")
      .sort({ createdAt: -1 })
      .limit(num);

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getLast".bgYellow);
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
    const doc = await Card.findById(id)
      .populate("model", "name")
      .populate("order", "name")
      .populate("color", "name code")
      .populate("size", "name code")
      .populate("tracking.stage", "name stageErrors")
      .populate("tracking.employee", "name code")
      .populate("tracking.enteredBy", "name code")
      .populate("currentErrors", "name")
      .populate("cardErrors.pieceErrors.stage", "name")
      .populate("cardErrors.pieceErrors.addedBy", "name code")
      .populate("cardErrors.pieceErrors.enteredBy", "name code")
      .populate("cardErrors.pieceErrors.doneBy", "name code")
      .populate("cardErrors.pieceErrors.verifiedBy", "name code")
      .populate("globalErrors.addedBy", "name code")
      .populate("globalErrors.addedBy", "name code");

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    // const order = await Order.findById(doc.order._id)
    //   .populate("models.color", "name code")
    //   .populate("models.size", "code");

    // const index = order.models.findIndex(
    //   (obj) => obj._id.toString() === doc.modelIndex.toString()
    // );

    res.status(200).json({
      data: doc,
      // color: order.models[index].color,
      // size: order.models[index].size,
    });
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
  const {
    code,
    order: orderID,
    modelIndex,
    quantity,
    details,
    startRange,
    endRange,
    cutNumber,
    boxNumber,
    done,
  } = req.body;

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //code check
    if (code) {
      const exist = await Card.findOne({
        code,
        order: orderID,
        modelIndex: modelIndex,
      });
      if (exist) {
        return res
          .status(400)
          .json(
            errorFormat(
              code,
              "Code must be unique for each card in modelIndex in order",
              "code",
              "body"
            )
          );
      }
      card.code = code;
    }

    //check if the order has model
    if (orderID && modelIndex) {
      const orderModel = await Order.findById(orderID);

      if (!orderModel) {
        return res
          .status(404)
          .json(errorFormat(orderID, "No order with this id", "order", "body"));
      }
      const index = orderModel.models.findIndex(
        (obj) => obj._id.toString() === modelIndex
      );
      if (index === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              index,
              "can not find model in order.models",
              "index",
              "others"
            )
          );
      }

      card.order = orderID;
      card.modelIndex = modelIndex;
      card.model = orderModel.models[index].id;
      card.color = orderModel.models[index].code;
      card.size = orderModel.models[index].size;
    } else if (orderID) {
      const orderModel = await Order.findOne({
        _id: orderID,
        "models._id": card.modelIndex,
      });

      if (!orderModel) {
        return res
          .status(404)
          .json(
            errorFormat(
              orderID,
              "the order does not have card.modelIndex",
              "orderID",
              "body"
            )
          );
      }

      card.order = orderID;
    } else if (modelIndex) {
      const orderModel = await Order.findOne({
        _id: card.order,
        "models._id": modelIndex,
      });
      if (!orderModel) {
        return res
          .status(404)
          .json(
            errorFormat(
              modelIndex,
              "the order does not have modelIndex",
              "modelIndex",
              "body"
            )
          );
      }

      const index = orderModel.models.findIndex(
        (obj) => obj._id.toString() === modelIndex
      );
      if (index === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              index,
              "can not find model in order.models",
              "index",
              "others"
            )
          );
      }

      card.modelIndex = modelIndex;
      card.model = orderModel.models[index].id;
      card.color = orderModel.models[index].color;
      card.size = orderModel.models[index].size;
    }

    //quantity , endRange & startRange checks
    if (quantity) {
      card.quantity = quantity;
    }
    if (startRange) {
      card.startRange = startRange;
    }
    if (endRange) {
      card.endRange = endRange;
    }
    if (
      (quantity || startRange || endRange) &&
      card.endRange - card.startRange + 1 !== card.quantity
    ) {
      return res
        .status(400)
        .json(
          errorFormat(
            card.quantity,
            "Quantity not equal range difference",
            "card.quality",
            "others"
          )
        );
    }

    //details
    if (details) {
      card.details = details;
    }

    if (cutNumber) {
      card.cutNumber = cutNumber;
    }

    if (boxNumber) {
      const boxNumberUsed = await Card.findOne({
        done: false,
        boxNumber: boxNumber,
      });
      if (
        boxNumberUsed &&
        boxNumberUsed._id.toString() !== card._id.toString()
      ) {
        return res
          .status(400)
          .json(
            errorFormat(
              boxNumber,
              `The box number is use in card: ${boxNumberUsed.code}`,
              "boxNumber",
              "body"
            )
          );
      }
      card.boxNumber = boxNumber;
    }

    if (done) {
      card.done = done;
    }

    card.history.push({
      state: "Card profile updated",
      type: "update",
      date: currentTime(),
    });
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
// const addTracking = async (req, res) => {
//   const id = req.params.id;
//   const { stage: stageID, employee: employeeID, enteredBy } = req.body;
//   const io = req.io;

//   try {
//     //card check
//     const card = await Card.findById(id);
//     if (!card) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No card with this id", "id", "params"));
//     }

//     //stage check
//     if (!idCheck(stageID)) {
//       return res
//         .status(400)
//         .json(errorFormat(stageID, "Invalid stage id", "stage", "body"));
//     }
//     const stage = await Stage.findById(stageID);
//     if (!stage) {
//       return res
//         .status(404)
//         .json(errorFormat(stageID, "No Stage with this id", "stage", "body"));
//     }

//     //check if the stage exists in tracking
//     if (stage.type !== "quality") {
//       const existIndex = card.tracking.findIndex(
//         (obj) => obj.stage.toString() === stageID
//       );
//       if (existIndex !== -1) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               stageID,
//               "This stage had been tracked before",
//               "stage",
//               "body"
//             )
//           );
//       }
//     }

//     //check if card.model have the givin stage
//     const modelStage = await Model.findOne({
//       _id: card.model,
//       "stages.id": stageID,
//     });
//     if (!modelStage) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             stageID,
//             "This stage does not exist in card.model",
//             "stage",
//             "body"
//           )
//         );
//     }

//     //employee check
//     if (!idCheck(employeeID)) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(employeeID, "Invalid employee id", "employee", "body")
//         );
//     }
//     const employee = await Employee.findById(employeeID);
//     if (!employee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             employeeID,
//             "No employee with this id",
//             "employee",
//             "body"
//           )
//         );
//     }

//     //enteredBy
//     if (!idCheck(enteredBy)) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(enteredBy, "Invalid enteredBy id", "enteredBy", "body")
//         );
//     }
//     const user = await User.findById(enteredBy);
//     if (!user) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(enteredBy, "No user with this id", "enteredBy", "body")
//         );
//     }
//     const userEmployee = await UserEmployee.findOne({ user: user._id });
//     if (!userEmployee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             enteredBy,
//             "No 'UserEmployee' doc related with this id",
//             "enteredBy",
//             "body"
//           )
//         );
//     }
//     const enteredByEmployee = await Employee.findById(userEmployee.employee);
//     if (!enteredByEmployee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             enteredBy,
//             "No 'Employee' doc related to this id",
//             "enteredBy",
//             "body"
//           )
//         );
//     }

//     const current = currentTime();

//     let salary = await Salary.findOne({
//       employee: employeeID,
//       "date.month": current.getMonth() + 1,
//       "date.year": current.getFullYear(),
//     });

//     //if not exist create it
//     if (!salary) {
//       salary = await Salary.create({
//         employee: employeeID,
//         date: {
//           day: current.getDate(),
//           month: current.getMonth() + 1,
//           year: current.getFullYear(),
//         },
//       });
//     }

//     //update salary.totalWorkPerMonth array
//     const workIndex = salary.totalWorkPerMonth.findIndex(
//       (obj) => obj.stage.toString() === stageID
//     );

//     if (workIndex === -1) {
//       salary.totalWorkPerMonth.push({
//         stage: stageID,
//         quantity: card.quantity,
//       });
//     } else {
//       salary.totalWorkPerMonth[workIndex].quantity += card.quantity;
//     }

//     //check priceHistory
//     const priceIndex = salary.priceHistory.findIndex(
//       (obj) => obj.stage.toString() === stageID
//     );
//     if (priceIndex === -1) {
//       salary.priceHistory.push({ stage: stageID, price: stage.price });
//     }

//     //update no. of pieces and costs
//     if (current.getDate() === salary.date.day) {
//       salary.todayPieces += card.quantity;
//       salary.todayCost += card.quantity * stage.price;
//     } else {
//       salary.date.day = current.getDate();
//       salary.todayPieces = card.quantity;
//       salary.todayCost = card.quantity * stage.price;
//     }
//     salary.totalPieces += card.quantity;
//     salary.totalCost += card.quantity * stage.price;

//     //update salary.workDetails according to current day
//     const dayIndex = salary.workDetails.findIndex(
//       (obj) => obj.day === current.getDate()
//     );
//     if (dayIndex === -1) {
//       salary.workDetails.push({
//         day: current.getDate(),
//         work: [
//           {
//             stage: stage._id,
//             quantity: card.quantity,
//           },
//         ],
//       });
//     } else {
//       const stageIndex = salary.workDetails[dayIndex].work.findIndex(
//         (obj) => obj.stage.toString() === stage._id.toString()
//       );

//       if (stageIndex === -1) {
//         salary.workDetails[dayIndex].work.push({
//           stage: stage._id,
//           quantity: card.quantity,
//         });
//       } else {
//         salary.workDetails[dayIndex].work[stageIndex].quantity += card.quantity;
//       }
//     }
//     await salary.save();

//     card.tracking.push({
//       stage: stageID,
//       employee: employeeID,
//       enteredBy: enteredByEmployee._id,
//       dateOut: current,
//     });

//     card.history.push({
//       state: `Stage: ${stage.name} has been tracked`,
//       date: current,
//     });

//     //check if card is finished
//     const lastStage = modelStage.stages[modelStage.stages.length - 1].id;
//     if (lastStage.toString() === stageID) {
//       //update order
//       const order = await Order.findById(card.order);
//       const orderIndex = order.models.findIndex(
//         (obj) => obj.id.toString() === card.model.toString()
//       );

//       order.models[orderIndex].produced += card.quantity;
//       await order.save();

//       card.history.push({ state: `Finished`, date: current });
//     }

//     await card.save();

//     io.emit("addTracking", { msg: "addTracking", card, stage });

//     res.status(200).json({ msg: "Tracking added tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "card.addTracking".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };
const addTracking = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, employee: employeeID, enteredBy } = req.body;
  const io = req.io;

  try {
    //card check
    const card = await Card.findById(id).populate("tracking.stage", "type");
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //stage check
    if (!idCheck(stageID)) {
      return res
        .status(400)
        .json(errorFormat(stageID, "Invalid stage id", "stage", "body"));
    }
    const model = await Model.findById(card.model)
      .select("stages")
      .populate("stages.id", "type");
    const stageIndex = model.stages.findIndex(
      (obj) => obj.id._id.toString() === stageID
    );
    if (stageIndex === -1) {
      return res
        .status(404)
        .json(
          errorFormat(
            stageID,
            "The card's model does not has this stage",
            "stage",
            "body"
          )
        );
    }

    //check if the stage has been tracked before
    const trackedIndex = card.tracking.findIndex(
      (obj) => obj.stage._id.toString() === stageID
    );
    if (trackedIndex !== -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "This stage has been tracked before",
            "stage",
            "body"
          )
        );
    }

    //check if the card has errors
    if (card.currentErrors.length > 0) {
      return res
        .status(400)
        .json(
          errorFormat(
            id,
            "This card has errors, please fix it first",
            "id",
            "params"
          )
        );
    }

    //check if there un-repaired global errors
    for (let i = 0; i < card.globalErrors.length; i++) {
      if (!card.globalErrors[i].verifiedBy) {
        return res
          .status(400)
          .json(
            errorFormat(
              id,
              "This card has errors, please fix it first",
              "id",
              "params"
            )
          );
      }
    }

    //get stage
    const stage = await Stage.findById(stageID);

    //sequence in stages checks and make preparations out of sequence
    if (stage.type !== "preparations") {
      const order = await Order.findById(card.order).select("sequence");
      //if sequence activated
      if (order.sequence) {
        let lastNotPrep = -1;
        //get last not preparation index
        for (let i = card.tracking.length - 1; i > -1; i--) {
          if (card.tracking[i].stage.type !== "preparations") {
            lastNotPrep = card.tracking[i].stage._id;
            break;
          }
        }
        //get first not preparation index and check
        if (lastNotPrep === -1) {
          const firstNotPrepIndex = model.stages.findIndex(
            (obj) => obj.id.type !== "preparations"
          );
          if (model.stages[firstNotPrepIndex].id._id.toString() !== stageID) {
            return res
              .status(400)
              .json(
                errorFormat(
                  stageID,
                  "Please start with first stage",
                  "stage",
                  "body"
                )
              );
          }
        }
        //get next not preparation index and check
        else {
          let lastNotPrepIndex = -1;
          for (let i = 0; i < model.stages.length; i++) {
            if (model.stages[i].id._id.toString() === lastNotPrep.toString()) {
              lastNotPrepIndex = i;
              break;
            }
          }

          let nextNotPrepIndex = -1;
          for (let i = lastNotPrepIndex + 1; i < model.stages.length; i++) {
            if (model.stages.id.type !== "preparations") {
              nextNotPrepIndex = i;
              break;
            }
          }
          if (model.stages[nextNotPrepIndex].id._id.toString() !== stageID) {
            return res
              .status(400)
              .json(
                errorFormat(
                  stageID,
                  "Please track stages in order",
                  "stage",
                  "body"
                )
              );
          }
        }
      }
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

    //check if the employee is assigned to stage
    const stageEmployee = await StageEmployee.findOne({
      order: card.order,
      model: card.model,
      stage: stageID,
    });
    if (!stageEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This employee is not assigned to the stage",
            "employee",
            "body"
          )
        );
    }
    const stageEmployeeIndex = stageEmployee.employees.findIndex(
      (obj) => obj.employee.toString() === employeeID && !obj.out
    );
    if (
      stageEmployeeIndex === -1 ||
      stageEmployee.employees[stageEmployeeIndex].out
    ) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This employee is not assigned to the stage",
            "employee",
            "body"
          )
        );
    }

    //enteredBy checks
    if (!idCheck(enteredBy)) {
      return res
        .status(400)
        .json(
          errorFormat(enteredBy, "Invalid enteredBy id", "enteredBy", "body")
        );
    }
    const enteredByEmployee = await Employee.findById(enteredBy);
    if (!enteredByEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            enteredBy,
            "No employee with this id",
            "enteredBy",
            "body"
          )
        );
    }

    const current = currentTime();

    //get salary doc and if not exist create it
    let salary = await Salary.findOne({
      employee: employeeID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!salary) {
      salary = await Salary.create({
        employee: employeeID,
        date: {
          year: current.getFullYear(),
          month: current.getMonth() + 1,
          day: current.getDate(),
        },
      });
    }
    if (salary.idle) {
      return res
        .status(400)
        .json(
          errorFormat(employeeID, "This employee is Idle", "employee", "body")
        );
    }

    //update salary.totalWorkPerMonth
    const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (totalWorkIndex === -1) {
      salary.totalWorkPerMonth.push({
        stage: stageID,
        quantity: card.quantity,
        NoOfErrors: 0,
      });
    } else {
      salary.totalWorkPerMonth[totalWorkIndex].quantity += card.quantity;
    }

    //update salary.workDetails
    const dayIndex = salary.workDetails.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (dayIndex === -1) {
      salary.workDetails.push({
        day: current.getDate(),
        work: [
          {
            stage: stageID,
            quantity: card.quantity,
            noOfErrors: 0,
          },
        ],
      });
    } else {
      const stageIndex = salary.workDetails[dayIndex].work.findIndex(
        (obj) => obj.stage.toString() === stageID
      );

      if (stageIndex === -1) {
        salary.workDetails[dayIndex].work.push({
          stage: stageID,
          quantity: card.quantity,
          noOfErrors: 0,
        });
      } else {
        salary.workDetails[dayIndex].work[stageIndex].quantity += card.quantity;
      }
    }

    //check salary.priceHistory
    const priceIndex = salary.priceHistory.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (priceIndex === -1) {
      salary.priceHistory.push({ stage: stageID, price: stage.price });
    }

    //update no. of pieces and costs
    if (current.getDate() === salary.date.day) {
      salary.todayPieces += card.quantity;
      salary.todayCost += card.quantity * stage.price;
    } else {
      salary.date.day = current.getDate();
      salary.todayPieces = card.quantity;
      salary.todayCost = card.quantity * stage.price;
    }
    salary.totalPieces += card.quantity;
    salary.totalCost += card.quantity * stage.price;

    await salary.save();

    //update card
    card.tracking.push({
      stage: stageID,
      employee: employeeID,
      enteredBy: enteredBy,
      dateOut: current,
    });
    card.history.push({
      state: `Stage '${stage.name}' has been tracked`,
      type: "track",
      date: current,
    });
    await card.save();

    //update work doc for employee
    let employeeWork = await Work.findOne({
      employee: employeeID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!employeeWork) {
      employeeWork = await Work.create({
        employee: employeeID,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
        "date.day": current.getDate(),
      });
    }
    const employeeWorkIndex = employeeWork.workHistory.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (employeeWorkIndex === -1) {
      employeeWork.workHistory.push({
        day: current.getDate(),
        cards: [{ card: card._id, date: current, stage: stageID, type: 1 }],
      });
    } else {
      employeeWork.workHistory[employeeWorkIndex].cards.push({
        card: card._id,
        date: current,
        stage: stageID,
        type: 1,
      });
    }
    if (employeeWork.date.day !== current.getDate()) {
      employeeWork.date.day = current.getDate();
      employeeWork.todayCards = 0;
    }
    employeeWork.todayCards++;
    employeeWork.totalCards++;
    await employeeWork.save();

    //update work doc for enteredBy
    //incase quality checker the employeeID is the same of enteredBy
    if (employeeID !== enteredBy) {
      let enteredByWork = await Work.findOne({
        employee: enteredBy,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
      });
      if (!enteredByWork) {
        enteredByWork = await Work.create({
          employee: enteredBy,
          "date.year": current.getFullYear(),
          "date.month": current.getMonth() + 1,
          "date.day": current.getDate(),
        });
      }
      const enteredByWorkIndex = enteredByWork.workHistory.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (enteredByWorkIndex === -1) {
        enteredByWork.workHistory.push({
          day: current.getDate(),
          cards: [{ card: card._id, stage: stageID, date: current, type: 1 }],
        });
      } else {
        enteredByWork.workHistory[enteredByWorkIndex].cards.push({
          card: card._id,
          stage: stageID,
          date: current,
          type: 1,
        });
      }
      if (enteredByWork.date.day !== current.getDate()) {
        enteredByWork.date.day = current.getDate();
        enteredByWork.todayCards = 0;
      }
      enteredByWork.todayCards++;
      enteredByWork.totalCards++;
      await enteredByWork.save();
    }

    //check if the card finished
    if (model.stages.length === card.tracking.length) {
      const order = await Order.findById(card.order);
      if (!order) {
        return res
          .status(404)
          .json(
            errorFormat(
              card.order,
              "Wrong card's order",
              "card.order",
              "others"
            )
          );
      }

      const producedIndex = order.models.findIndex(
        (obj) => obj._id.toString() === card.modelIndex.toString()
      );

      if (producedIndex === -1) {
        return res
          .status(404)
          .json(
            errorFormat(
              card.modelIndex,
              "Wrong card's modelIndex",
              "card.modelIndex",
              "others"
            )
          );
      }

      order.models[producedIndex].produced += card.quantity;
      await order.save();

      card.history.push({
        state: `Finished`,
        type: "finish",
        date: current,
      });
      card.done = true;
      await card.save();
    }

    // //stage statics
    // let stageStaticsDoc = await StageStatics.findOne({
    //   stage: stageID,
    //   order: card.order,
    //   model: card.model,
    //   "date.year": current.getFullYear(),
    //   "date.month": current.getMonth() + 1,
    // });
    // if (!stageStaticsDoc) {
    //   stageStaticsDoc = await StageStatics.create({
    //     stage: stageID,
    //     order: card.order,
    //     model: card.model,
    //     "date.year": current.getFullYear(),
    //     "date.month": current.getMonth() + 1,
    //     "date.day": current.getDate(),
    //   });
    // }
    // //add employee to stageStatics.employees array if not exist
    // const employeeIndex = stageStaticsDoc.employees.findIndex(
    //   (obj) => obj.toString() === employeeID
    // );
    // if (employeeIndex === -1) {
    //   stageStaticsDoc.employees.push(employeeID);
    // }
    // //add obj to StageStatics.details
    // stageStaticsDoc.details.push({
    //   employee: employeeID,
    //   card: card._id,
    //   type: 1, // 1: track, 2:addError, 3:repairError & 4:confirm
    //   quantity: card.quantity,
    //   date: current,
    // });
    // //update StageStatics.overView
    // const detailsDayIndex = stageStaticsDoc.overView.findIndex(
    //   (obj) => obj.day === current.getDate(``)
    // );
    // if (detailsDayIndex === -1) {
    //   const currentHour = current.getHours();

    //   let track = [];
    //   track[currentHour - 6 - 2] = card.quantity;

    //   stageStaticsDoc.overView.push({
    //     day: current.getDate(),
    //     track,
    //     errors: [],
    //   });
    // } else {
    //   let track = stageStaticsDoc.overView[detailsDayIndex].track;
    //   const currentHour = current.getHours();
    //   track[currentHour - 6 - 2] = track[currentHour - 6 - 2] + card.quantity;
    //   stageStaticsDoc.overView[detailsDayIndex].track = track;
    // }
    // stageStaticsDoc.totalQuantity += card.quantity;
    // await stageStaticsDoc.save();

    io.emit("addTracking", {
      cardID: card._id,
      cardCode: card.code,
      cardDone: card.done,
      lastStageName: stage.name,
      lastStageType: stage.type,
      lastStageDate: current,
      trackingLength: card.tracking.length,
    });

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
// const removeTracking = async (req, res) => {
//   const id = req.params.id;
//   const trackingID = req.body.trackingID;

//   try {
//     //card check
//     const card = await Card.findById(id);
//     if (!card) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No card with this id", "id", "params"));
//     }

//     //check trackingID
//     if (!idCheck(trackingID)) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             trackingID,
//             "Invalid trackingID value",
//             "trackingID",
//             "body"
//           )
//         );
//     }
//     const trackingIndex = card.tracking.findIndex(
//       (obj) => obj._id.toString() === trackingID
//     );
//     if (trackingIndex === -1) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             trackingID,
//             "No tracking element with this id",
//             "trackingID",
//             "body"
//           )
//         );
//     }

//     const current = currentTime();

//     const salary = await Salary.findOne({
//       employee: card.tracking[trackingIndex].employee,
//       "date.year": current.getFullYear(),
//       "date.month": current.getMonth() + 1,
//     });
//     //get object due to dateOut in card.tracking
//     const dayIndex = salary.workDetails.findIndex(
//       (obj) => obj.day === card.tracking[trackingIndex].dateOut.getDate()
//     );
//     const workIndex = salary.workDetails[dayIndex].work.findIndex(
//       (obj) =>
//         obj.stage.toString() === card.tracking[trackingIndex].stage.toString()
//     );

//     const stage = await Stage.findById(card.tracking[trackingIndex].stage);

//     //update salary
//     salary.workDetails[dayIndex].work[trackingIndex].quantity -= card.quantity;
//     salary.totalPieces -= card.quantity;
//     salary.totalCost -= card.quantity * stage.price;
//     if (card.tracking[trackingIndex].dateOut.getDate() === current.getDate()) {
//       salary.todayPieces -= card.quantity;
//       salary.todayCost -= card.quantity * stage.price;
//     }
//     await salary.save();

//     card.history.push({
//       state: `Removing ${stage.name}`,
//       date: currentTime(),
//     });

//     card.tracking.pull(trackingID);
//     await card.save();

//     res.status(200).json({ msg: "Tracking removed tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "card.addTracking".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/card/:id/tracking/replace
 */
const replaceTracking = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, employee: employeeID, enteredBy } = req.body;
  const io = req.io;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //stage check
    if (!idCheck(stageID)) {
      return res
        .status(400)
        .json(errorFormat(stageID, "Invalid stage id", "stage", "body"));
    }
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No stage with this id", "stage", "body"));
    }
    //check if the stage not tracked
    const trackingIndex = card.tracking.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (trackingIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "Can not replace untracked stage",
            "stage",
            "body"
          )
        );
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
    //check if it with the same employee
    if (card.tracking[trackingIndex].employee.toString() === employeeID) {
      return res
        .status(400)
        .json(
          errorFormat(
            employeeID,
            "The given employee already tracked before",
            "employee",
            "body"
          )
        );
    }

    //check if the employee is assigned to stage
    const stageEmployee = await StageEmployee.findOne({
      order: card.order,
      model: card.model,
      stage: stageID,
    });
    if (!stageEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This employee is not assigned to the stage",
            "employee",
            "body"
          )
        );
    }
    const stageEmployeeIndex = stageEmployee.employees.findIndex(
      (obj) => obj.employee.toString() === employeeID && !obj.out
    );
    if (
      stageEmployeeIndex === -1 ||
      stageEmployee.employees[stageEmployeeIndex].out
    ) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This employee is not assigned to the stage",
            "employee",
            "body"
          )
        );
    }

    const current = currentTime();

    //get salary doc and if not exist create it
    let salaryCheck = await Salary.findOne({
      employee: employeeID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (salaryCheck && salaryCheck.idle) {
      return res
        .status(400)
        .json(
          errorFormat(employeeID, "This employee is Idle", "employee", "body")
        );
    }

    //enteredBy checks
    if (!idCheck(enteredBy)) {
      return res
        .status(400)
        .json(
          errorFormat(enteredBy, "Invalid enteredBy id", "enteredBy", "body")
        );
    }
    const enteredByEmployee = await Employee.findById(enteredBy);
    if (!enteredByEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            enteredBy,
            "No employee with this id",
            "enteredBy",
            "body"
          )
        );
    }

    const storedTime = card.tracking[trackingIndex].dateOut;

    //update salary for old employee in current time
    //get salary doc and if not exist create it
    let oldEmpSalary = await Salary.findOne({
      employee: card.tracking[trackingIndex].employee,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!oldEmpSalary) {
      oldEmpSalary = await Salary.create({
        employee: card.tracking[trackingIndex].employee,
        date: {
          year: current.getFullYear(),
          month: current.getMonth() + 1,
          day: current.getDate(),
        },
      });
    }

    //update salary.totalWorkPerMonth
    const oldTotalWorkIndex = oldEmpSalary.totalWorkPerMonth.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (oldTotalWorkIndex === -1) {
      oldEmpSalary.totalWorkPerMonth.push({
        stage: stageID,
        quantity: card.quantity * -1,
        NoOfErrors: 0,
      });
    } else {
      oldEmpSalary.totalWorkPerMonth[oldTotalWorkIndex].quantity -=
        card.quantity;
    }

    //update salary.workDetails
    const oldDayIndex = oldEmpSalary.workDetails.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (oldDayIndex === -1) {
      oldEmpSalary.workDetails.push({
        day: current.getDate(),
        work: [
          {
            stage: stageID,
            quantity: card.quantity * -1,
            NoOfErrors: 0,
          },
        ],
      });
    } else {
      const oldStageIndex = oldEmpSalary.workDetails[
        oldDayIndex
      ].work.findIndex((obj) => obj.stage.toString() === stageID);

      if (oldStageIndex === -1) {
        oldEmpSalary.workDetails[oldDayIndex].work.push({
          stage: stageID,
          quantity: card.quantity * -1,
          NoOfErrors: 0,
        });
      } else {
        oldEmpSalary.workDetails[oldDayIndex].work[oldStageIndex].quantity -=
          card.quantity;
      }
    }

    //check salary.priceHistory
    const oldPriceIndex = oldEmpSalary.priceHistory.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (oldPriceIndex === -1) {
      oldEmpSalary.priceHistory.push({ stage: stageID, price: stage.price });
    }

    //update no. of pieces and costs
    if (current.getDate() === oldEmpSalary.date.day) {
      oldEmpSalary.todayPieces -= card.quantity;
      oldEmpSalary.todayCost -= card.quantity * stage.price;
    } else {
      oldEmpSalary.date.day = current.getDate();
      oldEmpSalary.todayPieces = card.quantity * -1;
      oldEmpSalary.todayCost = card.quantity * stage.price * -1;
    }
    oldEmpSalary.totalPieces -= card.quantity;
    oldEmpSalary.totalCost -= card.quantity * stage.price;

    await oldEmpSalary.save();

    //update salary for new employee in current time
    //get salary doc and if not exist create it
    let newEmpSalary = await Salary.findOne({
      employee: employeeID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!newEmpSalary) {
      newEmpSalary = await Salary.create({
        employee: employeeID,
        date: {
          year: current.getFullYear(),
          month: current.getMonth() + 1,
          day: current.getDate(),
        },
      });
    }
    //update salary.totalWorkPerMonth
    const newTotalWorkIndex = newEmpSalary.totalWorkPerMonth.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (newTotalWorkIndex === -1) {
      newEmpSalary.totalWorkPerMonth.push({
        stage: stageID,
        quantity: card.quantity,
        NoOfErrors: 0,
      });
    } else {
      newEmpSalary.totalWorkPerMonth[newTotalWorkIndex].quantity +=
        card.quantity;
    }

    //update salary.workDetails
    const newDayIndex = newEmpSalary.workDetails.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (newDayIndex === -1) {
      newEmpSalary.workDetails.push({
        day: current.getDate(),
        work: [
          {
            stage: stageID,
            quantity: card.quantity,
            NoOfErrors: 0,
          },
        ],
      });
    } else {
      const newStageIndex = newEmpSalary.workDetails[
        newDayIndex
      ].work.findIndex((obj) => obj.stage.toString() === stageID);

      if (newStageIndex === -1) {
        newEmpSalary.workDetails[newDayIndex].work.push({
          stage: stageID,
          quantity: card.quantity,
          NoOfErrors: 0,
        });
      } else {
        newEmpSalary.workDetails[newDayIndex].work[newStageIndex].quantity +=
          card.quantity;
      }
    }

    //check salary.priceHistory
    const newPriceIndex = newEmpSalary.priceHistory.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (newPriceIndex === -1) {
      newEmpSalary.priceHistory.push({ stage: stageID, price: stage.price });
    }

    //update no. of pieces and costs
    if (current.getDate() === newEmpSalary.date.day) {
      newEmpSalary.todayPieces += card.quantity;
      newEmpSalary.todayCost += card.quantity * stage.price;
    } else {
      newEmpSalary.date.day = current.getDate();
      newEmpSalary.todayPieces = card.quantity;
      newEmpSalary.todayCost = card.quantity * stage.price;
    }
    newEmpSalary.totalPieces += card.quantity;
    newEmpSalary.totalCost += card.quantity * stage.price;

    await newEmpSalary.save();

    //update work for old employee in stored time
    const oldEmployeeWork = await Work.findOne({
      employee: card.tracking[trackingIndex].employee,
      "date.year": storedTime.getFullYear(),
      "date.month": storedTime.getMonth() + 1,
    });
    if (oldEmployeeWork) {
      const oldWorkHistoryIndex = oldEmployeeWork.workHistory.findIndex(
        (obj) => obj.day === storedTime.getDate()
      );
      if (oldWorkHistoryIndex !== -1) {
        const oldCardsIndex = oldEmployeeWork.workHistory[
          oldWorkHistoryIndex
        ].cards.findIndex(
          (obj) =>
            obj.card.toString() === id &&
            obj.date.getTime() === storedTime.getTime() &&
            obj.stage.toString() === stageID
        );

        if (oldCardsIndex !== -1) {
          oldEmployeeWork.workHistory[oldWorkHistoryIndex].cards.pull(
            oldEmployeeWork.workHistory[oldWorkHistoryIndex].cards[
              oldCardsIndex
            ]._id
          );

          if (storedTime.getDate() === current.getDate()) {
            oldEmployeeWork.todayCards--;
          }
          oldEmployeeWork.totalCards--;

          await oldEmployeeWork.save();
        }
      }
    }

    //update work for new employee in current time
    let newEmployeeWork = await Work.findOne({
      employee: employeeID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!newEmployeeWork) {
      newEmployeeWork = await Work.create({
        employee: employeeID,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
        "date.day": current.getDate(),
      });
    }
    const newEmployeeWorkIndex = newEmployeeWork.workHistory.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (newEmployeeWorkIndex === -1) {
      newEmployeeWork.workHistory.push({
        day: current.getDate(),
        cards: [{ card: card._id, date: current, stage: stageID, type: 1 }],
      });
    } else {
      newEmployeeWork.workHistory[newEmployeeWorkIndex].cards.push({
        card: card._id,
        date: current,
        stage: stageID,
        type: 1,
      });
    }
    if (newEmployeeWork.date.day !== current.getDate()) {
      newEmployeeWork.date.day = current.getDate();
      newEmployeeWork.todayCards = 0;
    }
    newEmployeeWork.todayCards++;
    newEmployeeWork.totalCards++;
    await newEmployeeWork.save();

    //if not entered with the same person
    if (enteredBy !== card.tracking[trackingIndex].enteredBy.toString()) {
      //update work for old enteredBy in stored time
      const oldEnteredByWork = await Work.findOne({
        employee: card.tracking[trackingIndex].enteredBy,
        "date.year": storedTime.getFullYear(),
        "date.month": storedTime.getMonth() + 1,
      });
      if (oldEnteredByWork) {
        const oldWorkHistoryIndex2 = oldEnteredByWork.workHistory.findIndex(
          (obj) => obj.day === storedTime.getDate()
        );
        if (oldWorkHistoryIndex2 !== -1) {
          const oldCardsIndex2 = oldEnteredByWork.workHistory[
            oldWorkHistoryIndex2
          ].cards.findIndex(
            (obj) =>
              obj.card.toString() === id &&
              obj.date.getTime() === storedTime.getTime() &&
              obj.stage.toString() === stageID
          );

          if (oldCardsIndex2 !== -1) {
            oldEnteredByWork.workHistory[oldWorkHistoryIndex2].cards.pull(
              oldEnteredByWork.workHistory[oldWorkHistoryIndex2].cards[
                oldCardsIndex2
              ]._id
            );

            if (storedTime.getDate() === current.getDate()) {
              oldEnteredByWork.todayCards--;
            }
            oldEnteredByWork.totalCards--;

            await oldEnteredByWork.save();
          }
        }
      }

      //update work for new enteredBy in current time
      let newEnteredByWork = await Work.findOne({
        employee: enteredBy,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
      });
      if (!newEnteredByWork) {
        newEnteredByWork = await Work.create({
          employee: enteredBy,
          "date.year": current.getFullYear(),
          "date.month": current.getMonth() + 1,
          "date.day": current.getDate(),
        });
      }
      const newEnteredByWorkIndex = newEnteredByWork.workHistory.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (newEnteredByWorkIndex === -1) {
        newEnteredByWork.workHistory.push({
          day: current.getDate(),
          cards: [{ card: card._id, date: current, stage: stageID, type: 1 }],
        });
      } else {
        newEnteredByWork.workHistory[newEnteredByWorkIndex].cards.push({
          card: card._id,
          date: current,
          stage: stageID,
          type: 1,
        });
      }
      if (newEnteredByWork.date.day !== current.getDate()) {
        newEnteredByWork.date.day = current.getDate();
        newEnteredByWork.todayCards = 0;
      }
      newEnteredByWork.todayCards++;
      newEnteredByWork.totalCards++;
      await newEnteredByWork.save();
    }

    //update card history and tracking
    card.tracking[trackingIndex].dateOut = current;
    card.tracking[trackingIndex].employee = employeeID;
    card.tracking[trackingIndex].enteredBy = enteredBy;
    card.history.push({
      state: `Stage '${stage.name}' has been replaced`,
      type: "replace",
      date: current,
    });
    await card.save();

    res.status(200).json({ msg: "replace tracking tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.replaceTracking".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/add/check
 */
// const addErrorCheck = async (req, res) => {
//   const id = req.params.id;
//   const { pieceNo, pieceErrors } = req.body;

//   try {
//     //card check
//     const card = await Card.findById(id);
//     if (!card) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No card with this id", "id", "params"));
//     }

//     //pieceNo check
//     if (pieceNo < card.startRange || pieceNo > card.endRange) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             pieceNo,
//             `pieceNo must be in range ${card.startRange}:${card.endRange}`,
//             "pieceNo",
//             "body"
//           )
//         );
//     }

//     //check loop
//     for (let i = 0; i < pieceErrors.length; i++) {
//       //stage checks
//       if (!idCheck(pieceErrors[i].stage)) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "Invalid stage ID",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }
//       const stage = await Stage.findById(pieceErrors[i].stage);
//       if (!stage) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "No stage with this id",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }
//       const stageIndex = card.tracking.findIndex(
//         (obj) => obj.stage.toString() === pieceErrors[i].stage
//       );
//       if (stageIndex === -1) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "Not tracked stage",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }

//       //check if card.model have the givin stage
//       const modelStage = await Model.findOne({
//         _id: card.model,
//         "stages.id": pieceErrors[i].stage,
//       });
//       if (!modelStage) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "This stage does not exist in card model",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }

//       const cardErrorsIndex = card.cardErrors.findIndex(
//         (obj) => obj.pieceNo === Number(pieceNo)
//       );
//       if (cardErrorsIndex !== -1) {
//         const exist = card.cardErrors[cardErrorsIndex].pieceErrors.findIndex(
//           (obj) => obj.stage.toString() === pieceErrors[i].stage
//         );
//         if (exist !== -1) {
//           return res
//             .status(400)
//             .json(
//               errorFormat(
//                 pieceErrors[i].stage,
//                 `this error exist in piece no.${pieceNo}`,
//                 `pieceErrors[${i}].stage`,
//                 "body"
//               )
//             );
//         }
//       }

//       //enteredBy
//       if (!idCheck(pieceErrors[i].enteredBy)) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "Invalid enteredBy id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }
//       const user = await User.findById(pieceErrors[i].enteredBy);
//       if (!user) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "No user with this id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }
//       const userEmployee = await UserEmployee.findOne({ user: user._id });
//       if (!userEmployee) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "No 'UserEmployee' doc related with this id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }
//       const enteredByEmployee = await Employee.findById(userEmployee.employee);
//       if (!enteredByEmployee) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "No 'Employee' doc related to this id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }

//       //salary checks
//       // const salary = await Salary.findOne({
//       //   employee: card.tracking[stageIndex].employee,
//       //   "date.month": card.tracking[stageIndex].dateOut.getMonth() + 1,
//       //   "date.year": card.tracking[stageIndex].dateOut.getFullYear(),
//       // });
//       // if (!salary) {
//       //   return res
//       //     .status(404)
//       //     .json(
//       //       errorFormat(
//       //         card.tracking[stageIndex].employee,
//       //         "no 'Salary' doc with this employee",
//       //         `card.tracking[${stageIndex}].employee`,
//       //         "others"
//       //       )
//       //     );
//       // }
//       // if (!salary) {
//       //   continue;
//       // }

//       // const dayIndex = salary.workDetails.findIndex(
//       //   (obj) => obj.day === card.tracking[stageIndex].dateOut.getDate()
//       // );
//       // if (dayIndex === -1) {
//       //   return res
//       //     .status(400)
//       //     .json(
//       //       errorFormat(
//       //         dayIndex,
//       //         `No 'workDetails' for day = ${card.tracking[
//       //           stageIndex
//       //         ].dateOut.getDate()}`,
//       //         "dayIndex",
//       //         "others"
//       //       )
//       //     );
//       // }

//       // const workIndex = salary.workDetails[dayIndex].work.findIndex(
//       //   (obj) => obj.stage.toString() === pieceErrors[i].stage
//       // );
//       // if (workIndex === -1) {
//       //   return res
//       //     .status(400)
//       //     .json(
//       //       errorFormat(
//       //         workIndex,
//       //         `No 'workDetails' for stage = ${pieceErrors[i].stage}`,
//       //         "workIndex",
//       //         "others"
//       //       )
//       //     );
//       // }

//       // const totalIndex = salary.totalWorkPerMonth.findIndex(
//       //   (obj) => obj.stage.toString() === pieceErrors[i].stage
//       // );
//       // if (totalIndex === -1) {
//       //   return res
//       //     .status(400)
//       //     .json(
//       //       errorFormat(
//       //         totalIndex,
//       //         `No 'totalWorkPerMonth' for stage = ${pieceErrors[i].stage}`,
//       //         "totalIndex",
//       //         "others"
//       //       )
//       //     );
//       // }
//     }

//     res.status(200).json({ msg: "Errors checked tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "card.addErrorCheck".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/card/:id/errors/add
 */
// const addError = async (req, res) => {
//   const id = req.params.id;
//   const { pieceNo, pieceErrors } = req.body;
//   const io = req.io;

//   try {
//     //card check
//     const card = await Card.findById(id);
//     if (!card) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No card with this id", "id", "params"));
//     }

//     //pieceNo check
//     if (pieceNo !== 0 || pieceNo < card.startRange || pieceNo > card.endRange) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             pieceNo,
//             `pieceNo must be in range ${card.startRange}:${card.endRange}`,
//             "pieceNo",
//             "body"
//           )
//         );
//     }

//     //check loop
//     for (let i = 0; i < pieceErrors.length; i++) {
//       //stage checks
//       if (!idCheck(pieceErrors[i].stage)) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "Invalid stage ID",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }
//       const stage = await Stage.findById(pieceErrors[i].stage);
//       if (!stage) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "No stage with this id",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }
//       const stageIndex = card.tracking.findIndex(
//         (obj) => obj.stage.toString() === pieceErrors[i].stage
//       );
//       if (stageIndex === -1) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "Not tracked stage",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }

//       //check if card.model have the givin stage
//       const modelStage = await Model.findOne({
//         _id: card.model,
//         "stages.id": pieceErrors[i].stage,
//       });
//       if (!modelStage) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].stage,
//               "This stage does not exist in card model",
//               `pieceErrors[${i}].stage`,
//               "body"
//             )
//           );
//       }

//       const cardErrorsIndex = card.cardErrors.findIndex(
//         (obj) => obj.pieceNo === Number(pieceNo)
//       );
//       if (cardErrorsIndex !== -1) {
//         const exist = card.cardErrors[cardErrorsIndex].pieceErrors.findIndex(
//           (obj) => obj.stage.toString() === pieceErrors[i].stage
//         );
//         if (exist !== -1) {
//           return res
//             .status(400)
//             .json(
//               errorFormat(
//                 pieceErrors[i].stage,
//                 `this error exist in piece no.${pieceNo}`,
//                 `pieceErrors[${i}].stage`,
//                 "body"
//               )
//             );
//         }
//       }

//       //enteredBy
//       if (!idCheck(pieceErrors[i].enteredBy)) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "Invalid enteredBy id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }
//       const user = await User.findById(pieceErrors[i].enteredBy);
//       if (!user) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "No user with this id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }
//       const userEmployee = await UserEmployee.findOne({ user: user._id });
//       if (!userEmployee) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "No 'UserEmployee' doc related with this id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }
//       const enteredByEmployee = await Employee.findById(userEmployee.employee);
//       if (!enteredByEmployee) {
//         return res
//           .status(404)
//           .json(
//             errorFormat(
//               pieceErrors[i].enteredBy,
//               "No 'Employee' doc related to this id",
//               `pieceErrors[${i}].enteredBy`,
//               "body"
//             )
//           );
//       }

//       //salary checks
//       // const salary = await Salary.findOne({
//       //   employee: card.tracking[stageIndex].employee,
//       //   "date.month": card.tracking[stageIndex].dateOut.getMonth() + 1,
//       //   "date.year": card.tracking[stageIndex].dateOut.getFullYear(),
//       // });
//       // if (!salary) {
//       //   return res
//       //     .status(404)
//       //     .json(
//       //       errorFormat(
//       //         card.tracking[stageIndex].employee,
//       //         "no 'Salary' doc with this employee",
//       //         `card.tracking[${stageIndex}].employee`,
//       //         "others"
//       //       )
//       //     );
//       // }
//       // if (!salary) {
//       //   continue;
//       // }

//       // const dayIndex = salary.workDetails.findIndex(
//       //   (obj) => obj.day === card.tracking[stageIndex].dateOut.getDate()
//       // );
//       // if (dayIndex === -1) {
//       //   return res
//       //     .status(400)
//       //     .json(
//       //       errorFormat(
//       //         dayIndex,
//       //         `No 'workDetails' for day = ${card.tracking[
//       //           stageIndex
//       //         ].dateOut.getDate()}`,
//       //         "dayIndex",
//       //         "others"
//       //       )
//       //     );
//       // }

//       // const workIndex = salary.workDetails[dayIndex].work.findIndex(
//       //   (obj) => obj.stage.toString() === pieceErrors[i].stage
//       // );
//       // if (workIndex === -1) {
//       //   return res
//       //     .status(400)
//       //     .json(
//       //       errorFormat(
//       //         workIndex,
//       //         `No 'workDetails' for stage = ${pieceErrors[i].stage}`,
//       //         "workIndex",
//       //         "others"
//       //       )
//       //     );
//       // }

//       // const totalIndex = salary.totalWorkPerMonth.findIndex(
//       //   (obj) => obj.stage.toString() === pieceErrors[i].stage
//       // );
//       // if (totalIndex === -1) {
//       //   return res
//       //     .status(400)
//       //     .json(
//       //       errorFormat(
//       //         totalIndex,
//       //         `No 'totalWorkPerMonth' for stage = ${pieceErrors[i].stage}`,
//       //         "totalIndex",
//       //         "others"
//       //       )
//       //     );
//       // }
//     }

//     const current = currentTime();

//     //update loop
//     for (let i = 0; i < pieceErrors.length; i++) {
//       const stage = await Stage.findById(pieceErrors[i].stage);

//       const stageIndex = card.tracking.findIndex(
//         (obj) => obj.stage.toString() === pieceErrors[i].stage
//       );

//       const user = await User.findById(pieceErrors[i].enteredBy);
//       const userEmployee = await UserEmployee.findOne({ user: user._id });
//       const enteredByEmployee = await Employee.findById(userEmployee.employee);

//       let salary = await Salary.findOne({
//         employee: card.tracking[stageIndex].employee,
//         "date.month": current.getMonth() + 1,
//         "date.year": current.getFullYear(),
//       });

//       if (!salary) {
//         salary = await Salary.create({
//           employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
//           date: {
//             day: current.getDate(),
//             month: current.getMonth() + 1,
//             year: current.getFullYear(),
//           },
//         });
//       }

//       //update workDetails
//       const dayIndex = salary.workDetails.findIndex(
//         (obj) => obj.day === current.getDate()
//       );
//       if (dayIndex === -1) {
//         salary.workDetails.push({
//           day: current.getDate(),
//           work: [{ stage: pieceErrors[i].stage, quantity: -1 }],
//         });
//       } else {
//         const workDetailsIndex = salary.workDetails[dayIndex].work.findIndex(
//           (obj) => obj.stage.toString() === pieceErrors[i].stage
//         );
//         if (workDetailsIndex === -1) {
//           salary.workDetails[dayIndex].work.push({
//             stage: pieceErrors[i].stage,
//             quantity: -1,
//           });
//         } else {
//           salary.workDetails[dayIndex].work[workDetailsIndex].quantity -= 1;
//         }
//       }

//       //update totalWorkPerMonth
//       const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
//         (obj) => obj.stage.toString() === pieceErrors[i].stage
//       );
//       if (totalWorkIndex === -1) {
//         salary.totalWorkPerMonth.push({
//           stage: pieceErrors[i].stage,
//           quantity: -1,
//         });
//       } else {
//         salary.totalWorkPerMonth[totalWorkIndex].quantity -= 1;
//       }

//       if (salary.date.day === current.getDate()) {
//         salary.todayPieces -= 1;
//         salary.todayCost -= stage.price;
//       } else {
//         salary.date.day = current.getDate();
//         salary.todayPieces = -1;
//         salary.todayCost = -stage.price;
//       }

//       salary.totalPieces -= 1;
//       salary.totalCost -= stage.price;

//       await salary.save();

//       //update currentErrors
//       const currentErrorsIndex = card.currentErrors.findIndex((obj) => {
//         return obj.toString() === stage._id.toString();
//       });
//       if (currentErrorsIndex === -1) {
//         card.currentErrors.push(stage._id);
//       }

//       //update cardErrors
//       const cardErrorsIndex = card.cardErrors.findIndex(
//         (obj) => obj.pieceNo === Number(pieceNo)
//       );
//       if (cardErrorsIndex === -1) {
//         card.cardErrors.push({
//           pieceNo: pieceNo,
//           pieceErrors: [
//             {
//               stage: pieceErrors[i].stage,
//               description: pieceErrors[i].description,
//               dateIn: current,
//               addedBy: enteredByEmployee._id,
//             },
//           ],
//         });
//       } else {
//         card.cardErrors[cardErrorsIndex].pieceErrors.push({
//           stage: pieceErrors[i].stage,
//           description: pieceErrors[i].description,
//           dateIn: current,
//           addedBy: enteredByEmployee,
//         });
//       }
//     }
//     //push to history
//     card.history.push({
//       state: `Errors has been added in piece no.${pieceNo}`,
//       date: current,
//     });

//     await card.save();

//     io.emit("errors", { msg: "errors", card, pieceNo });

//     res.status(200).json({ msg: "Errors added tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "card.addError".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };
const addError = async (req, res) => {
  const id = req.params.id;
  const { employee, cardErrors } = req.body;
  const io = req.io;

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //employee checks
    if (!idCheck(employee)) {
      return res
        .status(400)
        .json(errorFormat(employee, "Invalid employee id", "employee", "body"));
    }
    const addedBy = await Employee.findById(employee);
    if (!addedBy) {
      return res
        .status(404)
        .json(
          errorFormat(employee, "No employee with this id", "employee", "body")
        );
    }

    //cardErrors checks
    for (let i = 0; i < cardErrors.length; i++) {
      //stage checks
      const stage = await Stage.findById(cardErrors[i].stage);
      if (!stage) {
        return res
          .status(404)
          .json(
            errorFormat(
              cardErrors[i].stage,
              "No stage with this id",
              `cardErrors[${i}].stage`,
              "body"
            )
          );
      }
      const trackingIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === cardErrors[i].stage
      );
      if (trackingIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              cardErrors[i].stage,
              `Stage '${stage.name}' is not tracked`,
              `cardErrors[${i}].stage`,
              "body"
            )
          );
      }

      //pieces checks
      for (let j = 0; j < cardErrors[i].pieces.length; j++) {
        if (
          cardErrors[i].pieces[j] !== 0 &&
          (cardErrors[i].pieces[j] < card.startRange ||
            cardErrors[i].pieces[j] > card.endRange)
        ) {
          return res
            .status(400)
            .json(
              errorFormat(
                cardErrors[i].pieces[j],
                `Piece no. must be in range ${card.startRange}:${card.endRange}`,
                `cardErrors[${i}].pieces[${j}]`,
                "body"
              )
            );
        }

        const cardErrorsIndex = card.cardErrors.findIndex(
          (obj) => obj.pieceNo === cardErrors[i].pieces[j]
        );

        if (cardErrorsIndex !== -1) {
          const pieceErrorsIndex = card.cardErrors[
            cardErrorsIndex
          ].pieceErrors.findIndex(
            (obj) => obj.stage.toString() === cardErrors[i].stage
          );

          if (pieceErrorsIndex !== -1) {
            return res
              .status(400)
              .json(
                errorFormat(
                  cardErrors[i].stage,
                  `Stage '${stage.name}' is already exist in piece: ${cardErrors[i].pieces[j]}`,
                  `cardErrors[${i}].stage`,
                  "body"
                )
              );
          }
        }
      }
    }

    const current = currentTime();

    for (let i = 0; i < cardErrors.length; i++) {
      const stage = await Stage.findById(cardErrors[i].stage);
      const trackingIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === cardErrors[i].stage
      );

      //update salary
      let salary = await Salary.findOne({
        employee: card.tracking[trackingIndex].employee,
        "date.month": current.getMonth() + 1,
        "date.year": current.getFullYear(),
      });
      if (!salary) {
        salary = await Salary.create({
          employee: card.tracking[trackingIndex].employee,
          "date.day": current.getDate(),
          "date.month": current.getMonth() + 1,
          "date.year": current.getFullYear(),
        });
      }

      //update salary.workDetails
      const dayIndex = salary.workDetails.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (dayIndex === -1) {
        salary.workDetails.push({
          day: current.getDate(),
          work: [
            {
              stage: cardErrors[i].stage,
              quantity: cardErrors[i].pieces.length * -1,
              noOfErrors: cardErrors[i].pieces.length,
            },
          ],
        });
      } else {
        const stageIndex = salary.workDetails[dayIndex].work.findIndex(
          (obj) => obj.stage.toString() === cardErrors[i].stage
        );
        if (stageIndex === -1) {
          salary.workDetails[dayIndex].work.push({
            stage: cardErrors[i].stage,
            quantity: cardErrors[i].pieces.length * -1,
            noOfErrors: cardErrors[i].pieces.length,
          });
        } else {
          salary.workDetails[dayIndex].work[stageIndex].quantity -=
            cardErrors[i].pieces.length;
          salary.workDetails[dayIndex].work[stageIndex].noOfErrors +=
            cardErrors[i].pieces.length;
        }
      }

      //update salary.totalWorkPerMonth
      const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
        (obj) => obj.stage.toString() === cardErrors[i].stage
      );
      if (totalWorkIndex === -1) {
        salary.totalWorkPerMonth.push({
          stage: cardErrors[i].stage,
          quantity: cardErrors[i].pieces.length * -1,
          noOfErrors: cardErrors[i].pieces.length,
        });
      } else {
        salary.totalWorkPerMonth[totalWorkIndex].quantity -=
          cardErrors[i].pieces.length;
        salary.totalWorkPerMonth[totalWorkIndex].noOfErrors +=
          cardErrors[i].pieces.length;
      }

      if (salary.date.day === current.getDate()) {
        salary.todayPieces -= cardErrors[i].pieces.length;
        salary.todayCost -= stage.price * cardErrors[i].pieces.length;
      } else {
        salary.date.day = current.getDate();
        salary.todayPieces = -1 * cardErrors[i].pieces.length;
        salary.todayCost = stage.price * cardErrors[i].pieces.length * -1;
      }

      salary.totalPieces -= cardErrors[i].pieces.length;
      salary.totalCost -= stage.price * cardErrors[i].pieces.length;

      await salary.save();

      //update card.currentErrors
      const currentErrorsIndex = card.currentErrors.findIndex(
        (obj) => obj.toString() === cardErrors[i].stage
      );
      if (currentErrorsIndex === -1) {
        card.currentErrors.push(cardErrors[i].stage);
      }

      //update card.cardErrors
      for (let j = 0; j < cardErrors[i].pieces.length; j++) {
        // cardErrors[i].pieces[j]
        const pieceNoIndex = card.cardErrors.findIndex(
          (obj) => obj.pieceNo === cardErrors[i].pieces[j]
        );
        if (pieceNoIndex === -1) {
          card.cardErrors.push({
            pieceNo: cardErrors[i].pieces[j],
            pieceErrors: [
              {
                stage: cardErrors[i].stage,
                description: cardErrors[i].description,
                dateIn: current,
                addedBy: employee,
              },
            ],
          });
        } else {
          const pieceErrorsIndex = card.cardErrors[
            pieceNoIndex
          ].pieceErrors.findIndex(
            (obj) => obj.stage.toString() === cardErrors[i].stage
          );

          if (pieceErrorsIndex === -1) {
            card.cardErrors[pieceNoIndex].pieceErrors.push({
              stage: cardErrors[i].stage,
              description: cardErrors[i].description,
              dateIn: current,
              addedBy: employee,
            });
          }
        }
      }
    }

    card.history.push({
      state: `Errors added to the card`,
      type: "addError",
      date: current,
    });
    await card.save();

    //update work doc for employee
    let employeeWork = await Work.findOne({
      employee: employee,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!employeeWork) {
      employeeWork = await Work.create({
        employee: employee,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
        "date.day": current.getDate(),
      });
    }
    const employeeWorkIndex = employeeWork.workHistory.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (employeeWorkIndex === -1) {
      employeeWork.workHistory.push({
        day: current.getDate(),
        cards: [{ card: card._id, date: current, type: 2 }],
      });
    } else {
      employeeWork.workHistory[employeeWorkIndex].cards.push({
        card: card._id,
        date: current,
        type: 2,
      });
    }
    if (employeeWork.date.day !== current.getDate()) {
      employeeWork.date.day = current.getDate();
      employeeWork.todayCards = 0;
    }
    employeeWork.todayCards++;
    employeeWork.totalCards++;
    await employeeWork.save();

    let globalErrorLength = 0;
    for (let i = 0; i < card.globalErrors.length; i++) {
      if (!card.globalErrors[i].verifiedBy) {
        globalErrorLength++;
      }
    }

    io.emit("errors", {
      cardID: card._id,
      cardCode: card.code,
      currentErrorsLength: card.currentErrors.length,
      pieceErrors: card.cardErrors.length,
      date: current,
      globalErrorLength: globalErrorLength,
    });

    res.status(200).json({ msg: "Errors added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addError".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/repair
 */
// const repair = async (req, res) => {
//   const id = req.params.id;
//   const { stage: stageID, doneBy: doneByID, enteredBy: enteredByID } = req.body;
//   const io = req.io;

//   try {
//     //card check
//     const card = await Card.findById(id);
//     if (!card) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No card with this id", "id", "params"));
//     }
//     if (card.done) {
//       return res
//         .status(400)
//         .json(errorFormat(id, "This card is finished", "id", "params"));
//     }

//     //stage checks
//     if (!idCheck(stageID)) {
//       return res
//         .status(400)
//         .json(errorFormat(stageID, "Invalid stage ID", "stage", "body"));
//     }
//     const stage = await Stage.findById(stageID);
//     if (!stage) {
//       return res
//         .status(404)
//         .json(errorFormat(stageID, "No stage with this id", "stage", "body"));
//     }
//     const modelStage = await Model.findOne({
//       _id: card.model,
//       "stages.id": stageID,
//     });
//     if (!modelStage) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             stageID,
//             "This stage does not exist in card model",
//             "stage",
//             "body"
//           )
//         );
//     }
//     const trackingIndex = card.tracking.findIndex(
//       (obj) => obj.stage.toString() === stageID
//     );
//     if (trackingIndex === -1) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(stageID, "can't repair untracked stage", "stage", "body")
//         );
//     }
//     const currentErrorsIndex = card.currentErrors.findIndex(
//       (obj) => obj.toString() === stageID
//     );
//     if (currentErrorsIndex === -1) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             stageID,
//             "Can not repair stage has no errors",
//             "stage",
//             "body"
//           )
//         );
//     }

//     //doneBy checks
//     if (!idCheck(doneByID)) {
//       return res
//         .status(400)
//         .json(errorFormat(doneByID, "Invalid employee ID", "doneBy", "body"));
//     }
//     const doneByEmployee = await Employee.findById(doneByID);
//     if (!doneByEmployee) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(doneByID, "No employee with this ID", "doneBy", "body")
//         );
//     }

//     //enteredBy checks
//     if (!idCheck(enteredByID)) {
//       return res
//         .status(400)
//         .json(errorFormat(enteredByID, "Invalid user ID", "enteredBy", "body"));
//     }
//     const user = await User.findById(enteredByID);
//     if (!user) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(enteredByID, "No user with this ID", "enteredBy", "body")
//         );
//     }
//     const userEmployee = await UserEmployee.findOne({ user: enteredByID });
//     if (!userEmployee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             enteredByID,
//             "No 'UserEmployee' doc related to this id",
//             "enteredBy",
//             "body"
//           )
//         );
//     }
//     const enteredByEmployee = await Employee.findById(userEmployee.employee);
//     if (!enteredByEmployee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             enteredByID,
//             "No 'User' doc related to this ID",
//             "enteredByID",
//             "body"
//           )
//         );
//     }

//     const current = currentTime();

//     for (let i = 0; i < card.cardErrors.length; i++) {
//       for (let j = 0; j < card.cardErrors[i].pieceErrors.length; j++) {
//         if (card.cardErrors[i].pieceErrors[j].stage.toString() === stageID) {
//           card.cardErrors[i].pieceErrors[j].doneBy = doneByID;
//           card.cardErrors[i].pieceErrors[j].enteredBy = enteredByEmployee._id;
//           card.cardErrors[i].pieceErrors[j].doneIn = current;
//         }
//       }
//     }

//     card.history.push({
//       state: `Errors in stage ${stage.name} has been done by ${enteredByEmployee.name}`,
//       date: current,
//     });

//     await card.save();

//     io.emit("repairs", { msg: "repairs", card, stage });

//     res.status(200).json({ msg: "Error repaired tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "card.repair".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: GET
 * path: /api/card/:id/errors/repair
 */
const stagesNeedToRepair = async (req, res) => {
  const id = req.params.id;

  try {
    const card = await Card.findById(id)
      .populate("tracking.stage", "name code")
      .populate("tracking.employee", "name code")
      .select("tracking currentErrors");
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    let data = [];

    for (let i = 0; i < card.currentErrors.length; i++) {
      const index = card.tracking.findIndex(
        (obj) => obj.stage._id.toString() === card.currentErrors[i].toString()
      );

      if (index === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              card.currentErrors[i].toString(),
              "Not tracked stage",
              `card.currentErrors[${i}]`,
              "others"
            )
          );
      }

      data.push({
        stage: card.tracking[index].stage,
        employee: card.tracking[index].employee,
      });
    }

    res.status(200).json({ data });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.stagesNeedToRepair".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/repair/all
 */
const repairAll = async (req, res) => {
  const id = req.params.id;
  const { repairs, enteredBy: enteredByID } = req.body;
  const io = req.io;

  try {
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //enteredBy checks
    if (!idCheck(enteredByID)) {
      return res
        .status(400)
        .json(
          errorFormat(enteredByID, "Invalid employee ID", "enteredBy", "body")
        );
    }
    const enteredBy = await Employee.findById(enteredByID);
    if (!enteredBy) {
      return res
        .status(404)
        .json(
          errorFormat(
            enteredByID,
            "No employee with this ID",
            "enteredBy",
            "body"
          )
        );
    }

    //duplicates stages checks
    const seen = new Set();
    repairs.some((repair) => {
      if (seen.size === seen.add(repair.stage).size) {
        return res
          .status(400)
          .json(
            errorFormat(
              "repairs[]",
              "There are duplicates values",
              "repairs[]",
              "body"
            )
          );
      }
    });
    seen.clear();

    //repairs checks
    for (let i = 0; i < repairs.length; i++) {
      //repairs[i].stage checks
      if (!idCheck(repairs[i].stage)) {
        return res
          .status(400)
          .json(
            errorFormat(
              repairs[i].stage,
              "Invalid stage ID",
              `repairs[${i}].stage`,
              "body"
            )
          );
      }
      const stage = await Stage.findById(repairs[i].stage);
      if (!stage) {
        return res
          .status(400)
          .json(
            errorFormat(
              repairs[i].stage,
              "No stage with this ID",
              `repairs[${i}].stage`,
              "body"
            )
          );
      }
      const trackingIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === repairs[i].stage
      );
      if (trackingIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              repairs[i].stage,
              "Not tracked stage",
              `repairs[${i}].stage`,
              "body"
            )
          );
      }
      const currentErrorsIndex = card.currentErrors.findIndex(
        (obj) => obj.toString() === repairs[i].stage
      );
      if (currentErrorsIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              repairs[i].stage,
              "No errors with this stage",
              `repairs[${i}].stage`,
              "body"
            )
          );
      }

      //repairs[i].employee checks
      if (!idCheck(repairs[i].employee)) {
        return res
          .status(400)
          .json(
            errorFormat(
              repairs[i].employee,
              "Invalid employee ID",
              `repairs[${i}].employee`,
              "body"
            )
          );
      }
      const employee = await Employee.findById(repairs[i].employee);
      if (!employee) {
        return res
          .status(404)
          .json(
            errorFormat(
              repairs[i].employee,
              "No employee with this ID",
              `repairs[${i}].employee`,
              "body"
            )
          );
      }

      //check if the employee is assigned to stage
      const stageEmployee = await StageEmployee.findOne({
        order: card.order,
        model: card.model,
        stage: stage._id,
      });
      if (!stageEmployee) {
        return res
          .status(404)
          .json(
            errorFormat(
              employee._id,
              "This employee is not assigned to the stage",
              "employee",
              "other"
            )
          );
      }
      const stageEmployeeIndex = stageEmployee.employees.findIndex(
        (obj) => obj.employee.toString() === employee._id.toString() && !obj.out
      );
      if (
        stageEmployeeIndex === -1 ||
        stageEmployee.employees[stageEmployeeIndex].out
      ) {
        return res
          .status(404)
          .json(
            errorFormat(
              employee._id,
              "This employee is not assigned to the stage",
              "employee",
              "other"
            )
          );
      }
    }

    const current = currentTime();

    for (let i = 0; i < repairs.length; i++) {
      //update card.cardErrors
      for (let j = 0; j < card.cardErrors.length; j++) {
        for (let k = 0; k < card.cardErrors[j].pieceErrors.length; k++) {
          if (
            card.cardErrors[j].pieceErrors[k].stage.toString() ===
            repairs[i].stage
          ) {
            card.cardErrors[j].pieceErrors[k].enteredBy = enteredByID;
            card.cardErrors[j].pieceErrors[k].doneBy = repairs[i].employee;
            card.cardErrors[j].pieceErrors[k].doneIn = current;

            //update employee work doc if he is different from the tracked one
            // const trackingIndex = card.tracking.findIndex(
            //   (obj) => obj.stage.toString() === repairs[i].stage
            // );
            // if (
            //   card.tracking[trackingIndex].employee.toString() !==
            //   repairs[i].employee
            // ) {

            // }
          }
        }
      }
      let employeeWork = await Work.findOne({
        employee: repairs[i].employee,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
      });
      if (!employeeWork) {
        employeeWork = await Work.create({
          employee: repairs[i].employee,
          "date.year": current.getFullYear(),
          "date.month": current.getMonth() + 1,
          "date.day": current.getDate(),
        });
      }
      const employeeWorkIndex = employeeWork.workHistory.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (employeeWorkIndex === -1) {
        employeeWork.workHistory.push({
          day: current.getDate(),
          cards: [
            {
              card: id,
              date: current,
              stage: repairs[i].stage,
              type: 3,
            },
          ],
        });
      } else {
        employeeWork.workHistory[employeeWorkIndex].cards.push({
          card: id,
          date: current,
          stage: repairs[i].stage,
          type: 3,
        });
      }
      if (employeeWork.date.day !== current.getDate()) {
        employeeWork.date.day = current.getDate();
        employeeWork.todayCards = 0;
      }
      employeeWork.todayCards++;
      employeeWork.totalCards++;
      await employeeWork.save();
    }

    //update enteredBy work doc if he is different from the tracked one
    // const workBefore = card.tracking.findIndex(
    //   (obj) => obj.enteredBy.toString() === enteredByID
    // );
    // if (workBefore === -1) {
    let enteredByWork = await Work.findOne({
      employee: enteredByID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!enteredByWork) {
      enteredByWork = await Work.create({
        employee: enteredByID,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
        "date.day": current.getDate(),
      });
    }
    const enteredByWorkIndex = enteredByWork.workHistory.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (enteredByWorkIndex === -1) {
      enteredByWork.workHistory.push({
        day: current.getDate(),
        cards: [{ card: id, date: current, type: 3 }],
      });
    } else {
      enteredByWork.workHistory[enteredByWorkIndex].cards.push({
        card: id,
        date: current,
        type: 3,
      });
    }
    if (enteredByWork.date.day !== current.getDate()) {
      enteredByWork.date.day = current.getDate();
      enteredByWork.todayCards = 0;
    }
    enteredByWork.todayCards++;
    enteredByWork.totalCards++;
    await enteredByWork.save();
    // }

    card.history.push({
      state: `Errors has been repaired`,
      type: "repair",
      date: current,
    });

    await card.save();

    io.emit("repairs", { msg: "repairs", card });

    res.status(200).json({ msg: "Error repaired tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.repairAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/confirm
 */
// const confirmError = async (req, res) => {
//   const id = req.params.id;
//   const { stage: stageID, verifiedBy: verifiedByID } = req.body;
//   const io = req.io;
//   try {
//     //card check
//     const card = await Card.findById(id);
//     if (!card) {
//       return res
//         .status(404)
//         .json(errorFormat(id, "No card with this id", "id", "params"));
//     }

//     //stage check
//     if (!idCheck(stageID)) {
//       return res
//         .status(400)
//         .json(errorFormat(stageID, "Invalid stage id", "stage", "body"));
//     }
//     const stage = await Stage.findById(stageID);
//     if (!stage) {
//       return res
//         .status(404)
//         .json(errorFormat(stageID, "No stage with this id", "stage", "body"));
//     }
//     const modelStage = await Model.findOne({
//       _id: card.model,
//       "stages.id": stageID,
//     });
//     if (!modelStage) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             stageID,
//             "This stage does not exist in card model",
//             "stage",
//             "body"
//           )
//         );
//     }
//     const trackingIndex = card.tracking.findIndex(
//       (obj) => obj.stage.toString() === stageID
//     );
//     if (trackingIndex === -1) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(stageID, "can't repair untracked stage", "stage", "body")
//         );
//     }
//     const currentErrorsIndex = card.currentErrors.findIndex(
//       (obj) => obj.toString() === stageID
//     );
//     if (currentErrorsIndex === -1) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             stageID,
//             "Can not repair stage has no errors",
//             "stage",
//             "body"
//           )
//         );
//     }

//     //verifiedBy checks
//     if (!idCheck(verifiedByID)) {
//       return res
//         .status(400)
//         .json(
//           errorFormat(
//             verifiedByID,
//             "Invalid verifiedBy id",
//             "verifiedBy",
//             "body"
//           )
//         );
//     }
//     const user = await User.findById(verifiedByID);
//     if (!user) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             verifiedByID,
//             "No user with this id",
//             "verifiedBy",
//             "body"
//           )
//         );
//     }
//     const userEmployee = await UserEmployee.findOne({ user: verifiedByID });
//     if (!userEmployee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             verifiedByID,
//             "This user is not an employee",
//             "verifiedBy",
//             "body"
//           )
//         );
//     }
//     const verifiedByEmployee = await Employee.findById(userEmployee.employee);
//     if (!verifiedByEmployee) {
//       return res
//         .status(404)
//         .json(
//           errorFormat(
//             verifiedByID,
//             "No employee doc related to this user",
//             "verifiedBy",
//             "body"
//           )
//         );
//     }

//     const current = currentTime();

//     //check loop
//     for (let i = 0; i < card.cardErrors.length; i++) {
//       const stageIndex = card.cardErrors[i].pieceErrors.findIndex(
//         (obj) => obj.stage.toString() === stageID
//       );
//       if (stageIndex === -1) {
//         continue;
//       }

//       //if not repaired
//       if (!card.cardErrors[i].pieceErrors[stageIndex].doneBy) {
//         return res
//           .status(400)
//           .json(
//             errorFormat(
//               stageID,
//               "Can't confirm unrepaired stage",
//               "stage",
//               "body"
//             )
//           );
//       }

//       //salary checks
//       // const salary = await Salary.findOne({
//       //   employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
//       //   "date.month": current.getMonth() + 1,
//       //   "date.year": current.getFullYear(),
//       // });
//       // if (!salary) {
//       //   return res
//       //     .status(404)
//       //     .json(
//       //       card.cardErrors[i].pieceErrors[stageIndex].doneBy,
//       //       "untracked salary for this employee",
//       //       `card.cardErrors[$[i]].pieceErrors[${stageIndex}].doneBy`,
//       //       "others"
//       //     );
//       // }
//       // if (salary) {
//       //   const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
//       //     (obj) => obj.stage.toString() === stageID
//       //   );
//       //   if (totalWorkIndex === -1) {
//       //     return res
//       //       .status(404)
//       //       .json(
//       //         card.cardErrors[i].pieceErrors[stageIndex].doneBy,
//       //         "untracked salary for this employee",
//       //         `card.cardErrors[$[i]].pieceErrors[${stageIndex}].doneBy`,
//       //         "others"
//       //       );
//       //   }
//       // }
//     }

//     for (let i = 0; i < card.cardErrors.length; i++) {
//       const stageIndex = card.cardErrors[i].pieceErrors.findIndex(
//         (obj) => obj.stage.toString() === stageID
//       );

//       //skip if not exist or has been verified
//       if (
//         stageIndex === -1 ||
//         card.cardErrors[i].pieceErrors[stageIndex].verifiedBy
//       ) {
//         continue;
//       }

//       //update verifiedBy & dateOut
//       card.cardErrors[i].pieceErrors[stageIndex].verifiedBy =
//         verifiedByEmployee._id;
//       card.cardErrors[i].pieceErrors[stageIndex].dateOut = current;

//       let salary = await Salary.findOne({
//         employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
//         "date.month": current.getMonth() + 1,
//         "date.year": current.getFullYear(),
//       });

//       if (!salary) {
//         salary = await Salary.create({
//           employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
//           date: {
//             day: current.getDate(),
//             month: current.getMonth() + 1,
//             year: current.getFullYear(),
//           },
//         });
//       }

//       //update workDetails
//       const dayIndex = salary.workDetails.findIndex(
//         (obj) => obj.day === current.getDate()
//       );
//       if (dayIndex === -1) {
//         salary.workDetails.push({
//           day: current.getDate(),
//           work: [{ stage: stageID, quantity: 1 }],
//         });
//       } else {
//         const workDetailsIndex = salary.workDetails[dayIndex].work.findIndex(
//           (obj) => obj.stage.toString() === stageID
//         );
//         if (workDetailsIndex === -1) {
//           salary.workDetails[dayIndex].work.push({
//             stage: stageID,
//             quantity: 1,
//           });
//         } else {
//           salary.workDetails[dayIndex].work[workDetailsIndex].quantity += 1;
//         }
//       }

//       //check priceHistory
//       const priceIndex = salary.priceHistory.findIndex(
//         (obj) => obj.stage.toString() === stageID
//       );
//       if (priceIndex === -1) {
//         salary.priceHistory.push({ stage: stageID, price: stage.price });
//       }

//       //update totalWorkPerMonth
//       const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
//         (obj) => obj.stage.toString() === stageID
//       );
//       if (totalWorkIndex === -1) {
//         salary.totalWorkPerMonth.push({ stage: stageID, quantity: 1 });
//       } else {
//         salary.totalWorkPerMonth[totalWorkIndex].quantity += 1;
//       }

//       if (salary.date.day === current.getDate()) {
//         salary.todayPieces += 1;
//         salary.todayCost += stage.price;
//       } else {
//         salary.date.day = current.getDate();
//         salary.todayPieces = 1;
//         salary.todayCost = stage.price;
//       }

//       salary.totalPieces += 1;
//       salary.totalCost += stage.price;

//       await salary.save();
//     }

//     card.currentErrors.pull(card.currentErrors[currentErrorsIndex]._id);

//     card.history.push({
//       state: `Errors in stage ${stage.name} has been verified by ${verifiedByEmployee.name}`,
//       date: current,
//     });

//     await card.save();

//     io.emit("errorConfirm", { msg: "errorConfirm", card, stage });

//     res.status(200).json({ msg: "Error confirmed for this stage tmam" });
//   } catch (error) {
//     console.log("Error is in: ".bgRed, "card.confirmError".bgYellow);
//     if (process.env.PRODUCTION === "false") console.log(error);
//   }
// };

/*
 * method: PATCH
 * path: /api/card/:id/errors/confirm/all
 */
const confirmAll = async (req, res) => {
  const id = req.params.id;
  const { stages, verifiedBy: verifiedByID } = req.body;
  const io = req.io;
  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //verifiedBy checks
    if (!idCheck(verifiedByID)) {
      return res
        .status(400)
        .json(
          errorFormat(
            verifiedByID,
            "Invalid verifiedBy id",
            "verifiedBy",
            "body"
          )
        );
    }
    const verifiedBy = await Employee.findById(verifiedByID);
    if (!verifiedBy) {
      return res
        .status(404)
        .json(
          errorFormat(
            verifiedByID,
            "No employee with this ID",
            "verifiedByID",
            "body"
          )
        );
    }

    //stages checks
    for (let i = 0; i < stages.length; i++) {
      if (!idCheck(stages[i])) {
        return res
          .status(400)
          .json(
            errorFormat(stages[i], "Invalid stage ID", `stages[${i}]`, "body")
          );
      }
      const stage = await Stage.findById(stages[i]);
      if (!stage) {
        return res
          .status(404)
          .json(
            errorFormat(
              stages[i],
              "No stage with this ID",
              `stages[${i}]`,
              "body"
            )
          );
      }
      const trackingIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === stages[i]
      );
      if (trackingIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              stages[i],
              `Stage ${stage.name} is not tracked`,
              `stages[${i}]`,
              "body"
            )
          );
      }
      const currentErrorsIndex = card.currentErrors.findIndex(
        (obj) => obj.toString() === stages[i]
      );
      if (currentErrorsIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              stages[i],
              "No errors with this stage",
              `stages[${i}]`,
              "body"
            )
          );
      }
    }

    const current = currentTime();

    let occurrence = new Array(stages.length).fill(0);
    // let addedByIsVerifiedBy = true;
    let doneBys = new Array(stages.length);

    //update card.cardErrors && card.currentErrors
    for (let i = 0; i < stages.length; i++) {
      for (let j = 0; j < card.cardErrors.length; j++) {
        const stageIndex = card.cardErrors[j].pieceErrors.findIndex(
          (obj) => obj.stage.toString() === stages[i]
        );

        if (
          stageIndex === -1 ||
          card.cardErrors[j].pieceErrors[stageIndex].verifiedBy
        ) {
          continue;
        }
        //if not repaired
        if (!card.cardErrors[j].pieceErrors[stageIndex].doneBy) {
          return res
            .status(400)
            .json(
              errorFormat(stages[i], "Unrepaird stage", `stages[${i}]`, "body")
            );
        }

        doneBys[i] = card.cardErrors[j].pieceErrors[stageIndex].doneBy;

        card.cardErrors[j].pieceErrors[stageIndex].verifiedBy = verifiedByID;
        card.cardErrors[j].pieceErrors[stageIndex].dateOut = current;

        // if (
        //   card.cardErrors[j].pieceErrors[stageIndex].addedBy.toString() ===
        //   verifiedByID
        // ) {
        //   addedByIsVerifiedBy = false;
        // }

        occurrence[i]++;
      }

      card.currentErrors.pull(stages[i]);
    }

    console.log(doneBys);
    console.log(stages);
    console.log(occurrence);

    //update salary docs
    for (let i = 0; i < stages.length; i++) {
      const stage = await Stage.findById(stages[i]);

      let salary = await Salary.findOne({
        employee: doneBys[i],
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
      });
      if (!salary) {
        salary = await Salary.create({
          employee: doneBys[i],
          date: {
            year: current.getFullYear(),
            month: current.getMonth() + 1,
            day: current.getDate(),
          },
        });
      }

      //update salary.totalWorkPerMonth
      const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
        (obj) => obj.stage.toString() === stages[i]
      );
      if (totalWorkIndex === -1) {
        salary.totalWorkPerMonth.push({
          stage: stages[i],
          quantity: occurrence[i],
          NoOfErrors: 0,
        });
      } else {
        salary.totalWorkPerMonth[totalWorkIndex].quantity += occurrence[i];
      }

      //update salary.workDetails
      const dayIndex = salary.workDetails.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (dayIndex === -1) {
        salary.workDetails.push({
          day: current.getDate(),
          work: [
            {
              stage: stages[i],
              quantity: occurrence[i],
            },
          ],
        });
      } else {
        const stageIndex = salary.workDetails[dayIndex].work.findIndex(
          (obj) => obj.stage.toString() === stages[i]
        );

        if (stageIndex === -1) {
          salary.workDetails[dayIndex].work.push({
            stage: stages[i],
            quantity: occurrence[i],
          });
        } else {
          salary.workDetails[dayIndex].work[stageIndex].quantity +=
            occurrence[i];
        }
      }

      //check salary.priceHistory
      const priceIndex = salary.priceHistory.findIndex(
        (obj) => obj.stage.toString() === stages[i]
      );
      if (priceIndex === -1) {
        salary.priceHistory.push({ stage: stages[i], price: stage.price });
      }

      //update no. of pieces and costs
      if (current.getDate() === salary.date.day) {
        salary.todayPieces += occurrence[i];
        salary.todayCost += occurrence[i] * stage.price;
      } else {
        salary.date.day = current.getDate();
        salary.todayPieces = occurrence[i];
        salary.todayCost = occurrence[i] * stage.price;
      }
      salary.totalPieces += occurrence[i];
      salary.totalCost += occurrence[i] * stage.price;

      await salary.save();
    }

    //update verifiedBy work doc
    // if (!addedByIsVerifiedBy) {
    let employeeWork = await Work.findOne({
      employee: verifiedByID,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!employeeWork) {
      employeeWork = await Work.create({
        employee: verifiedByID,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
        "date.day": current.getDate(),
      });
    }
    const employeeWorkIndex = employeeWork.workHistory.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (employeeWorkIndex === -1) {
      employeeWork.workHistory.push({
        day: current.getDate(),
        cards: [{ card: id, date: current, type: 4 }],
      });
    } else {
      employeeWork.workHistory[employeeWorkIndex].cards.push({
        card: card._id,
        date: current,
        type: 4,
      });
    }
    if (employeeWork.date.day !== current.getDate()) {
      employeeWork.date.day = current.getDate();
      employeeWork.todayCards = 0;
    }
    employeeWork.todayCards++;
    employeeWork.totalCards++;
    await employeeWork.save();
    // }

    card.history.push({
      state: `Errors has been verified`,
      type: "verify",
      date: current,
    });

    await card.save();

    let globalErrorLength = 0;
    for (let i = 0; i < card.globalErrors.length; i++) {
      if (!card.globalErrors[i].verifiedBy) {
        globalErrorLength++;
      }
    }

    io.emit("errorConfirm", {
      cardID: card._id,
      cardCode: card.code,
      currentErrorsLength: card.currentErrors.length,
      date: current,
      globalErrorLength: globalErrorLength,
    });

    res.status(200).json({ msg: "Error confirmed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.confirmError".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/order/:oid/model/:mid
 */
const getAllForModelOrder = async (req, res) => {
  const mid = req.params.mid;
  const oid = req.params.oid;

  try {
    //model checks
    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(mid, "Invalid model id", "mid", "params"));
    }
    const model = await Model.findById(mid);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "No model with this id", "mid", "params"));
    }

    //order checks
    if (!idCheck(oid)) {
      return res
        .status(400)
        .json(errorFormat(oid, "Invalid order id", "oid", "params"));
    }
    const order = await Order.findById(oid);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(oid, "No order with this id", "oid", "params"));
    }

    const docs = await Card.find({ order: oid, model: mid }).populate(
      "currentErrors",
      "name"
    );

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getAllForModelOrder".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/order/:oid/model/:mid/errors
 */
const getAllForModelOrderWithErrors = async (req, res) => {
  const mid = req.params.mid;
  const oid = req.params.oid;

  try {
    //model checks
    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(mid, "Invalid model id", "mid", "params"));
    }
    const model = await Model.findById(mid);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "No model with this id", "mid", "params"));
    }

    //order checks
    if (!idCheck(oid)) {
      return res
        .status(400)
        .json(errorFormat(oid, "Invalid order id", "oid", "params"));
    }
    const order = await Order.findById(oid);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(oid, "No order with this id", "oid", "params"));
    }

    const docs = await Card.find({
      order: oid,
      model: mid,
      currentErrors: { $exists: true, $ne: [] },
    }).populate("currentErrors", "name code");

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getAllForModelOrder".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/:id/errors/unconfirmed
 */
const unconfirmedErrors = async (req, res) => {
  const id = req.params.id;
  try {
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    let errors = [];
    for (let i = 0; i < card.cardErrors.length; i++) {
      for (let j = 0; j < card.cardErrors[i].length; j++) {
        const index = errors.findIndex(
          (obj) => obj._id.toString() === card.cardErrors[i][j].stage.toString()
        );
        if (index !== -1 || card.cardErrors[i][j].verifiedBy) {
          continue;
        }
        const stage = await Stage.findById(card.cardErrors[i][j].stage);
        errors.push({
          _id: stage._id,
          name: stage.name,
          code: stage.code,
        });
      }
    }

    return res.status(200).json({ data: errors });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.unconfirmedErrors".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/order/:oid/model/:mid/production
 */
const productionForOrderAndModel = async (req, res) => {
  const oid = req.params.oid;
  const mid = req.params.mid;
  try {
    //order checks
    if (!idCheck(oid)) {
      return res
        .status(400)
        .json(errorFormat(oid, "Invalid order id", "oid", "params"));
    }
    const order = await Order.findById(oid);
    if (!order) {
      return res
        .status(404)
        .json(errorFormat(oid, "No order with this id", "oid", "params"));
    }

    //model checks
    if (!idCheck(mid)) {
      return res
        .status(400)
        .json(errorFormat(mid, "Invalid model id", "mid", "params"));
    }
    const model = await Model.findById(mid);
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "No model with this id", "mid", "params"));
    }
    const index = order.models.findIndex((obj) => obj.id.toString() === mid);
    if (index === -1) {
      return res
        .status(400)
        .json(
          errorFormat(mid, "The order does not has this model", "mid", "params")
        );
    }

    const cards = await Card.find({ model: mid, order: oid })
      .populate("color", "name code")
      .populate("size", "name")
      .populate("tracking.stage", "name type");

    const data = cards.map((card) => {
      let globalErrorLength = 0;
      for (let i = 0; i < card.globalErrors.length; i++) {
        if (!card.globalErrors[i].verifiedBy) {
          globalErrorLength++;
        }
      }

      let obj = {
        cardID: card._id,
        code: card.code,
        quantity: card.quantity,
        boxNumber: card.boxNumber,
        colorName: card.color.name,
        colorCode: card.color.code,
        size: card.size.name,
        currentErrorsLength: card.currentErrors.length,
        piecesGotErrors: card.cardErrors.length,
        lastStage:
          card.tracking.length > 0
            ? card.tracking[card.tracking.length - 1].stage.name
            : "Not started yet",
        lastStageType:
          card.tracking.length > 0
            ? card.tracking[card.tracking.length - 1].stage.type
            : "Not started yet",
        lastStageDate:
          card.tracking.length > 0
            ? card.tracking[card.tracking.length - 1].dateOut
            : null,
        done: card.done,
        globalErrorLength: globalErrorLength,
        trackingLength: card.tracking.length,
      };

      return obj;
    });

    res.status(200).json({ data });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "card.productionForOrderAndModel".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/global/add
 */
const addGlobalError = async (req, res) => {
  const id = req.params.id;
  const { pieceNo, description, addedBy } = req.body;
  const io = req.io;

  try {
    //card checks
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //pieceNo check
    if (pieceNo && (card.startRange > pieceNo || card.endRange < pieceNo)) {
      return res
        .status(400)
        .json(
          errorFormat(
            pieceNo,
            `Piece number must be in range ${card.startRange}:${card.endRange}`,
            "pieceNo",
            "body"
          )
        );
    }

    //addedBy checks
    if (!idCheck(addedBy)) {
      return res
        .status(400)
        .json(errorFormat(addedBy, "Invalid employee id", "addedBy", "body"));
    }
    const employee = await Employee.findById(addedBy);
    if (!employee) {
      return res
        .status(404)
        .json(
          errorFormat(addedBy, "No employee with this id", "addedBy", "body")
        );
    }

    //error repetition check
    let exist;
    if (pieceNo) {
      exist = card.globalErrors.findIndex(
        (obj) =>
          obj.description === description.trim() && obj.pieceNo === pieceNo
      );
    } else {
      exist = card.globalErrors.findIndex(
        (obj) => obj.description === description.trim() && obj.pieceNo === 0
      );
    }
    if (exist !== -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            description,
            "This error is exist before",
            "description",
            "body"
          )
        );
    }

    const current = currentTime();

    //update card.globalError
    card.globalErrors.push({
      pieceNo: pieceNo ? +pieceNo : 0,
      addedBy,
      dateIn: current,
      description: description.trim(),
    });

    card.history.push({
      state: "Global errors added to card",
      type: "addGlobalError",
      date: current,
    });

    await card.save();

    //update work doc for employee
    let employeeWork = await Work.findOne({
      employee: addedBy,
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    });
    if (!employeeWork) {
      employeeWork = await Work.create({
        employee: addedBy,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
        "date.day": current.getDate(),
      });
    }
    const employeeWorkIndex = employeeWork.workHistory.findIndex(
      (obj) => obj.day === current.getDate()
    );
    if (employeeWorkIndex === -1) {
      employeeWork.workHistory.push({
        day: current.getDate(),
        cards: [{ card: card._id, date: current }],
      });
    } else {
      employeeWork.workHistory[employeeWorkIndex].cards.push({
        card: card._id,
        date: current,
      });
    }
    if (employeeWork.date.day !== current.getDate()) {
      employeeWork.date.day = current.getDate();
      employeeWork.todayCards = 0;
    }
    employeeWork.todayCards++;
    employeeWork.totalCards++;
    await employeeWork.save();

    let globalErrorLength = 0;
    for (let i = 0; i < card.globalErrors.length; i++) {
      if (!card.globalErrors[i].verifiedBy) {
        globalErrorLength++;
      }
    }

    io.emit("errors", {
      cardID: card._id,
      cardCode: card.code,
      currentErrorsLength: card.currentErrors.length,
      pieceErrors: card.cardErrors.length,
      date: current,
      globalErrorLength: globalErrorLength,
    });

    res.status(200).json({ msg: "add global errors tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addGlobalError".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/global/confirm
 */
const confirmGlobalError = async (req, res) => {
  const id = req.params.id;
  const { verifyBy, globalErrorIndex } = req.body;
  const io = req.io;

  try {
    //card checks
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }
    if (card.done) {
      return res
        .status(400)
        .json(errorFormat(id, "This card is finished", "id", "params"));
    }

    //verifyBy checks
    if (!idCheck(verifyBy)) {
      return res
        .status(400)
        .json(errorFormat(verifyBy, "Invalid employee id", "verifyBy", "body"));
    }
    const employee = await Employee.findById(verifyBy);
    if (!employee) {
      return res
        .status(404)
        .json(
          errorFormat(verifyBy, "No employee with this ID", "verifyBy", "body")
        );
    }

    //globalErrorIndex checks
    if (!idCheck(globalErrorIndex)) {
      return res
        .status(400)
        .json(
          errorFormat(
            globalErrorIndex,
            "Invalid globalErrorIndex ID",
            "globalErrorIndex",
            "body"
          )
        );
    }
    const index = card.globalErrors.findIndex(
      (obj) => obj._id.toString() === globalErrorIndex
    );
    if (index === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            globalErrorIndex,
            "Global error index not found",
            "globalErrorIndex",
            "body"
          )
        );
    }
    if (card.globalErrors[index].verifiedBy) {
      return res
        .status(400)
        .json(
          errorFormat(
            globalErrorIndex,
            "This error has been confirmed",
            "globalErrorIndex",
            "body"
          )
        );
    }

    const current = currentTime();

    //update work doc for verifyBy if not the
    if (card.globalErrors[index].addedBy.toString() !== verifyBy) {
      let employeeWork = await Work.findOne({
        employee: verifyBy,
        "date.year": current.getFullYear(),
        "date.month": current.getMonth() + 1,
      });
      if (!employeeWork) {
        employeeWork = await Work.create({
          employee: verifyBy,
          "date.year": current.getFullYear(),
          "date.month": current.getMonth() + 1,
          "date.day": current.getDate(),
        });
      }
      const employeeWorkIndex = employeeWork.workHistory.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (employeeWorkIndex === -1) {
        employeeWork.workHistory.push({
          day: current.getDate(),
          cards: [{ card: card._id, date: current }],
        });
      } else {
        employeeWork.workHistory[employeeWorkIndex].cards.push({
          card: card._id,
          date: current,
        });
      }
      if (employeeWork.date.day !== current.getDate()) {
        employeeWork.date.day = current.getDate();
        employeeWork.todayCards = 0;
      }
      employeeWork.todayCards++;
      employeeWork.totalCards++;
      await employeeWork.save();
    }

    //update card.globalErrors
    card.globalErrors[index].verifiedBy = verifyBy;
    card.globalErrors[index].dateOut = current;

    card.history.push({
      state: `Error: ${card.globalErrors[index].description} has been confirmed `,
      type: "confirmGlobalError",
      date: current,
    });

    await card.save();

    let globalErrorLength = 0;
    for (let i = 0; i < card.globalErrors.length; i++) {
      if (!card.globalErrors[i].verifiedBy) {
        globalErrorLength++;
      }
    }

    io.emit("errorConfirm", {
      cardID: card._id,
      cardCode: card.code,
      currentErrorsLength: card.currentErrors.length,
      date: current,
      globalErrorLength: globalErrorLength,
    });

    res.status(200).json({ msg: "confirm global errors tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.confirmGlobalError".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/stage/:sid/isTracked
 */
const isTracked = async (req, res) => {
  const id = req.params.id;
  const sid = req.params.sid;
  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    if (!idCheck(sid)) {
      return res
        .status(400)
        .json(errorFormat(sid, "Invalid stage id", "sid", "params"));
    }
    const stageDoc = await Stage.findById(sid);
    if (!stageDoc) {
      return res
        .status(404)
        .json(errorFormat(sid, "No stage with this id", "sid", "body"));
    }
    const index = card.tracking.findIndex(
      (obj) => obj.stage.toString() === sid
    );
    if (index === -1) {
      return res.status(200).json({ tracked: false });
    } else {
      return res.status(200).json({ tracked: true });
    }
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.isTracked".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: POST
 * path: /api/card/code/:code
 */
const getByCode = async (req, res) => {
  const code = req.params.code;
  const modelID = req.body.model;
  const orderID = req.body.order;

  try {
    //model check
    if (!idCheck(modelID)) {
      return res
        .status(400)
        .json(errorFormat(modelID, "Invalid model id", "model", "body"));
    }
    //order check
    if (!idCheck(orderID)) {
      return res
        .status(400)
        .json(errorFormat(orderID, "Invalid order id", "order", "body"));
    }

    const card = await Card.findOne({
      code,
      model: modelID,
      order: orderID,
    });
    if (!card) {
      return res
        .status(400)
        .json(errorFormat(code, `No card with code: ${code}`, "code", "body"));
    }

    res.status(200).json({ data: card });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getByCode".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/order/:oid/model/:mid/date/:date
 */
const statics = async (req, res) => {
  const { oid, mid, date } = req.params;
  try {
    if (!idCheck(oid)) {
      res
        .status(400)
        .json(errorFormat(oid, "Invalid order ID", "oid", "params"));
    }
    if (!idCheck(mid)) {
      res
        .status(400)
        .json(errorFormat(mid, "Invalid order ID", "mid", "params"));
    }

    const givenDate = new Date(date);

    //get all stages of the givin model
    const modelDoc = await Model.findById(mid).populate(
      "stages.id",
      "name type rate"
    );

    let result = [];
    for (let i = 0; i < modelDoc.stages.length; i++) {
      result.push({
        stageID: modelDoc.stages[i].id._id.toString(),
        stageName: modelDoc.stages[i].id.name,
        stageType: modelDoc.stages[i].id.type,
        totalTrack: 0,
        totalError: 0,
        required: modelDoc.stages[i].id.rate * 8,
        track: [],
        error: [],
      });
    }

    //all cards with the givin model and order
    const cards = await Card.find({
      order: oid,
      model: mid,
    }).populate("tracking.stage", "name");

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

    return res.json({ result });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.statics".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/card/order/:oid/model/:mid/dateBounds
 */
const dateBounds = async (req, res) => {
  const { oid, mid } = req.params;
  try {
    //data checks
    if (!idCheck(oid)) {
      res
        .status(400)
        .json(errorFormat(oid, "Invalid order ID", "oid", "params"));
    }
    if (!idCheck(mid)) {
      res
        .status(400)
        .json(errorFormat(mid, "Invalid order ID", "mid", "params"));
    }

    //get data from oid and mid
    const order = await Order.findById(oid)
      .populate("models.color", "name code")
      .populate("models.size", "name");

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(oid, "No order with this ID", "oid", "params"));
    }

    let models = [];
    for (let i = 0; i < order.models.length; i++) {
      if (order.models[i].id.toString() === mid) {
        models.push(order.models[i]);
      }
    }

    if (models.length === 0) {
      return res
        .status(404)
        .json(
          errorFormat(
            mid,
            "The givin order does not have this model",
            "mid",
            "params"
          )
        );
    }

    const model = await Model.findById(mid).populate(
      "stages.id",
      "type name rate"
    );
    if (!model) {
      return res
        .status(404)
        .json(errorFormat(mid, "No model with this id", "mid", "params"));
    }

    let stages = [];
    //get start and end stages of each group
    // stages[stages.length] = model.stages[0];
    for (let i = 0; i < model.stages.length; i++) {
      if (model.stages[i].id.type === "quality" && stages.length < 6) {
        // stages[stages.length] = model.stages[i - 1].id._id;
        stages[stages.length] = model.stages[i - 1];
        // stages[stages.length] = model.stages[i + 1].id._id;
        stages[stages.length] = model.stages[i + 1];
      }
    }
    stages.pop();

    // return res.json({ stages });

    let result = [];

    //get cards for each model and order combination
    for (let i = 0; i < models.length; i++) {
      let dates = new Array(6);
      let g1 = 0;
      let g2 = 0;
      let g3 = 0;
      const cardDocs = await Card.find({
        order: oid,
        model: mid,
        modelIndex: models[i]._id.toString(),
      }).select(["-history", "-cardErrors", "-currentErrors"]);

      for (let j = 0; j < cardDocs.length; j++) {
        if (cardDocs[j].tracking.length > 0) {
          //get start date of first group
          if (!dates[0]) {
            dates[0] = cardDocs[j].tracking[0].dateOut;
          } else if (dates[0] > cardDocs[j].tracking[0].dateOut) {
            dates[0] = cardDocs[j].tracking[0].dateOut;
          }

          for (let k = 0; k < cardDocs[j].tracking.length; k++) {
            //get end date of first group
            if (
              cardDocs[j].tracking[k].stage.toString() ===
              stages[0].id._id.toString()
            ) {
              g1++;
              if (!dates[1]) {
                dates[1] = cardDocs[j].tracking[k].dateOut;
              } else if (dates[1] > cardDocs[j].tracking[k].dateOut) {
                dates[1] = cardDocs[j].tracking[k].dateOut;
              }
            }

            //get start date of second group
            if (
              cardDocs[j].tracking[k].stage.toString() ===
              stages[1].id._id.toString()
            ) {
              g2++;
              if (!dates[2]) {
                dates[2] = cardDocs[j].tracking[k].dateOut;
              } else if (dates[2] > cardDocs[j].tracking[k].dateOut) {
                dates[2] = cardDocs[j].tracking[k].dateOut;
              }
            }

            //get end date of second group
            if (
              cardDocs[j].tracking[k].stage.toString() ===
              stages[2].id._id.toString()
            ) {
              g2++;
              if (!dates[3]) {
                dates[3] = cardDocs[j].tracking[k].dateOut;
              } else if (dates[3] > cardDocs[j].tracking[k].dateOut) {
                dates[3] = cardDocs[j].tracking[k].dateOut;
              }
            }

            //get start date of third group
            if (
              cardDocs[j].tracking[k].stage.toString() ===
              stages[3]?.id?._id?.toString()
            ) {
              g3++;
              if (!dates[4]) {
                dates[4] = cardDocs[j].tracking[k].dateOut;
              } else if (dates[4] > cardDocs[j].tracking[k].dateOut) {
                dates[4] = cardDocs[j].tracking[k].dateOut;
              }
            }

            //get end date of third group
            if (
              cardDocs[j].tracking[k].stage.toString() ===
              stages[4]?.id?._id?.toString()
            ) {
              g3++;
              if (!dates[5]) {
                dates[5] = cardDocs[j].tracking[k].dateOut;
              } else if (dates[5] > cardDocs[j].tracking[k].dateOut) {
                dates[5] = cardDocs[j].tracking[k].dateOut;
              }
            }
          }
        }
      }

      //in case some cards still in 1st group
      if (g1 !== cardDocs.length) {
        dates[1] = null;
        dates[3] = null;
        dates[5] = null;
      }
      //in case some cards still in 2nd group
      if (g2 / 2 !== cardDocs.length) {
        dates[3] = null;
        dates[5] = null;
      }
      //in case some cards still in 3rd group
      if (g3 / 2 !== cardDocs.length) {
        dates[5] = null;
      }

      result.push({
        model: models[i],
        group1: { start: dates[0] || null, end: dates[1] || null },
        group2: { start: dates[2] || null, end: dates[3] || null },
        group3: { start: dates[4] || null, end: dates[5] || null },
      });
    }

    //return stages last stage of each group
    let resultStages = [];
    for (let i = 0; i < stages.length; i++) {
      if (i % 2 === 0) {
        resultStages.push({
          stageName: stages[i].id.name,
          stageRate: stages[i].id.rate,
          stageRequiredQuantity: stages[i].id.rate * 8,
        });
      }
    }

    return res.status(200).json({ result, resultStages });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.dateBounds".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

const groups = async (req, res) => {
  const { oid } = req.params;
  try {
    //data checks
    if (!idCheck(oid)) {
      res
        .status(400)
        .json(errorFormat(oid, "Invalid order ID", "oid", "params"));
    }

    //get data from oid and mid
    const order = await Order.findById(oid)
      .populate("models.color", "name code")
      .populate("models.size", "name");

    if (!order) {
      return res
        .status(404)
        .json(errorFormat(oid, "No order with this ID", "oid", "params"));
    }

    let result = [];
    for (let i = 0; i < order.models.length; i++) {
      let cut = 0;
      let subResult = [];

      //get model stages
      const model = await Model.findById(order.models[i].id).populate(
        "stages.id",
        "type name rate"
      );
      if (!model) {
        return res
          .status(404)
          .json(
            errorFormat(
              order.models[i].id,
              "No model with this id",
              `order.models[${i}].id`,
              "params"
            )
          );
      }

      let stages = [];
      //last preparations and end of each group
      for (let j = 0; j < model.stages.length; j++) {
        if (model.stages[j].id.type === "preparations") {
          stages[0] = model.stages[j].id;
        }
        if (
          model.stages[j].id.type === "quality" &&
          model.stages[j - 1].id.type === "production"
        ) {
          stages[stages.length] = model.stages[j - 1].id;
        }
        if (model.stages[j].id.type === "finishing") {
          stages[stages.length] = model.stages[j].id;
        }
      }

      //cards for this combination: order, model, modelIndex
      const cardDocs = await Card.find({
        order: order._id,
        model: order.models[i].id,
        modelIndex: order.models[i]._id,
      }).select("-history -currentErrors -cardErrors -globalErrors");

      for (let j = 0; j < cardDocs.length; j++) {
        cut += +cardDocs[j].quantity;

        for (let k = 0; k < stages.length; k++) {
          const index = cardDocs[j].tracking.findIndex(
            (obj) => obj.stage.toString() === stages[k]._id.toString()
          );

          if (index !== -1) {
            if (subResult[k]) {
              subResult[k] += +cardDocs[j].quantity;
            } else {
              subResult[k] = +cardDocs[j].quantity;
            }
          }
        }
      }

      let finalStages = [];
      for (let o = 0; o < stages.length; o++) {
        if (o === 0) {
          finalStages.push({
            cut,
          });
        } else {
          finalStages.push({
            stage: stages[o],
            done: subResult[o],
          });
        }
      }

      result.push({
        model: order.models[i],
        stages: finalStages,
      });
    }

    return res.status(200).json({ result });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.groups".bgYellow);
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
  // removeTracking,
  replaceTracking,
  addError,
  // confirmError,
  confirmAll,
  getLast,
  getAllForModelOrder,
  unconfirmedErrors,
  // repair,
  stagesNeedToRepair,
  repairAll,
  // addErrorCheck,
  getAllForModelOrderWithErrors,
  productionForOrderAndModel,
  addGlobalError,
  confirmGlobalError,
  isTracked,
  getByCode,
  statics,
  dateBounds,
  groups,
};
