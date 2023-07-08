const { Stage, MachineType, Salary } = require("../models");
const { errorFormat, idCheck, currentTime } = require("../utils");

/*
 * method: POST
 * path: /api/stage/
 */

const create = async (req, res) => {
  const {
    name,
    type,
    code,
    rate,
    price,
    image,
    note,
    machineType: machineTypeID,
    stageErrors,
  } = req.body;

  try {
    const machineType = await MachineType.findById(machineTypeID);
    if (!machineType) {
      return res
        .status(400)
        .json(
          errorFormat(
            machineTypeID,
            "No machine type with this id",
            "machineType",
            "body"
          )
        );
    }

    const stage = await Stage.create({
      name,
      code,
      type,
      rate,
      price,
      note,
      machineType: machineTypeID,
      stageErrors,
    });

    res.status(201).json({ data: stage });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stage.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/stage/
 */
const getAll = async (req, res) => {
  try {
    const stages = await Stage.find().populate("machineType", "name");

    res.status(200).json({ data: stages });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stage.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/stage/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const stage = await Stage.findById(id).populate("machineType", "name");

    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(id, "No stage with this id", "id", "header"));
    }

    res.status(200).json({ data: stage });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stage.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/stage/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    type,
    code,
    rate,
    price,
    image,
    note,
    machineType: machineTypeID,
    stageErrors,
  } = req.body;

  try {
    if (machineTypeID) {
      if (!idCheck(machineTypeID)) {
        return res
          .status(400)
          .json(
            errorFormat(
              machineTypeID,
              "Invalid machineType id",
              "machineType",
              "body"
            )
          );
      }

      const machineType = await MachineType.findById(machineTypeID);
      if (!machineType) {
        return res
          .status(404)
          .json(
            errorFormat(
              machineTypeID,
              "No machine type with this id",
              "machineType",
              "body"
            )
          );
      }
    }

    const stage = await Stage.findById(id);
    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(id, "No stage with this id", "id", "header"));
    }

    await Stage.findByIdAndUpdate(id, {
      name,
      type,
      code,
      rate,
      price,
      note,
      machineType: machineTypeID,
      stageErrors,
    });

    const current = currentTime();

    if (price !== stage.price) {
      await Salary.updateMany(
        {
          "date.month": current.getMonth() + 1,
          "date.year": current.getFullYear(),
        },
        { totalCost: -1, todayCost: -1 }
      );
    }

    res.status(200).json({ msg: "stage updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stage.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/stage/:id
 */

const deleteOne = async (req, res) => {
  const id = req.params.id;

  try {
    const stage = await Stage.findByIdAndDelete(id);

    if (!stage) {
      return res
        .status(404)
        .json(errorFormat(id, "No stage with this id", "id", "header"));
    }

    res.status(200).json({ msg: "stage deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "stage.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, deleteOne };
