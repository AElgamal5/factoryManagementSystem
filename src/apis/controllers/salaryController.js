const { Salary, Employee, Stage } = require("../models");
const { errorFormat, idCheck, currentTime } = require("../utils");

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
      .populate("totalWorkPerMonth.stage", "name rate price")
      .populate("workDetails.work.stage", "name rate price")
      .populate("workDetails.work.stage", "name rate price");

    let costs = [];

    for (let i = 0; i < docs.length; i++) {
      let totalCost = 0;
      for (let j = 0; j < docs[i].totalWorkPerMonth.length; j++) {
        const stage = await Stage.findById(docs[i].totalWorkPerMonth[j].stage);
        totalCost += stage.price * docs[i].totalWorkPerMonth[j].quantity;
      }
      costs.push(totalCost);
    }

    return res.status(200).json({ data: docs, costs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "salary.getAllForEmployee".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: PATCH
 * path: /api/Salary/:id/done
 */
const paid = async (req, res) => {
  const id = req.params.id;
  try {
    if (!idCheck(id)) {
      return res
        .status(400)
        .json(errorFormat(id, "Invalid salary id", "id", "params"));
    }
    const salary = await Salary.findById(id);
    if (!salary) {
      return res
        .status(404)
        .json(errorFormat(id, "No salary with this id", "id", "params"));
    }
    if (salary.state) {
      res
        .status(400)
        .json(
          errorFormat(
            salary.state,
            "Salary aleardy paid",
            "salary.state",
            "others"
          )
        );
    }

    salary.state = true;
    await salary.save();

    return res.status(200).json({ msg: "Salary state : done" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "salary.paid".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/Salary/recalculate
 */
const recalculate = async (req, res) => {
  try {
    const current = currentTime();

    const salaries = await Salary.find({
      "date.month": current.getMonth() + 1,
      "date.year": current.getFullYear(),
    });

    for (let i = 0; i < salaries.length; i++) {
      const workDetailsIndex = salaries[i].workDetails.findIndex(
        (obj) => obj.day === current.getDate()
      );
      if (workDetailsIndex === -1) {
        salaries[i].todayCost = 0;
        salaries[i].todayPieces = 0;
      } else {
        let todayCost = 0;
        for (
          let j = 0;
          j < salaries[i].workDetails[workDetailsIndex].work.length;
          j++
        ) {
          const stage = await Stage.findById(
            salaries[i].workDetails[workDetailsIndex].work[j].stage
          );

          todayCost +=
            stage.price *
            salaries[i].workDetails[workDetailsIndex].work[j].quantity;
        }
        salaries[i].todayCost = todayCost;

        salaries[i].priceHistory = [];
      }

      let totalCost = 0;
      for (let j = 0; j < salaries[i].totalWorkPerMonth.length; j++) {
        const stage = await Stage.findById(
          salaries[i].totalWorkPerMonth[j].stage
        );

        totalCost += salaries[i].totalWorkPerMonth[j].quantity * stage.price;

        salaries[i].priceHistory.push({
          stage: stage._id,
          price: stage.price,
        });
      }
      salaries[i].totalCost = totalCost;
      await salaries[i].save();
    }

    res.status(200).json({ msg: "salaries recalculated tmam" });
  } catch (error) {
    console.log("Error is in: ".bgRed, "salary.recalculate".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

/*
 * method: GET
 * path: /api/Salary/all
 */
const salaryForAll = async (req, res) => {
  try {
    const current = currentTime();

    const docs = await Salary.find({
      "date.year": current.getFullYear(),
      "date.month": current.getMonth() + 1,
    })
      .populate("employee", "name code")
      .populate("totalWorkPerMonth.stage", "rate");
    res.status(200).json({ data: docs });
  } catch (error) {
    console.log("Error is in: ".bgRed, "salary.salaryForAll".bgYellow);
    if (process.env.PRODUCTION === "false") console.log(error);
  }
};

module.exports = { getAllForEmployee, paid, recalculate, salaryForAll };
