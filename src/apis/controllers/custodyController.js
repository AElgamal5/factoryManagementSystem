const {
  Custody,
  Role,
  SupplierCustody,
  BuyRequest,
  Image,
} = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/custody/
 */
const create = async (req, res) => {
  const { name, details, image, unit, max, min, role: roleID, note } = req.body;

  try {
    //check role validity & existence
    if (!idCheck(roleID)) {
      return res
        .status(400)
        .json(errorFormat(roleID, "Role id is invalid", "role", "body"));
    }
    const role = await Role.findById(roleID);
    if (!role) {
      return res
        .status(404)
        .json(errorFormat(roleID, "No role with this id", "role", "body"));
    }

    //image checks
    let imageDocID;
    if (image) {
      imageDocID = (await Image.create({ data: image }))._id;
    }

    const custody = await Custody.create({
      name,
      // quantity: 0,
      // available: 0,
      details,
      unit,
      role: roleID,
      note,
      max,
      min,
      image: imageDocID,
    });

    res.status(201).json({ data: custody });
  } catch (error) {
    console.log("Error is in: ".bgRed, "custody.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custody/
 */
const getAll = async (req, res) => {
  try {
    const custodies = await Custody.find({}).populate("role");

    res.status(200).json({ data: custodies });
  } catch (error) {
    console.log("Error is in: ".bgRed, "custody.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custody/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const custody = await Custody.findById(id)
      .populate("role")
      .populate("image");

    //check if exist
    if (!custody) {
      return res
        .status(404)
        .json(errorFormat(id, "No custody with this id", "id", "params"));
    }

    res.status(200).json({ data: custody });
  } catch (error) {
    console.log("Error is in: ".bgRed, "custody.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/custody/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const {
    name,
    details,
    image,
    unit,
    max,
    min,
    role: roleID,
    note,
    quantity,
    available,
  } = req.body;

  try {
    const custody = await Custody.findById(id);

    //check if custody exist
    if (!custody) {
      return res
        .status(404)
        .json(errorFormat(id, "No custody with this id", "id", "params"));
    }

    //check role validity & existence
    if (roleID) {
      if (!idCheck(roleID)) {
        return res
          .status(400)
          .json(errorFormat(roleID, "Role id is invalid", "role", "body"));
      }
      const role = await Role.findById(roleID);
      if (!role) {
        return res
          .status(404)
          .json(errorFormat(roleID, "No role with this id", "role", "body"));
      }
    }

    let imageDocID;
    if (image) {
      const exist = await Image.findById(custody.image);
      if (exist) {
        await Image.findByIdAndDelete(custody.image);
      }
      imageDocID = (await Image.create({ data: image }))._id;
    }

    await Custody.findByIdAndUpdate(id, {
      name,
      quantity,
      available,
      details,
      unit,
      role: roleID,
      note,
      max,
      min,
      image: imageDocID,
    });

    res.status(200).json({ msg: "Custody updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "custody.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .status(404)
        .json(errorFormat(id, "No custody with this id", "id", "params"));
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
    console.log("Error is in: ".bgRed, "custody.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custody/supplier/brief/:sid
 */
const getCustodiesBySupplierID = async (req, res) => {
  const sid = req.params.sid;

  try {
    if (!idCheck(sid)) {
      return res
        .status(400)
        .json(errorFormat(sid, "Not valid supplier id", "sid", "params"));
    }

    const custodies = await SupplierCustody.find({ supplier: sid }).populate(
      "custody",
      "name"
    );

    res.status(200).json({ data: custodies });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "custody.getCustodiesBySupplierID".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/custody/supplier/:sid
 */
const getCustodiesBySupplierIDInDetails = async (req, res) => {
  const sid = req.params.sid;

  try {
    if (!idCheck(sid)) {
      return res
        .status(400)
        .json(errorFormat(sid, "Not valid supplier id", "sid", "params"));
    }

    const custodies = await BuyRequest.find({
      "custodies.supplier": sid,
    }).select("name history custodies");

    res.status(200).json({ data: custodies });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "custody.getCustodiesBySupplierIDInDetails".bgYellow
    );
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  update,
  deleteOne,
  getCustodiesBySupplierID,
  getCustodiesBySupplierIDInDetails,
};
