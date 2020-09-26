import express from "express";
// import socketIO from "socket.io";

//Import the mongoose module
const mongoose = require("mongoose");
const UsersList = require("./models/user");
const MONGOCONFIG = require("../config/mongodb");

//Set up default mongoose connection
const mongoDB = MONGOCONFIG.ENDPOINT
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default (app, http) => {
  app.use(express.json());

  app.get("/foo", (req, res) => {
    res.json({
      msg: "foo!",
    });
  });

  app.get("/mydb", (req, res) => {
    UsersList.find(function (err, result) {
      if (!err) {
        return res.json(result);
      } else {
        return res.status(500).send("post mylist faild");
      }
    });
  });
  //
  // app.post('/bar', (req, res) => {
  //   res.json(req.body);
  // });
  //
  // optional support for socket.io
  //
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
};