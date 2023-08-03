const bcrypt = require("bcrypt");
const { User, UserRole, Employee, Role, UserEmployee } = require("../models");

const userMigrate = async () => {
  let userRole = await UserRole.findOne({ number: 0 });

  if (!userRole) {
    userRole = await UserRole.create({
      title: "Super Admin",
      number: "0",
      privileges: [
        "dashboard",
        "storage",
        "users",
        "orders",
        "shipments",
        "models",
        "employees",
        "suppliers",
        "clients",
        "requests",
        "colors",
        "sizes",
        "roles",
        "stages",
        "machinetypes",
        "user_role",
        "types",
        "assistant",
        "track",
        "cards",
        "prodEntry",
        "quality",
        "salary",
      ],
    });
  }

  let existUser = await User.findOne({ code: "0" });
  if (!existUser) {
    const hashedPass = await bcrypt.hash("12345!wW", 10);
    existUser = await User.create({
      name: "Admin",
      role: userRole._id,
      code: "0",
      password: hashedPass,
    });
  }

  let role = await Role.findOne({ number: 0 });
  if (!role) {
    role = await Role.create({ number: 0, title: "Super Admin" });
  }

  let employee = await Employee.findOne({ code: 0 });
  if (!employee) {
    employee = await Employee.create({
      name: "Super Admin",
      code: 0,
      role: role._id,
    });
  }

  let userEmployee = await UserEmployee.findOne({
    user: existUser._id,
    employee: employee._id,
  });
  if (!userEmployee) {
    await UserEmployee.create({ user: existUser._id, employee: employee._id });
  }

  userRole = await UserRole.findOne({ number: 1 });
  if (!userRole) {
    await UserRole.create({
      title: "Admin",
      number: "1",
      privileges: [
        "dashboard",
        "storage",
        "users",
        "orders",
        "shipments",
        "models",
        "employees",
        "suppliers",
        "clients",
        "requests",
        "colors",
        "sizes",
        "roles",
        "stages",
        "machinetypes",
        "user_role",
        "types",
        "assistant",
        "track",
        "cards",
        "prodEntry",
        "quality",
        "salary",
      ],
    });
  }

  userRole = await UserRole.findOne({ number: 2 });
  if (!userRole) {
    await UserRole.create({
      title: "quality checker",
      number: 2,
      privileges: ["quality"],
    });
  }

  userRole = await UserRole.findOne({ number: 3 });
  if (!userRole) {
    await UserRole.create({
      title: "assistant",
      number: 3,
      privileges: ["prodEntry"],
    });
  }
};

module.exports = userMigrate;
