const {
  BuyRequest,
  Supplier,
  Material,
  Custody,
  SupplierCustody,
  SupplierMaterial,
} = require("../models");
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
    console.log("Error is in: ".bgRed, "buyRequest.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/buyRequest/
 */
const getAll = async (req, res) => {
  try {
    const buyRequests = await BuyRequest.find();

    res.status(200).json({ data: buyRequests });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/buyRequest/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const buyRequest = await BuyRequest.findById(id, {})
      .populate("materials.id", "_id name")
      .populate("materials.supplier", "_id name")
      .populate("custodies.id", "_id name")
      .populate("custodies.supplier", "_id name");

    //check if exist
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    res.status(200).json({ data: buyRequest });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Buy request deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Buy request updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.updateProfile".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
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
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    for (let i = 0; i < materials.length; i++) {
      let supplierID = materials[i].supplier;
      let materialID = materials[i].material;

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
          .status(404)
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
          .status(404)
          .json(
            errorFormat(
              materialID,
              "No material with this ID",
              "material",
              "body"
            )
          );
      }

      //quantity and price
      if (
        typeof materials[i].quantity !== "number" ||
        materials[i].quantity <= 0
      ) {
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

      if (typeof materials[i].price !== "number" || materials[i].price <= 0) {
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

      buyRequest.materials.push({
        supplier: supplier._id,
        id: material._id,
        quantity: materials[i].quantity,
        price: materials[i].price,
      });
    }

    buyRequest.history.push({
      state: "Materials Added",
      date: new Date(currentTime()),
    });

    await buyRequest.save();
    res.status(200).json({ msg: "materials added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.addMaterials".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/custodies/add/:id
 */
const addCustodies = async (req, res) => {
  const id = req.params.id;
  const custodies = req.body.custodies;

  try {
    const buyRequest = await BuyRequest.findById(id);
    //check if exist
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    for (let i = 0; i < custodies.length; i++) {
      let supplierID = custodies[i].supplier;
      let custodyID = custodies[i].custody;

      //check id validity
      if (!idCheck(supplierID)) {
        return res
          .status(400)
          .json(
            errorFormat(supplierID, "supplierID is invalid", "supplier", "body")
          );
      }
      if (!idCheck(custodyID)) {
        return res
          .status(400)
          .json(
            errorFormat(custodyID, "custodyID is invalid", "custody", "body")
          );
      }

      //check if the docs
      let supplier = await Supplier.findById(supplierID);
      if (!supplier) {
        return res
          .status(404)
          .json(
            errorFormat(
              supplierID,
              "No supplier with this id",
              "supplier",
              "body"
            )
          );
      }
      let custody = await Custody.findById(custodyID);
      if (!custody) {
        return res
          .status(404)
          .json(
            errorFormat(custodyID, "No custody with this ID", "custody", "body")
          );
      }

      //quantity and price
      if (
        typeof custodies[i].quantity !== "number" ||
        custodies[i].quantity <= 0
      ) {
        return res
          .status(400)
          .json(
            errorFormat(
              custodies[i].quantity,
              "custody.quantity should be number and greater than 0",
              "quantity",
              "body"
            )
          );
      }
      if (typeof custodies[i].price !== "number" || custodies[i].price <= 0) {
        return res
          .status(400)
          .json(
            errorFormat(
              custodies[i].price,
              "custody.price should be number and greater than 0",
              "price",
              "body"
            )
          );
      }

      buyRequest.custodies.push({
        supplier: supplier._id,
        id: custody._id,
        quantity: custodies[i].quantity,
        price: custodies[i].price,
      });
    }

    buyRequest.history.push({
      state: "Custodies Added",
      date: new Date(currentTime()),
    });

    await buyRequest.save();
    res.status(200).json({ msg: "custodies added tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.addCustodies".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/materials/remove/:id
 */
const removeMaterials = async (req, res) => {
  const id = req.params.id;
  const materials = req.body.materials;

  try {
    const buyRequest = await BuyRequest.findById(id);
    //check if exist
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    for (let i = 0; i < materials.length; i++) {
      let id = materials[i];
      buyRequest.materials.pull({ _id: id });
    }

    buyRequest.history.push({
      state: "Materials removed",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(200).json({ msg: "materials removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.removeMaterials".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/custodies/remove/:id
 */
const removeCustodies = async (req, res) => {
  const id = req.params.id;
  const custodies = req.body.custodies;

  try {
    const buyRequest = await BuyRequest.findById(id);
    //check if exist
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    for (let i = 0; i < custodies.length; i++) {
      let id = custodies[i];
      buyRequest.custodies.pull({ _id: id });
    }

    buyRequest.history.push({
      state: "Custodies removed",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(200).json({ msg: "custodies removed tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.removeCustodies".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/approve/:id
 */
const approve = async (req, res) => {
  const id = req.params.id;

  try {
    const buyRequest = await BuyRequest.findById(id);

    //check if exist
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }
    let approved = false;

    for (let i = 0; i < buyRequest.history.length; i++) {
      if (buyRequest.history[i].state === "Approved") {
        approved = true;
        break;
      }
    }

    if (approved) {
      return res
        .status(400)
        .json(
          errorFormat(
            "Approved",
            "This buyRequest is already approved",
            "buyRequest.history[i].state",
            "others"
          )
        );
    }

    buyRequest.history.push({
      state: "Approved",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(200).json({ msg: "Buy request approved tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.approve".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/delivered/:id
 */
const delivered = async (req, res) => {
  const id = req.params.id;

  try {
    const buyRequest = await BuyRequest.findById(id);

    //check existence
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    //check if Approved || Delivered
    let approved = false;
    let delivered = false;
    for (let i = 0; i < buyRequest.history.length; i++) {
      if (buyRequest.history[i].state === "Approved") {
        approved = true;
      }
      if (buyRequest.history[i].state === "Delivered") {
        delivered = true;
      }
    }
    if (!approved) {
      return res
        .status(400)
        .json(errorFormat(false, "Can not deliver a not approved buy request"));
    }
    if (delivered) {
      return res
        .status(400)
        .json(errorFormat(false, "This buy request is already delivered"));
    }

    buyRequest.history.push({
      state: "Delivered",
      date: new Date(currentTime()),
    });

    //update/create SupplierCustody/SupplierMaterial
    for (let i = 0; i < buyRequest.custodies.length; i++) {
      //check current element state
      if (buyRequest.custodies[i].done) {
        continue;
      }

      //check price
      if (!buyRequest.custodies[i].price) {
        return res
          .status(404)
          .json(
            errorFormat(
              buyRequest.custodies[i].price,
              "Material's price is required",
              `buyRequest.custodies[${i}].price`,
              "other"
            )
          );
      }

      //check supplier
      if (!buyRequest.custodies[i].supplier) {
        return res
          .status(404)
          .json(
            errorFormat(
              buyRequest.custodies[i].supplier,
              "Material's supplier is required",
              `buyRequest.custodies[${i}].supplier`,
              "other"
            )
          );
      }

      let supplierCustody = await SupplierCustody.findOne({
        supplier: buyRequest.custodies[i].supplier,
        custody: buyRequest.custodies[i].id,
      });

      //create new doc if not exist
      if (!supplierCustody) {
        supplierCustody = await SupplierCustody.create({
          supplier: buyRequest.custodies[i].supplier,
          custody: buyRequest.custodies[i].id,
        });
      }

      //update supplierCustody
      supplierCustody.lastQuantity = buyRequest.custodies[i].quantity;
      supplierCustody.totalQuantity += +buyRequest.custodies[i].quantity;
      supplierCustody.lastPrice = +buyRequest.custodies[i].price;
      supplierCustody.totalCost +=
        +buyRequest.custodies[i].price * buyRequest.custodies[i].quantity;

      await supplierCustody.save();

      //update custody
      const custody = await Custody.findById(buyRequest.custodies[i].id);
      if (!custody) {
        return res
          .status(404)
          .json(
            errorFormat(
              buyRequest.custodies[i].id,
              "No custody with this ID",
              "buyRequest.custodies[i].id",
              "other"
            )
          );
      }

      custody.quantity += buyRequest.custodies[i].quantity;
      custody.available += buyRequest.custodies[i].quantity;

      //update state of current element
      buyRequest.custodies[i].done = true;

      await custody.save();
    }

    for (let i = 0; i < buyRequest.materials.length; i++) {
      //check current element state
      if (buyRequest.materials[i].done) {
        continue;
      }

      let supplierMaterial = await SupplierMaterial.findOne({
        supplier: buyRequest.materials[i].supplier,
        material: buyRequest.materials[i].id,
      });

      //create new doc if not exist
      if (!supplierMaterial) {
        supplierMaterial = await SupplierMaterial.create({
          supplier: buyRequest.materials[i].supplier,
          material: buyRequest.materials[i].id,
        });
      }

      //update supplierMaterial
      supplierMaterial.lastQuantity = +buyRequest.materials[i].quantity;
      supplierMaterial.totalQuantity += +buyRequest.materials[i].quantity;
      supplierMaterial.lastPrice = +buyRequest.materials[i].price;
      supplierMaterial.totalCost +=
        +buyRequest.materials[i].price * +buyRequest.materials[i].quantity;

      await supplierMaterial.save();

      //update material
      const material = await Material.findById(buyRequest.materials[i].id);
      if (!material) {
        return res
          .status(404)
          .json(
            errorFormat(
              buyRequest.materials[i].id,
              "No material with this ID",
              "buyRequest.materials[i].id",
              "other"
            )
          );
      }

      material.quantity += buyRequest.materials[i].quantity;
      material.available += buyRequest.materials[i].quantity;

      //update state of current element
      buyRequest.materials[i].done = true;

      await material.save();
    }

    await buyRequest.save();

    res.status(200).json({ msg: "Buy request delivered tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.delivered".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/materials/update/:id
 */
const updateMaterials = async (req, res) => {
  const id = req.params.id;

  const materials = req.body.materials;

  try {
    const buyRequest = await BuyRequest.findById(id);

    //check existence
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    //empty materials array
    buyRequest.materials = [];

    for (let i = 0; i < materials.length; i++) {
      const material = await Material.findById(materials[i].material);
      if (!material) {
        return res
          .status(404)
          .json(
            errorFormat(
              materials[i].material,
              "No material with this id",
              `materials[${i}].material`,
              "body"
            )
          );
      }

      let supplier;
      if (materials[i].supplier) {
        supplier = await Supplier.findById(materials[i].supplier);
        if (!supplier) {
          return res
            .status(404)
            .json(
              errorFormat(
                materials[i].supplier,
                "No supplier with this id",
                "materials[i].supplier",
                "body"
              )
            );
        }
      }

      buyRequest.materials.push({
        id: material._id,
        quantity: materials[i].quantity,
        supplier: supplier ? supplier._id : null,
        price: materials[i].price || null,
      });
    }

    buyRequest.history.push({
      state: "Materials updated",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(200).json({ msg: "Buy request materials updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.updateMaterials".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/buyRequest/custody/update/:id
 */
const updateCustodies = async (req, res) => {
  const id = req.params.id;

  const custodies = req.body.custodies;

  try {
    const buyRequest = await BuyRequest.findById(id);

    //check existence
    if (!buyRequest) {
      return res
        .status(404)
        .json(errorFormat(id, "No buy request with this id", "id", "params"));
    }

    //empty custodies array
    buyRequest.custodies = [];

    for (let i = 0; i < custodies.length; i++) {
      const custody = await Custody.findById(custodies[i].custody);
      if (!custody) {
        return res
          .status(404)
          .json(
            errorFormat(
              custodies[i].custody,
              "No custody with this id",
              `custodies[${i}].custody`,
              "body"
            )
          );
      }

      let supplier;
      if (custodies[i].supplier) {
        supplier = await Supplier.findById(custodies[i].supplier);
        if (!supplier) {
          return res
            .status(404)
            .json(
              errorFormat(
                custodies[i].supplier,
                "No supplier with this id",
                `custodies[${i}].supplier`,
                "body"
              )
            );
        }
      }

      buyRequest.custodies.push({
        id: custody._id,
        quantity: custodies[i].quantity,
        supplier: supplier ? supplier._id : null,
        price: custodies[i].price || null,
      });
    }

    buyRequest.history.push({
      state: "Custodies updated",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(200).json({ msg: "Buy request custodies updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "buyRequest.updateCustodies".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = {
  create,
  getAll,
  getByID,
  deleteOne,
  updateProfile,
  addMaterials,
  addCustodies,
  removeMaterials,
  removeCustodies,
  approve,
  delivered,
  updateMaterials,
  updateCustodies,
};
