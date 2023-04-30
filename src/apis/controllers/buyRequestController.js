const { BuyRequest, Supplier, Material } = require("../models");
const { currentTime, errorFormat, idCheck } = require("../utils");

/*
 * method: POST
 * path: /api/buyRequest/
 */
const create = async (req, res) => {
  const { name, details, note } = req.body;

  try {
    const buyRequest = await BuyRequest.create({ name, details, note });

    buyRequest.history.push({
      state: "Not approved",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(201).json({ data: buyRequest });
  } catch (error) {
    console.log("Error is in: ".bgRed, "create".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/buyRequest/
 */
const getAll = async (req, res) => {
  try {
    const buyRequests = await BuyRequest.find();
    res.status(201).json({ data: buyRequests });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getAll".bgYellow);
    console.log(error);
  }
};

/*
 * method: GET
 * path: /api/buyRequest/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const buyRequest = await BuyRequest.findById(id);
    //check if exist
    if (!buyRequest) {
      return res
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
    }

    res.status(200).json({ data: buyRequest });
  } catch (error) {
    console.log("Error is in: ".bgRed, "getByID".bgYellow);
    console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/buyRequest/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const buyRequest = await BuyRequest.findByIdAndDelete(id);
    //check if exist
    if (!buyRequest) {
      return res
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
    }

    res.status(200).json({ msg: "Buy request deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "deleteOne".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/:id
 */
const updateProfile = async (req, res) => {
  const id = req.params.id;

  const { name, details, note } = req.body;

  try {
    const buyRequest = await BuyRequest.findByIdAndUpdate(id, {
      name,
      details,
      note,
    });

    //check if exist
    if (!buyRequest) {
      return res
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
    }

    res.status(200).json({ msg: "Buy request updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "updateProfile".bgYellow);
    console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/materials/add/:id
 */

const addMaterials = async (req, res) => {
  const id = req.params.id;
  const materials = req.body.materials;

  try {
    const buyRequest = await BuyRequest.findById(id);
    //check if exist
    if (!buyRequest) {
      return res
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
    }

    materials.forEach(async (mat) => {
      let supplierID = material.supplier;
      let materialID = material.material;

      //check id validity
      if (!idCheck(supplierID)) {
        return res
          .status(400)
          .json(
            errorFormat(supplierID, "supplierID is invalid", "supplier", "body")
          );
      }
      if (!idCheck(materialID)) {
        return res
          .status(400)
          .json(
            errorFormat(materialID, "materialID is invalid", "material", "body")
          );
      }

      //check if the docs
      let supplier = await Supplier.findById(supplierID);
      if (!supplier) {
        return res
          .status(400)
          .json(
            errorFormat(
              supplierID,
              "No supplier with this id",
              "supplier",
              "body"
            )
          );
      }
      let material = await Material.findById(materialID);
      if (!material) {
        return res
          .status(400)
          .json(
            errorFormat(
              materialID,
              "No material with this ID",
              "material",
              "body"
            )
          );
      }

      if (typeof +material.quantity !== "number" || +material.quantity < 0) {
        return res
          .status(400)
          .json(
            errorFormat(
              material.quantity,
              "material.quantity should be number and greater than 0",
              "quantity",
              "body"
            )
          );
      }

      if (typeof +material.price !== "number" || +material.price < 0) {
        return res
          .status(400)
          .json(
            errorFormat(
              material.price,
              "material.price should be number and greater than 0",
              "price",
              "body"
            )
          );
      }

      res.send("tmam");
    });
  } catch (error) {
    console.log("Error is in: ".bgRed, "addMaterials".bgYellow);
    console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  deleteOne,
  updateProfile,
  addMaterials,
};
