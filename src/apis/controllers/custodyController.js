const { Custody } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/custody/
 */
const create = async (req, res) => {
  const { name, details, image, unit, role, note } = req.body;

  try {
    const custody = await Custody.create({
      name,
      // quantity: 0,
      // available: 0,
      details,
      unit,
      role,
      note,
    });

    res.status(201).json({ data: custody });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custody/
 */
const getAll = async (req, res) => {
  try {
    const custodies = await Custody.find();
    res.status(200).json({ data: custodies });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custody/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const custody = await Custody.findById(id);

    //check if exist
    if (!custody) {
      return res
        .status(400)
        .json(errorFormat(id, "No custody with this id", "id", "header"));
    }

    res.status(200).json({ data: custody });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/custody/:id
 */
const update = async (req, res) => {
  const id = req.params.id;

  const { name, quantity, available, details, image, unit, role, note } =
    req.body;

  try {
    const custody = await Custody.findByIdAndUpdate(id, {
      name,
      quantity,
      available,
      details,
      unit,
      role,
      note,
    });

    //check if custody exist
    if (!custody) {
      return res
        .status(400)
        .json(errorFormat(id, "No custody with this id", "id", "header"));
    }

    res.status(200).json({ msg: "Custody updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/custody/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const custody = await Custody.findByIdAndDelete(id);

    //check if exist
    if (!custody) {
      return res
        .status(400)
        .json(errorFormat(id, "No custody with this id", "id", "header"));
    }

    //delete all custodyEmployee with this id
    // await CustodyEmployee.deleteMany({ "custody.id": id });

    //delete all custodies in employee with given id
    // await Employee.updateMany(
    //   { "custodies.id": id },
    //   { $pull: { custodies: { id: id } } }
    // );

    res.status(200).json({ msg: "Custody deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  update,
  deleteOne,
};
