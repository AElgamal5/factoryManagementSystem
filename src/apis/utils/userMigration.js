const bcrypt = require("bcrypt");
const { User, UserRole } = require("../models");

const userMigrate = async () => {
  let userRole;

  userRole = await UserRole.findOne({ number: 0 });

  if (!userRole) {
    userRole = await UserRole.create({
      title: "Admin",
      number: "0",
      privileges: [
        "dashboard",
        "storage",
        "utils",
        "orders",
        "users",
        "models",
        "shipments",
        "employees",
        "suppliers",
        "clients",
        "requests",
      ],
    });
  }

  const existUser = await User.findOne({ code: 0 });
  if (!existUser) {
    const hashedPass = await bcrypt.hash("12345!wW", 10);
    await User.create({
      name: "Admin",
      role: userRole._id,
      code: "0",
      password: hashedPass,
    });
  }
};

module.exports = userMigrate;
