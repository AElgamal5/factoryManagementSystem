const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
require("colors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//middleware
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routers
const {
  employee,
  supplier,
  custody,
  custodyEmployee,
  material,
  materialEmployee,
  buyRequest,
  role,
  color,
  size,
  model,
  stage,
} = require("./apis/routes");
app.use("/api/employee", employee);
app.use("/api/supplier", supplier);
app.use("/api/custody", custody);
app.use("/api/custodyEmployee", custodyEmployee);
app.use("/api/material", material);
app.use("/api/materialEmployee", materialEmployee);
app.use("/api/buyRequest", buyRequest);
app.use("/api/role", role);
app.use("/api/color", color);
app.use("/api/size", size);
app.use("/api/model", model);
app.use("/api/stage", stage);

//connect to DB and running the server
(function start() {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      server.listen(process.env.PORT, () => {
        console.log("Connected to DB & server running on port: 5000".bgGreen);
      });
    })
    .catch((err) => {
      console.error(
        "Error in database connection".red,
        "\nRetry to connect in 5 sec".yellow
      );
      process.env.PRODUCTION === "false" ? console.log(err) : null;
      setTimeout(start, 5000);
    });
})();

//test API
app.get("/", (req, res) => {
  res.json({ msg: "بسم الله الرحمن الرحيم" });
});
