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
    console.log("Error is in: ".bgRed, "addMaterials".bgYellow);
    console.log(error);
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
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
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
      let custody = await Custody.findById(custodyID);
      if (!custody) {
        return res
          .status(400)
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
    console.log("Error is in: ".bgRed, "addCustodies".bgYellow);
    console.log(error);
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
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
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
    console.log("Error is in: ".bgRed, "removeMaterials".bgYellow);
    console.log(error);
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
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
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
    console.log("Error is in: ".bgRed, "removeCustodies".bgYellow);
    console.log(error);
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
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
    }

    buyRequest.history.push({
      state: "Approved",
      date: new Date(currentTime()),
    });

    await buyRequest.save();

    res.status(200).json({ msg: "Buy request approved tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "approve".bgYellow);
    console.log(error);
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
        .status(400)
        .json(errorFormat(id, "No buy request with this id", "id", "header"));
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

    //update/create SupplierCustody
    for (let i = 0; i < buyRequest.custodies.length; i++) {
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
      supplierCustody.totalQuantity += buyRequest.custodies[i].quantity;
      supplierCustody.lastPrice = buyRequest.custodies[i].price;
      supplierCustody.totalCost += buyRequest.custodies[i].price;

      await supplierCustody.save();

      //update custody
      const custody = await Custody.findById(buyRequest.custodies[i].id);
      if (!custody) {
        return res
          .status(400)
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
      supplierMaterial.lastQuantity = buyRequest.custodies[i].quantity;
      supplierMaterial.totalQuantity += buyRequest.custodies[i].quantity;
      supplierMaterial.lastPrice = buyRequest.custodies[i].price;
      supplierMaterial.totalCost += buyRequest.custodies[i].price;

      await supplierMaterial.save();

      //update material
      const material = await Material.findById(buyRequest.materials[i].id);
      if (!material) {
        return res
          .status(400)
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
    console.log("Error is in: ".bgRed, "delivered".bgYellow);
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
  addCustodies,
  removeMaterials,
  removeCustodies,
  approve,
  delivered,
};
