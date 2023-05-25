const { Client } = require("../models");
const { errorFormat } = require("../utils");

/*
 * method: POST
 * path: /api/client/
 */
const create = async (req, res) => {
  const { name, phoneNo, address, state, note } = req.body;

  try {
    //check if the phoneNo exist before
    const exist = await Client.findOne({ phoneNo });
    if (exist) {
      return res
        .status(400)
        .json(
          errorFormat(phoneNo, "this phoneNo is used before", "phoneNo", "body")
        );
    }

    const client = await Client.create({
      name,
      phoneNo,
      address,
      state,
      note,
    });

    res.status(201).json({ data: client });
  } catch (error) {
    console.log("Error is in: ".bgRed, "client.create".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/client/
 */
const getAll = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json({ data: clients });
  } catch (error) {
    console.log("Error is in: ".bgRed, "client.getAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/client/:id
 */
const getByID = async (req, res) => {
  const id = req.params.id;
  try {
    const client = await Client.findById(id);

    if (!client) {
      return res
        .status(404)
        .json(errorFormat(id, "No client with this id", "id", "params"));
    }

    res.status(200).json({ data: client });
  } catch (error) {
    console.log("Error is in: ".bgRed, "client.getByID".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/client/:id
 */
const update = async (req, res) => {
  const id = req.params.id;
  const { name, phoneNo, address, state, note } = req.body;

  try {
    //keep phoneNo unique
    if (phoneNo) {
      const exist = await Client.findOne({ phoneNo });

      if (exist._id.toString() !== id) {
        return res
          .status(400)
          .json(
            errorFormat(
              phoneNo,
              "this phoneNo is used before",
              "phoneNo",
              "body"
            )
          );
      }
    }

    const client = await Client.findByIdAndUpdate(id, {
      name,
      phoneNo,
      address,
      state,
      note,
    });

    if (!client) {
      return res
        .status(404)
        .json(errorFormat(id, "No client with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Client updated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "client.update".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: DELETE
 * path: /api/client/:id
 */
const deleteOne = async (req, res) => {
  const id = req.params.id;
  try {
    const client = await Client.findByIdAndDelete(id);

    if (!client) {
      return res
        .status(404)
        .json(errorFormat(id, "No client with this id", "id", "params"));
    }

    res.status(200).json({ msg: "Client deleted tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "client.deleteOne".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { create, getAll, getByID, update, deleteOne };
