const { Salary, Employee } = require("../models");
const { errorFormat, idCheck } = require("../utils");

/*
 * method: GET
 * path: /api/Salary/employee/:eid
 */
const getAllForEmployee = async (req, res) => {
  const eid = req.params.eid;
  try {
    if (!idCheck(eid)) {
      return res
        .status(400)
        .json(errorFormat(eid, "Invalid employee id", "eid", "params"));
    }
    const employee = await Employee.findById(eid);
    if (!employee) {
      return res
        .status(404)
        .json(errorFormat(eid, "No employee with this id", "eid", "params"));
    }

    const docs = await Salary.find({ employee: eid })
      .sort({ createAt: -1 })
      .populate("work.stage", "name");

    return res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "salary.getAllForEmployee".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { getAllForEmployee };
