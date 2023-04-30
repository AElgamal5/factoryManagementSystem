const { Supplier } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/supplier/
 */
const create = async (req, res) => {
  const { name, phoneNo, address, state, note } = req.body;

  try {
    const supplier = await Supplier.create({
      name,
      phoneNo,
      address,
      state,
      note,
    });
    res.status(201).json({ data: supplier });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/supplier/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;

  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res
        .status(400)
        .json(errorFormat(id, "No supplier with this id", "id", "header"));
    }
    res.status(200).json({ data: supplier });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/supplier/
 */
const getAll = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.status(200).json({ data: suppliers });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/supplier/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, phoneNo, address, state, note } = req.body;
  try {
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res
        .status(400)
        .json(errorFormat(id, "No supplier with this id", "id", "header"));
    }

    //update the supplier
    await Supplier.findByIdAndUpdate(id, {
      name,
      phoneNo,
      address,
      state,
      note,
    });

    res.status(200).json({ msg: "Supplier is updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "update".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/supplier/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const supplier = await Supplier.findByIdAndDelete(id);
    if (!supplier) {
      return res
        .status(400)
        .json(errorFormat(id, "No supplier with this id", "id", "header"));
    }

    res.status(200).json({ msg: "Supplier deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

module.exports = { create, getByID, getAll, update, deleteOne };
