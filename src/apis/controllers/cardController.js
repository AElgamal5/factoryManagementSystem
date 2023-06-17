const {
  Card,
  Salary,
  Employee,
  Stage,
  Order,
  Model,
  User,
  UserEmployee,
} = require("../models");
const { idCheck, errorFormat, currentDate, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/card/
 */
const create = async (req, res) => {
  const { code, order: orderID, model: modelID, quantity, details } = req.body;

  try {
    //code check
    const exist = await Card.findOne({ code, order: orderID, model: modelID });
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
    const orderModel = await Order.findOne({
      _id: orderID,
      "models.id": modelID,
    });
    if (!orderModel) {
      return res
        .status(400)
        .json(
          errorFormat("the order do not have model", "order&model", "body")
        );
    }

    const card = await Card.create({
      code,
      order: orderID,
      model: modelID,
      quantity,
      details,
    });

    card.history.push({ state: "Created", date: currentTime() });
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
    const docs = await Card.find();

    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.getAll".bgYellow);
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
      .populate("tracking.stage", "name")
      .populate("tracking.employee", "name code")
      .populate("cardErrors.stage", "name")
      .populate("cardErrors.enteredBy", "name code")
      .populate("cardErrors.doneBy", "name code")
      .populate("cardErrors.verifiedBy", "name code");

    if (!doc) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    res.status(200).json({ data: doc });
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
  const { code, order: orderID, model: modelID, quantity, details } = req.body;

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
        model: modelID,
      });
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
    }

    let order, model;

    //order checks
    if (orderID) {
      if (!idCheck(orderID)) {
        return res
          .status(400)
          .json(errorFormat(orderID, "Invalid order id", "order", "body"));
      }
      order = await Order.findById(orderID);
      if (!order) {
        return res
          .status(404)
          .json(errorFormat(orderID, "No order with this id", "order", "body"));
      }
    }

    //model checks
    if (modelID) {
      if (!idCheck(modelID)) {
        return res
          .status(400)
          .json(errorFormat(modelID, "Invalid model id", "model", "body"));
      }
      model = await Model.findById(modelID);
      if (!model) {
        return res
          .status(404)
          .json(errorFormat(modelID, "No model with this id", "model", "body"));
      }
    }

    //check if the order have model
    if (order && model) {
      const orderModel = await Order.findOne({
        _id: orderID,
        "models.id": modelID,
      });
      if (!orderModel) {
        return res
          .status(400)
          .json(
            errorFormat("the order do not have model", "order&model", "body")
          );
      }
    } else if (order) {
      const orderModel = await Order.findOne({
        _id: orderID,
        "models.id": card.model,
      });
      if (!orderModel) {
        return res
          .status(400)
          .json(
            errorFormat("the order do not have model", "order&model", "body")
          );
      }
    } else if (model) {
      const orderModel = await Order.findOne({
        _id: card.order,
        "models.id": modelID,
      });
      if (!orderModel) {
        return res
          .status(400)
          .json(
            errorFormat("the order do not have model", "order&model", "body")
          );
      }
    }

    await Card.findByIdAndUpdate(id, {
      code,
      order: orderID,
      model: modelID,
      quantity,
      details,
    });

    card.history.push({ state: "Updated", date: currentTime() });
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
const addTracking = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, employee: employeeID } = req.body;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //stage check
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No Stage with this id", "stage", "body"));
    }

    //check if card.model have the givin stage
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

    //employee check
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

    const current = currentDate();

    const salary = await Salary.findOne({
      employee: employeeID,
      "date.month": current.month,
      "date.year": current.year,
    });

    //if salary exist then deal with the doc and if not exist create new one
    if (salary) {
      const workIndex = salary.work.findIndex(
        (obj) => obj.stage.toString() === stageID
      );

      console.log(workIndex);

      //update work array and total by card.quantity
      if (workIndex === -1) {
        salary.work.push({
          stage: stageID,
          quantity: card.quantity,
        });
      } else {
        salary.work[workIndex].quantity += card.quantity;
      }
      salary.total += card.quantity;
      await salary.save();
    } else {
      const salary = await Salary.create({
        employee: employeeID,
        date: {
          month: current.month,
          year: current.year,
        },
      });

      salary.work.push({
        stage: stageID,
        quantity: card.quantity,
      });

      salary.total += card.quantity;

      await salary.save();
    }

    card.tracking.push({
      stage: stageID,
      employee: employeeID,
      dateOut: currentTime(),
    });
    await card.save();

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
const removeTracking = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, employee: employeeID } = req.body;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //stage check
    const stage = await Stage.findById(stageID);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(stageID, "No Stage with this id", "stage", "body"));
    }

    //check if card.model have the givin stage
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

    //employee check
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

    //find tracking index
    const trackingIndex = card.tracking.findIndex(
      (obj) =>
        obj.employee.toString() === employeeID &&
        obj.stage.toString() === stageID
    );

    const current = currentDate();

    const salary = await Salary.findOne({
      employee: employeeID,
      "date.month": current.month,
      "date.year": current.year,
    });

    if (!salary) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This card did not assign by the givin employee",
            "employee",
            "body"
          )
        );
    }

    //find work index
    const workIndex = salary.work.findIndex(
      (obj) => obj.stage.toString() === stageID
    );

    if (workIndex === -1) {
      return res
        .status(404)
        .json(
          errorFormat(
            employeeID,
            "This card did not assign by the givin employee",
            "employee",
            "body"
          )
        );
    }

    //update salary.work and card.tracking
    salary.total -= card.quantity;
    salary.work.pull(salary.work[workIndex]._id);
    await salary.save();

    card.tracking.pull(card.tracking[trackingIndex]._id);
    await card.save();

    res.status(200).json({ msg: "Tracking removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addTracking".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/add
 */
const addError = async (req, res) => {
  const id = req.params.id;
  const cardErrors = req.body.cardErrors;

  try {
    //card check
    const card = await Card.findById(id);
    if (!card) {
      return res
        .status(404)
        .json(errorFormat(id, "No card with this id", "id", "params"));
    }

    //check loop
    for (let i = 0; i < cardErrors.length; i++) {
      const errors = [];

      for (let j = 0; j < cardErrors[i].length; j++) {
        //stage checks
        if (!idCheck(cardErrors[i][j].stage)) {
          return res
            .status(400)
            .json(
              errorFormat(
                cardErrors[i][j].stage,
                "Invalid stage id",
                `cardErrors[${i}][${j}].stage`,
                "body"
              )
            );
        }
        const stage = await Stage.findById(cardErrors[i][j].stage);
        if (!stage) {
          return res
            .status(404)
            .json(
              errorFormat(
                cardErrors[i][j].stage,
                "No stage with this id",
                `cardErrors[${i}][${j}].stage`,
                "body"
              )
            );
        }

        //check if array if exist before
        const exist = errors.findIndex(
          (obj) => obj.stage === cardErrors[i][j].stage
        );
        if (exist !== -1) {
          return res
            .status(400)
            .json(
              errorFormat(
                cardErrors[i][j].stage,
                "Repeated stage in the same item",
                `ardErrors[${i}][${j}].stage`,
                "body"
              )
            );
        }

        //check if card.model have the givin stage
        const modelStage = await Model.findOne({
          _id: card.model,
          "stages.id": cardErrors[i][j].stage,
        });
        if (!modelStage) {
          return res
            .status(400)
            .json(
              errorFormat(
                cardErrors[i][j].stage,
                "This stage does not exist in card model",
                `cardErrors[${i}][${j}].stage`,
                "body"
              )
            );
        }

        //user checks
        if (!idCheck(cardErrors[i][j].enteredBy)) {
          return res
            .status(400)
            .json(
              errorFormat(
                cardErrors[i][j].enteredBy,
                "Invalid enteredBy id",
                `cardErrors[${i}][${j}].enteredBy`,
                "body"
              )
            );
        }
        const user = await User.findById(cardErrors[i][j].enteredBy);
        if (!user) {
          return res
            .status(404)
            .json(
              errorFormat(
                cardErrors[i][j].enteredBy,
                "No user with this id",
                `cardErrors[${i}][${j}].enteredBy`,
                "body"
              )
            );
        }
        const userEmployee = await UserEmployee.findOne({
          user: cardErrors[i][j].enteredBy,
        });
        if (!userEmployee) {
          return res
            .status(404)
            .json(
              errorFormat(
                cardErrors[i][j].enteredBy,
                "No 'UserEmployee' doc for this user",
                `cardErrors[${i}][${j}].enteredBy`,
                "body"
              )
            );
        }
        const employee = await Employee.findById(userEmployee.employee);
        if (!employee) {
          return res
            .status(404)
            .json(
              cardErrors[i][j].enteredBy,
              "No 'Employee' doc with this id",
              `cardErrors[${i}][${j}].enteredBy`,
              "body"
            );
        }

        errors.push({
          stage: cardErrors[i][j].stage,
          description: cardErrors[i][j].description,
          dateIn: currentTime(),
          enteredBy: employee._id.toString(),
          dateOut: null,
          doneBy: null,
          verifiedBy: null,
        });

        //reduce salary for employee
        const stageIndex = card.tracking.findIndex(
          (obj) => obj.stage.toString() === cardErrors[i][j].stage
        );
        if (stageIndex === -1) {
          return res
            .status(404)
            .json(
              errorFormat(
                cardErrors[i][j].stage,
                "This stage did not added to tracking array",
                `cardErrors[${i}][${j}].stage`,
                "body"
              )
            );
        }

        const current = currentDate();

        const salary = await Salary.findOne({
          employee: card.tracking[stageIndex].employee,
          "date.year": current.year,
          "date.month": current.month,
        });
        if (!salary) {
          return res
            .status(404)
            .json(
              errorFormat(
                card.tracking[stageIndex].employee,
                "No 'Salary' doc for this id",
                `card.tracking[${stageIndex}].employee`,
                "others"
              )
            );
        }

        //find stage index in work array
        const workIndex = salary.work.findIndex(
          (obj) => obj.stage.toString() === cardErrors[i][j].stage
        );
        if (workIndex === -1) {
          return res
            .status(400)
            .json(
              errorFormat(
                cardErrors[i][j].stage,
                "this stage does not exist in salary work array",
                `cardErrors[${i}][${j}].stage`,
                "body"
              )
            );
        }
      }
    }

    // modify loop
    for (let i = 0; i < cardErrors.length; i++) {
      const errors = [];

      for (let j = 0; j < cardErrors[i].length; j++) {
        const userEmployee = await UserEmployee.findOne({
          user: cardErrors[i][j].enteredBy,
        });
        const employee = await Employee.findById(userEmployee.employee);

        errors.push({
          stage: cardErrors[i][j].stage,
          description: cardErrors[i][j].description,
          dateIn: currentTime(),
          enteredBy: employee._id.toString(),
          dateOut: null,
          doneBy: null,
          verifiedBy: null,
        });

        //reduce salary for employee
        const stageIndex = card.tracking.findIndex(
          (obj) => obj.stage.toString() === cardErrors[i][j].stage
        );

        const current = currentDate();

        const salary = await Salary.findOne({
          employee: card.tracking[stageIndex].employee,
          "date.year": current.year,
          "date.month": current.month,
        });

        //find stage index in work array
        const workIndex = salary.work.findIndex(
          (obj) => obj.stage.toString() === cardErrors[i][j].stage
        );
        salary.work[workIndex].quantity -= 1;
        salary.total -= 1;
        await salary.save();
      }

      card.cardErrors.push(errors);
    }

    await card.save();

    res.status(200).json({ msg: "Errors added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.addError".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/card/:id/errors/confirm
 */
const confirmError = async (req, res) => {
  const id = req.params.id;
  const { stage: stageID, doneBy, verifiedBy } = req.body;

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

    //check if card.model have the givin stage
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

    //doneBy employee check
    if (!idCheck(doneBy)) {
      return res
        .status(400)
        .json(errorFormat(doneBy, "Invalid doneBy id", "doneBy", "body"));
    }
    const employee = await Employee.findById(doneBy);
    if (!employee) {
      return res
        .status(404)
        .json(
          errorFormat(doneBy, "No employee with this id", "doneBy", "body")
        );
    }

    //verifiedBy checks
    if (!idCheck(verifiedBy)) {
      return res
        .status(400)
        .json(
          errorFormat(verifiedBy, "Invalid verifiedBy id", "verifiedBy", "body")
        );
    }
    const user = await User.findById(verifiedBy);
    if (!user) {
      return res
        .status(404)
        .json(
          errorFormat(verifiedBy, "No user with this id", "verifiedBy", "body")
        );
    }
    const userEmployee = await UserEmployee.findOne({ user: verifiedBy });
    if (!userEmployee) {
      return res
        .status(404)
        .json(
          errorFormat(
            verifiedBy,
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
            verifiedBy,
            "No employee doc related to this user",
            "verifiedBy",
            "body"
          )
        );
    }

    for (let i = 0; i < card.cardErrors.length; i++) {
      const index = card.cardErrors[i].findIndex(
        (obj) => obj.stage.toString() === stageID
      );

      //if stage not exist || stage has been verified
      if (index === -1 || card.cardErrors[i][index].verifiedBy) {
        continue;
      }

      //update error
      card.cardErrors[i][index].verifiedBy = verifiedByEmployee._id;
      card.cardErrors[i][index].doneBy = employee._id;
      card.cardErrors[i][index].dateOut = currentTime();

      const current = currentDate();

      const salary = await Salary.findOne({
        employee: employee._id,
        "date.year": current.year,
        "date.month": current.month,
      });
      if (!salary) {
        const newSalary = await Salary.create({
          employee: employee._id,
          date: {
            month: current.month,
            year: current.year,
          },
        });

        newSalary.work.push({ stage: stageID, quantity: 1 });
        newSalary.total = 1;
        await newSalary.save();
      } else {
        const workIndex = salary.work.findIndex(
          (obj) => obj.stage.toString() === stageID
        );

        if (workIndex === -1) {
          salary.work.push({ stage: stageID, quantity: 1 });
        } else {
          salary.work[workIndex].quantity += 1;
        }
        salary.total += 1;

        await salary.save();
      }
    }
    await card.save();

    res.status(200).json({ msg: "Error confirmed for this stage tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "card.confirmError".bgYellow);
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
  removeTracking,
  addError,
  confirmError,
};
