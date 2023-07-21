const {
  Card,
  Salary,
  Employee,
  Stage,
  Order,
  Model,
  User,
  UserEmployee,
  Work,
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
    });
    if (boxNumberUsed) {
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
      .populate("tracking.stage", "name stageErrors")
      .populate("tracking.employee", "name code")
      .populate("tracking.enteredBy", "name code")
      .populate("currentErrors", "name")
      .populate("cardErrors.pieceErrors.stage", "name")
      .populate("cardErrors.pieceErrors.enteredBy", "name code")
      .populate("cardErrors.pieceErrors.doneBy", "name code")
      .populate("cardErrors.pieceErrors.verifiedBy", "name code");

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    const order = await Order.findById(doc.order._id)
      .populate("models.color", "name code")
      .populate("models.size", "code");

    const index = order.models.findIndex(
      (obj) => obj._id.toString() === doc.modelIndex.toString()
    );

    res.status(200).json({
      data: doc,
      color: order.models[index].color,
      size: order.models[index].size,
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
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //stage check
    if (!idCheck(stageID)) {
      return res
        .status(400)
        .json(errorFormat(stageID, "Invalid stage id", "stage", "body"));
    }
    const model = await Model.findById(card.model).select("stages");
    const stageIndex = model.stages.findIndex(
      (obj) => obj.id.toString() === stageID
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
    const currentPriority = model.stages[stageIndex].priority;

    //check if the stage has been tracked before
    const trackedIndex = card.tracking.findIndex(
      (obj) => obj.stage.toString() === stageID
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

    //sequence in stages checks
    const order = await Order.findById(card.order).select("sequence");
    if (order.sequence) {
      //first tracked element
      if (
        card.tracking.length === 0 &&
        model.stages[stageIndex].priority !== 1
      ) {
        return res
          .status(400)
          .json(
            errorFormat(
              stageID,
              "Card must start with first stage",
              "stage",
              "body"
            )
          );
      }

      //not first element
      if (card.tracking.length > 0) {
        const lastStageIndex = model.stages.findIndex(
          (obj) =>
            obj.id.toString() ===
            card.tracking[card.tracking.length - 1].stage.toString()
        );

        const lastPriority = model.stages[lastStageIndex].priority;

        console.log("lastPriority", lastPriority);
        console.log("currentPriority", currentPriority);

        //check if last priority != given stage index or not greater by 1
        if (
          currentPriority !== lastPriority &&
          currentPriority !== lastPriority + 1
        ) {
          return res
            .status(400)
            .json(
              errorFormat(
                stageID,
                "Please enter stages in order",
                "stage",
                "body"
              )
            );
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

    //get stage
    const stage = await Stage.findById(stageID);

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
      state: `Stage ${stage.name} has been tracked`,
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
          cards: [{ card: card._id, date: current }],
        });
      } else {
        enteredByWork.workHistory[enteredByWorkIndex].cards.push({
          card: card._id,
          date: current,
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

    io.emit("addTracking", { msg: "addTracking", card, stage });

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
 * path: /api/card/:id/errors/add/check
 */
const addErrorCheck = async (req, res) => {
  const id = req.params.id;
  const { pieceNo, pieceErrors } = req.body;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //pieceNo check
    if (pieceNo < card.startRange || pieceNo > card.endRange) {
      return res
        .status(400)
        .json(
          errorFormat(
            pieceNo,
            `pieceNo must be in range ${card.startRange}:${card.endRange}`,
            "pieceNo",
            "body"
          )
        );
    }

    //check loop
    for (let i = 0; i < pieceErrors.length; i++) {
      //stage checks
      if (!idCheck(pieceErrors[i].stage)) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "Invalid stage ID",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }
      const stage = await Stage.findById(pieceErrors[i].stage);
      if (!stage) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "No stage with this id",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }
      const stageIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === pieceErrors[i].stage
      );
      if (stageIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "Not tracked stage",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }

      //check if card.model have the givin stage
      const modelStage = await Model.findOne({
        _id: card.model,
        "stages.id": pieceErrors[i].stage,
      });
      if (!modelStage) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "This stage does not exist in card model",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }

      const cardErrorsIndex = card.cardErrors.findIndex(
        (obj) => obj.pieceNo === Number(pieceNo)
      );
      if (cardErrorsIndex !== -1) {
        const exist = card.cardErrors[cardErrorsIndex].pieceErrors.findIndex(
          (obj) => obj.stage.toString() === pieceErrors[i].stage
        );
        if (exist !== -1) {
          return res
            .status(400)
            .json(
              errorFormat(
                pieceErrors[i].stage,
                `this error exist in piece no.${pieceNo}`,
                `pieceErrors[${i}].stage`,
                "body"
              )
            );
        }
      }

      //enteredBy
      if (!idCheck(pieceErrors[i].enteredBy)) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "Invalid enteredBy id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }
      const user = await User.findById(pieceErrors[i].enteredBy);
      if (!user) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "No user with this id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }
      const userEmployee = await UserEmployee.findOne({ user: user._id });
      if (!userEmployee) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "No 'UserEmployee' doc related with this id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }
      const enteredByEmployee = await Employee.findById(userEmployee.employee);
      if (!enteredByEmployee) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "No 'Employee' doc related to this id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }

      //salary checks
      // const salary = await Salary.findOne({
      //   employee: card.tracking[stageIndex].employee,
      //   "date.month": card.tracking[stageIndex].dateOut.getMonth() + 1,
      //   "date.year": card.tracking[stageIndex].dateOut.getFullYear(),
      // });
      // if (!salary) {
      //   return res
      //     .status(404)
      //     .json(
      //       errorFormat(
      //         card.tracking[stageIndex].employee,
      //         "no 'Salary' doc with this employee",
      //         `card.tracking[${stageIndex}].employee`,
      //         "others"
      //       )
      //     );
      // }
      // if (!salary) {
      //   continue;
      // }

      // const dayIndex = salary.workDetails.findIndex(
      //   (obj) => obj.day === card.tracking[stageIndex].dateOut.getDate()
      // );
      // if (dayIndex === -1) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         dayIndex,
      //         `No 'workDetails' for day = ${card.tracking[
      //           stageIndex
      //         ].dateOut.getDate()}`,
      //         "dayIndex",
      //         "others"
      //       )
      //     );
      // }

      // const workIndex = salary.workDetails[dayIndex].work.findIndex(
      //   (obj) => obj.stage.toString() === pieceErrors[i].stage
      // );
      // if (workIndex === -1) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         workIndex,
      //         `No 'workDetails' for stage = ${pieceErrors[i].stage}`,
      //         "workIndex",
      //         "others"
      //       )
      //     );
      // }

      // const totalIndex = salary.totalWorkPerMonth.findIndex(
      //   (obj) => obj.stage.toString() === pieceErrors[i].stage
      // );
      // if (totalIndex === -1) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         totalIndex,
      //         `No 'totalWorkPerMonth' for stage = ${pieceErrors[i].stage}`,
      //         "totalIndex",
      //         "others"
      //       )
      //     );
      // }
    }

    res.status(200).json({ msg: "Errors checked tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addErrorCheck".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/add
 */
const addError = async (req, res) => {
  const id = req.params.id;
  const { pieceNo, pieceErrors } = req.body;
  const io = req.io;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //pieceNo check
    if (pieceNo !== 0 || pieceNo < card.startRange || pieceNo > card.endRange) {
      return res
        .status(400)
        .json(
          errorFormat(
            pieceNo,
            `pieceNo must be in range ${card.startRange}:${card.endRange}`,
            "pieceNo",
            "body"
          )
        );
    }

    //check loop
    for (let i = 0; i < pieceErrors.length; i++) {
      //stage checks
      if (!idCheck(pieceErrors[i].stage)) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "Invalid stage ID",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }
      const stage = await Stage.findById(pieceErrors[i].stage);
      if (!stage) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "No stage with this id",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }
      const stageIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === pieceErrors[i].stage
      );
      if (stageIndex === -1) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "Not tracked stage",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }

      //check if card.model have the givin stage
      const modelStage = await Model.findOne({
        _id: card.model,
        "stages.id": pieceErrors[i].stage,
      });
      if (!modelStage) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].stage,
              "This stage does not exist in card model",
              `pieceErrors[${i}].stage`,
              "body"
            )
          );
      }

      const cardErrorsIndex = card.cardErrors.findIndex(
        (obj) => obj.pieceNo === Number(pieceNo)
      );
      if (cardErrorsIndex !== -1) {
        const exist = card.cardErrors[cardErrorsIndex].pieceErrors.findIndex(
          (obj) => obj.stage.toString() === pieceErrors[i].stage
        );
        if (exist !== -1) {
          return res
            .status(400)
            .json(
              errorFormat(
                pieceErrors[i].stage,
                `this error exist in piece no.${pieceNo}`,
                `pieceErrors[${i}].stage`,
                "body"
              )
            );
        }
      }

      //enteredBy
      if (!idCheck(pieceErrors[i].enteredBy)) {
        return res
          .status(400)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "Invalid enteredBy id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }
      const user = await User.findById(pieceErrors[i].enteredBy);
      if (!user) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "No user with this id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }
      const userEmployee = await UserEmployee.findOne({ user: user._id });
      if (!userEmployee) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "No 'UserEmployee' doc related with this id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }
      const enteredByEmployee = await Employee.findById(userEmployee.employee);
      if (!enteredByEmployee) {
        return res
          .status(404)
          .json(
            errorFormat(
              pieceErrors[i].enteredBy,
              "No 'Employee' doc related to this id",
              `pieceErrors[${i}].enteredBy`,
              "body"
            )
          );
      }

      //salary checks
      // const salary = await Salary.findOne({
      //   employee: card.tracking[stageIndex].employee,
      //   "date.month": card.tracking[stageIndex].dateOut.getMonth() + 1,
      //   "date.year": card.tracking[stageIndex].dateOut.getFullYear(),
      // });
      // if (!salary) {
      //   return res
      //     .status(404)
      //     .json(
      //       errorFormat(
      //         card.tracking[stageIndex].employee,
      //         "no 'Salary' doc with this employee",
      //         `card.tracking[${stageIndex}].employee`,
      //         "others"
      //       )
      //     );
      // }
      // if (!salary) {
      //   continue;
      // }

      // const dayIndex = salary.workDetails.findIndex(
      //   (obj) => obj.day === card.tracking[stageIndex].dateOut.getDate()
      // );
      // if (dayIndex === -1) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         dayIndex,
      //         `No 'workDetails' for day = ${card.tracking[
      //           stageIndex
      //         ].dateOut.getDate()}`,
      //         "dayIndex",
      //         "others"
      //       )
      //     );
      // }

      // const workIndex = salary.workDetails[dayIndex].work.findIndex(
      //   (obj) => obj.stage.toString() === pieceErrors[i].stage
      // );
      // if (workIndex === -1) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         workIndex,
      //         `No 'workDetails' for stage = ${pieceErrors[i].stage}`,
      //         "workIndex",
      //         "others"
      //       )
      //     );
      // }

      // const totalIndex = salary.totalWorkPerMonth.findIndex(
      //   (obj) => obj.stage.toString() === pieceErrors[i].stage
      // );
      // if (totalIndex === -1) {
      //   return res
      //     .status(400)
      //     .json(
      //       errorFormat(
      //         totalIndex,
      //         `No 'totalWorkPerMonth' for stage = ${pieceErrors[i].stage}`,
      //         "totalIndex",
      //         "others"
      //       )
      //     );
      // }
    }

    const current = currentTime();

    //update loop
    for (let i = 0; i < pieceErrors.length; i++) {
      const stage = await Stage.findById(pieceErrors[i].stage);

      const stageIndex = card.tracking.findIndex(
        (obj) => obj.stage.toString() === pieceErrors[i].stage
      );

      const user = await User.findById(pieceErrors[i].enteredBy);
      const userEmployee = await UserEmployee.findOne({ user: user._id });
      const enteredByEmployee = await Employee.findById(userEmployee.employee);

      let salary = await Salary.findOne({
        employee: card.tracking[stageIndex].employee,
        "date.month": current.getMonth() + 1,
        "date.year": current.getFullYear(),
      });

      if (!salary) {
        salary = await Salary.create({
          employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
          date: {
            day: current.getDate(),
            month: current.getMonth() + 1,
            year: current.getFullYear(),
          },
        });
      }

      //update workDetails
      const dayIndex = salary.workDetails.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (dayIndex === -1) {
        salary.workDetails.push({
          day: current.getDate(),
          work: [{ stage: pieceErrors[i].stage, quantity: -1 }],
        });
      } else {
        const workDetailsIndex = salary.workDetails[dayIndex].work.findIndex(
          (obj) => obj.stage.toString() === pieceErrors[i].stage
        );
        if (workDetailsIndex === -1) {
          salary.workDetails[dayIndex].work.push({
            stage: pieceErrors[i].stage,
            quantity: -1,
          });
        } else {
          salary.workDetails[dayIndex].work[workDetailsIndex].quantity -= 1;
        }
      }

      //update totalWorkPerMonth
      const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
        (obj) => obj.stage.toString() === pieceErrors[i].stage
      );
      if (totalWorkIndex === -1) {
        salary.totalWorkPerMonth.push({
          stage: pieceErrors[i].stage,
          quantity: -1,
        });
      } else {
        salary.totalWorkPerMonth[totalWorkIndex].quantity -= 1;
      }

      if (salary.date.day === current.getDate()) {
        salary.todayPieces -= 1;
        salary.todayCost -= stage.price;
      } else {
        salary.date.day = current.getDate();
        salary.todayPieces = -1;
        salary.todayCost = -stage.price;
      }

      salary.totalPieces -= 1;
      salary.totalCost -= stage.price;

      await salary.save();

      //update currentErrors
      const currentErrorsIndex = card.currentErrors.findIndex((obj) => {
        return obj.toString() === stage._id.toString();
      });
      if (currentErrorsIndex === -1) {
        card.currentErrors.push(stage._id);
      }

      //update cardErrors
      const cardErrorsIndex = card.cardErrors.findIndex(
        (obj) => obj.pieceNo === Number(pieceNo)
      );
      if (cardErrorsIndex === -1) {
        card.cardErrors.push({
          pieceNo: pieceNo,
          pieceErrors: [
            {
              stage: pieceErrors[i].stage,
              description: pieceErrors[i].description,
              dateIn: current,
              addedBy: enteredByEmployee._id,
            },
          ],
        });
      } else {
        card.cardErrors[cardErrorsIndex].pieceErrors.push({
          stage: pieceErrors[i].stage,
          description: pieceErrors[i].description,
          dateIn: current,
          addedBy: enteredByEmployee,
        });
      }
    }
    //push to history
    card.history.push({
      state: `Errors has been added in piece no.${pieceNo}`,
      date: current,
    });

    await card.save();

    io.emit("errors", { msg: "errors", card, pieceNo });

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
const repair = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, doneBy: doneByID, enteredBy: enteredByID } = req.body;
  const io = req.io;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //stage checks
    if (!idCheck(stageID)) {
      return res
        .status(400)
        .json(errorFormat(stageID, "Invalid stage ID", "stage", "body"));
    }
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No stage with this id", "stage", "body"));
    }
    const modelStage = await Model.findOne({
      _id: card.model,
      "stages.id": stageID,
    });
    if (!modelStage) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "This stage does not exist in card model",
            "stage",
            "body"
          )
        );
    }
    const trackingIndex = card.tracking.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (trackingIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(stageID, "can't repair untracked stage", "stage", "body")
        );
    }
    const currentErrorsIndex = card.currentErrors.findIndex(
      (obj) => obj.toString() === stageID
    );
    if (currentErrorsIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "Can not repair stage has no errors",
            "stage",
            "body"
          )
        );
    }

    //doneBy checks
    if (!idCheck(doneByID)) {
      return res
        .status(400)
        .json(errorFormat(doneByID, "Invalid employee ID", "doneBy", "body"));
    }
    const doneByEmployee = await Employee.findById(doneByID);
    if (!doneByEmployee) {
      return res
        .status(400)
        .json(
          errorFormat(doneByID, "No employee with this ID", "doneBy", "body")
        );
    }

    //enteredBy checks
    if (!idCheck(enteredByID)) {
      return res
        .status(400)
        .json(errorFormat(enteredByID, "Invalid user ID", "enteredBy", "body"));
    }
    const user = await User.findById(enteredByID);
    if (!user) {
      return res
        .status(404)
        .json(
          errorFormat(enteredByID, "No user with this ID", "enteredBy", "body")
        );
    }
    const userEmployee = await UserEmployee.findOne({ user: enteredByID });
    if (!userEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            enteredByID,
            "No 'UserEmployee' doc related to this id",
            "enteredBy",
            "body"
          )
        );
    }
    const enteredByEmployee = await Employee.findById(userEmployee.employee);
    if (!enteredByEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            enteredByID,
            "No 'User' doc related to this ID",
            "enteredByID",
            "body"
          )
        );
    }

    const current = currentTime();

    for (let i = 0; i < card.cardErrors.length; i++) {
      for (let j = 0; j < card.cardErrors[i].pieceErrors.length; j++) {
        if (card.cardErrors[i].pieceErrors[j].stage.toString() === stageID) {
          card.cardErrors[i].pieceErrors[j].doneBy = doneByID;
          card.cardErrors[i].pieceErrors[j].enteredBy = enteredByEmployee._id;
          card.cardErrors[i].pieceErrors[j].doneIn = current;
        }
      }
    }

    card.history.push({
      state: `Errors in stage ${stage.name} has been done by ${enteredByEmployee.name}`,
      date: current,
    });

    await card.save();

    io.emit("repairs", { msg: "repairs", card, stage });

    res.status(200).json({ msg: "Error repaired tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.repair".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/confirm
 */
const confirmError = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, verifiedBy: verifiedByID } = req.body;
  const io = req.io;
  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
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
    const modelStage = await Model.findOne({
      _id: card.model,
      "stages.id": stageID,
    });
    if (!modelStage) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "This stage does not exist in card model",
            "stage",
            "body"
          )
        );
    }
    const trackingIndex = card.tracking.findIndex(
      (obj) => obj.stage.toString() === stageID
    );
    if (trackingIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(stageID, "can't repair untracked stage", "stage", "body")
        );
    }
    const currentErrorsIndex = card.currentErrors.findIndex(
      (obj) => obj.toString() === stageID
    );
    if (currentErrorsIndex === -1) {
      return res
        .status(400)
        .json(
          errorFormat(
            stageID,
            "Can not repair stage has no errors",
            "stage",
            "body"
          )
        );
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
    const user = await User.findById(verifiedByID);
    if (!user) {
      return res
        .status(404)
        .json(
          errorFormat(
            verifiedByID,
            "No user with this id",
            "verifiedBy",
            "body"
          )
        );
    }
    const userEmployee = await UserEmployee.findOne({ user: verifiedByID });
    if (!userEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            verifiedByID,
            "This user is not an employee",
            "verifiedBy",
            "body"
          )
        );
    }
    const verifiedByEmployee = await Employee.findById(userEmployee.employee);
    if (!verifiedByEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            verifiedByID,
            "No employee doc related to this user",
            "verifiedBy",
            "body"
          )
        );
    }

    const current = currentTime();

    //check loop
    for (let i = 0; i < card.cardErrors.length; i++) {
      const stageIndex = card.cardErrors[i].pieceErrors.findIndex(
        (obj) => obj.stage.toString() === stageID
      );
      if (stageIndex === -1) {
        continue;
      }

      //if not repaired
      if (!card.cardErrors[i].pieceErrors[stageIndex].doneBy) {
        return res
          .status(400)
          .json(
            errorFormat(
              stageID,
              "Can't confirm unrepaired stage",
              "stage",
              "body"
            )
          );
      }

      //salary checks
      // const salary = await Salary.findOne({
      //   employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
      //   "date.month": current.getMonth() + 1,
      //   "date.year": current.getFullYear(),
      // });
      // if (!salary) {
      //   return res
      //     .status(404)
      //     .json(
      //       card.cardErrors[i].pieceErrors[stageIndex].doneBy,
      //       "untracked salary for this employee",
      //       `card.cardErrors[$[i]].pieceErrors[${stageIndex}].doneBy`,
      //       "others"
      //     );
      // }
      // if (salary) {
      //   const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
      //     (obj) => obj.stage.toString() === stageID
      //   );
      //   if (totalWorkIndex === -1) {
      //     return res
      //       .status(404)
      //       .json(
      //         card.cardErrors[i].pieceErrors[stageIndex].doneBy,
      //         "untracked salary for this employee",
      //         `card.cardErrors[$[i]].pieceErrors[${stageIndex}].doneBy`,
      //         "others"
      //       );
      //   }
      // }
    }

    for (let i = 0; i < card.cardErrors.length; i++) {
      const stageIndex = card.cardErrors[i].pieceErrors.findIndex(
        (obj) => obj.stage.toString() === stageID
      );

      //skip if not exist or has been verified
      if (
        stageIndex === -1 ||
        card.cardErrors[i].pieceErrors[stageIndex].verifiedBy
      ) {
        continue;
      }

      //update verifiedBy & dateOut
      card.cardErrors[i].pieceErrors[stageIndex].verifiedBy =
        verifiedByEmployee._id;
      card.cardErrors[i].pieceErrors[stageIndex].dateOut = current;

      let salary = await Salary.findOne({
        employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
        "date.month": current.getMonth() + 1,
        "date.year": current.getFullYear(),
      });

      if (!salary) {
        salary = await Salary.create({
          employee: card.cardErrors[i].pieceErrors[stageIndex].doneBy,
          date: {
            day: current.getDate(),
            month: current.getMonth() + 1,
            year: current.getFullYear(),
          },
        });
      }

      //update workDetails
      const dayIndex = salary.workDetails.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (dayIndex === -1) {
        salary.workDetails.push({
          day: current.getDate(),
          work: [{ stage: stageID, quantity: 1 }],
        });
      } else {
        const workDetailsIndex = salary.workDetails[dayIndex].work.findIndex(
          (obj) => obj.stage.toString() === stageID
        );
        if (workDetailsIndex === -1) {
          salary.workDetails[dayIndex].work.push({
            stage: stageID,
            quantity: 1,
          });
        } else {
          salary.workDetails[dayIndex].work[workDetailsIndex].quantity += 1;
        }
      }

      //check priceHistory
      const priceIndex = salary.priceHistory.findIndex(
        (obj) => obj.stage.toString() === stageID
      );
      if (priceIndex === -1) {
        salary.priceHistory.push({ stage: stageID, price: stage.price });
      }

      //update totalWorkPerMonth
      const totalWorkIndex = salary.totalWorkPerMonth.findIndex(
        (obj) => obj.stage.toString() === stageID
      );
      if (totalWorkIndex === -1) {
        salary.totalWorkPerMonth.push({ stage: stageID, quantity: 1 });
      } else {
        salary.totalWorkPerMonth[totalWorkIndex].quantity += 1;
      }

      if (salary.date.day === current.getDate()) {
        salary.todayPieces += 1;
        salary.todayCost += stage.price;
      } else {
        salary.date.day = current.getDate();
        salary.todayPieces = 1;
        salary.todayCost = stage.price;
      }

      salary.totalPieces += 1;
      salary.totalCost += stage.price;

      await salary.save();
    }

    card.currentErrors.pull(card.currentErrors[currentErrorsIndex]._id);

    card.history.push({
      state: `Errors in stage ${stage.name} has been verified by ${verifiedByEmployee.name}`,
      date: current,
    });

    await card.save();

    io.emit("errorConfirm", { msg: "errorConfirm", card, stage });

    res.status(200).json({ msg: "Error confirmed for this stage tmam" });
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
      cardErrors: { $exists: true, $ne: [] },
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
 * path: /api/card/order/:oid
 */

module.exports = {
  create,
  getAll,
  getByID,
  deleteOne,
  update,
  addTracking,
  // removeTracking,
  addError,
  confirmError,
  getLast,
  getAllForModelOrder,
  unconfirmedErrors,
  repair,
  addErrorCheck,
  getAllForModelOrderWithErrors,
};
