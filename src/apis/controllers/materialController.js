const {
  Material,
  Role,
  MaterialType,
  SupplierMaterial,
  BuyRequest,
} = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/material/
 */
const create = async (req, res) => {
  const {
    name,
    details,
    type: typeID,
    image,
    unit,
    role: roleID,
    note,
    max,
    min,
  } = req.body;

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

    //check type validity & existence
    if (!idCheck(typeID)) {
      return res
        .status(400)
        .json(errorFormat(typeID, "Type id is invalid", "type", "body"));
    }
    const type = await MaterialType.findById(typeID);
    if (!type) {
      return res
        .status(404)
        .json(
          errorFormat(typeID, "No martial type with this id", "role", "body")
        );
    }

    const material = await Material.create({
      name,
      details,
      unit,
      type: typeID,
      role: roleID,
      note,
      max,
      min,
    });

    res.status(201).json({ data: material });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.create".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/
 */
const getAll = async (req, res) => {
  try {
    const materials = await Material.find({}).populate(["role", "type"]);

    res.status(200).json({ data: materials });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.getAll".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const material = await Material.findById(id).populate(["role", "type"]);

    //check if exist
    if (!material) {
      return res
        .status(404)
        .json(errorFormat(id, "No material with this id", "id", "params"));
    }

    res.status(200).json({ data: material });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.getByID".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/material/:id
 */
const update = async (req, res) => {
  const id = req.params.id;

  const {
    name,
    quantity,
    available,
    details,
    image,
    unit,
    type: typeID,
    role: roleID,
    note,
    max,
    min,
  } = req.body;

  try {
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

    //check type validity & existence
    if (typeID) {
      if (!idCheck(typeID)) {
        return res
          .status(400)
          .json(errorFormat(typeID, "Type id is invalid", "type", "body"));
      }
      const type = await MaterialType.findById(typeID);
      if (!type) {
        return res
          .status(404)
          .json(
            errorFormat(typeID, "No martial type with this id", "role", "body")
          );
      }
    }

    const material = await Material.findByIdAndUpdate(id, {
      name,
      quantity,
      available,
      details,
      unit,
      type: typeID,
      role: roleID,
      note,
      max,
      min,
    });

    //check if material exist
    if (!material) {
      return res
        .status(404)
        .json(errorFormat(id, "No material with this id", "id", "params"));
    }

    res.status(200).json({ msg: "material updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.update".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/material/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const material = await Material.findByIdAndDelete(id);

    //check if exist
    if (!material) {
      return res
        .status(404)
        .json(errorFormat(id, "No material with this id", "id", "params"));
    }

    res.status(200).json({ msg: "material deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.deleteOne".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/types/all
 */
const getAllTypes = async (req, res) => {
  try {
    const types = await Material.distinct("type");

    res.status(200).json({ data: types });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.getAllTypes".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/types/:type
 */
const getByType = async (req, res) => {
  const typeID = req.params.type;
  try {
    //check type validity & existence
    if (!idCheck(typeID)) {
      return res
        .status(400)
        .json(errorFormat(typeID, "Type id is invalid", "type", "body"));
    }
    const type = await MaterialType.findById(typeID);
    if (!type) {
      return res
        .status(404)
        .json(
          errorFormat(typeID, "No martial type with this id", "role", "body")
        );
    }

    const materials = await Material.find({ type: typeID }).populate([
      "role",
      "type",
    ]);
    res.status(200).json({ data: materials });
  } catch (error) {
    console.log("Error is in: ".bgRed, "material.getByType".bgYellow);
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/supplier/brief/:sid
 */
const getMaterialsBySupplierID = async (req, res) => {
  const sid = req.params.sid;

  try {
    if (!idCheck(sid)) {
      return res
        .status(400)
        .json(errorFormat(sid, "Not valid supplier id", "sid", "params"));
    }

    const custodies = await SupplierMaterial.find({ supplier: sid }).populate(
      "material",
      "name"
    );

    res.status(200).json({ data: custodies });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "material.getMaterialsBySupplierID".bgYellow
    );
    !+process.env.PRODUCTION && console.log(error);
  }
};

/*
 * method: GET
 * path: /api/material/supplier/:sid
 */
const getMaterialsBySupplierIDInDetails = async (req, res) => {
  const sid = req.params.sid;

  try {
    if (!idCheck(sid)) {
      return res
        .status(400)
        .json(errorFormat(sid, "Not valid supplier id", "sid", "params"));
    }

    const materials = await BuyRequest.find({
      "materials.supplier": sid,
    }).select("name history materials");

    res.status(200).json({ data: materials });
  } catch (error) {
    console.log(
      "Error is in: ".bgRed,
      "material.getMaterialsBySupplierIDInDetails".bgYellow
    );
    !+process.env.PRODUCTION && console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  update,
  deleteOne,
  getAllTypes,
  getByType,
  getMaterialsBySupplierID,
  getMaterialsBySupplierIDInDetails,
};
