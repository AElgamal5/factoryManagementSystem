const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const cron = require("node-cron");
require("colors");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log("Received message:", data);
    io.emit("message", data); // Broadcast the message to all connected clients
  });

  socket.on("error_late", (data) => {
    console.log("Received message:", data);
    io.emit("error_late", data); // Broadcast the message to all connected clients
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

//middleware
app.use(express.json({ limit: "15mb" }));
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  req.io = io;
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
  client,
  materialType,
  carton,
  shipment,
  order,
  machineType,
  userRole,
  user,
  auth,
  userEmployee,
  card,
  salary,
  work,
  stageEmployee,
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
app.use("/api/client", client);
app.use("/api/materialType", materialType);
app.use("/api/carton", carton);
app.use("/api/shipment", shipment);
app.use("/api/order", order);
app.use("/api/machineType", machineType);
app.use("/api/userRole", userRole);
app.use("/api/user", user);
app.use("/api/auth", auth);
app.use("/api/userEmployee", userEmployee);
app.use("/api/card", card);
app.use("/api/salary", salary);
app.use("/api/work", work);
app.use("/api/stageEmployee", stageEmployee);

//migration
const userMigrate = require("./apis/utils/userMigration");

//connect to DB and running the server
(function start() {
  mongoose
    .connect(process.env.DATABASE_URI)
    .then(() => {
      server.listen(process.env.PORT, () => {
        console.log("Connected to DB & server running on port: 5000".bgGreen);
        userMigrate();
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

//close all open idle times at 4.15 PM UTC+2
const { Salary } = require("./apis/models");
cron.schedule("15 16 * * *", async () => {
  const current = new Date();
  const docs = await Salary.find({
    "date.year": current.getFullYear(),
    "date.month": current.getMonth() + 1,
    idle: true,
  });
  for (let i = 0; i < docs.length; i++) {
    const idleIndex = docs[i].idleDetails[
      docs[i].idleDetails.length - 1
    ].idles.findIndex((obj) => !obj.doneBy && !obj.end);

    if (idleIndex === -1) {
      continue;
    }

    docs[i].idleDetails[docs[i].idleDetails.length - 1].idles[
      idleIndex
    ].doneBy = doneBy;
    docs[i].idleDetails[docs[i].idleDetails.length - 1].idles[idleIndex].end =
      current;

    let minus = 0;

    const diff =
      docs[i].idleDetails[docs[i].idleDetails.length - 1].idles[idleIndex].end -
      docs[i].idleDetails[docs[i].idleDetails.length - 1].idles[idleIndex]
        .start;

    const diffInMinutes = Math.round((diff - minus) / 60000);

    if (docs[i].date.day !== current.getDate()) {
      docs[i].date.day = current.getDate();
      docs[i].todayIdle = 0;
    }
    docs[i].todayIdle += diffInMinutes;
    docs[i].totalIdle += diffInMinutes;

    docs[i].idle = false;

    await docs[i].save();
  }
});
