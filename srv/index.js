import express from "express";

const _ = require("lodash");
const cors = require("cors");

const mongoose = require("mongoose");
const UsersList = require("./models/user");
const PeerIdsList = require("./models/peerIds");
const MONGOCONFIG = require("../config/mongodb");

//Set up default mongoose connection
const mongoDB = MONGOCONFIG.ENDPOINT;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default (app, http) => {
  app.use(express.json());
  app.use(cors());

  app.post("/api/v1/peerId/store", async (req, res) => {
    const filter = {
      uid: req.body.uid,
    };
    const update = {
      peerId: req.body.peerId,
      updatedAt: new Date(),
    };
    PeerIdsList.update(filter, update, {
      upsert: true,
    }).catch((e) => {
      return res.status(500).send("post session faild");
    });
    const doc = await PeerIdsList.find({
      uid: req.body.uid,
    });
    const latestData = _.max(doc, (peerId) => {
      return peerId.updatedAt;
    });
    return res.json({
      peerId: latestData.peerId,
    });
  });

  app.post("/api/v1/peerId/search", async (req, res) => {
    const filter = {
      uid: req.body.uid,
    };
    const doc = await PeerIdsList.find({
      uid: req.body.uid,
    });
    const latestData = _.max(doc, (peerId) => {
      return peerId.updatedAt;
    });
    return res.json({
      peerId: latestData.peerId,
    });
  });
};
