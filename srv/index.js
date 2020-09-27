import express from "express";

const admin = require("firebase-admin");

const serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://videochattest-958f6.firebaseio.com"
});

const _ = require("lodash");
const cors = require("cors");

const mongoose = require("mongoose");
// const UsersList = require("./models/user");
const PeerIdsList = require("./models/peerIds");
const textChat = require("./models/textChat")
const MONGOCONFIG = require("../config/mongodb");

const connectOption = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

//Set up default mongoose connection
const mongoDB = MONGOCONFIG.ENDPOINT;
mongoose.connect(mongoDB, connectOption);
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

export default (app, http) => {
  app.use(express.json());
  app.use(cors());

  app.post("/api/v1/chat/store", (req, res) => {
    const localUid = req.body.localUid
    const remoteUid = req.body.remoteUid
    const thread = req.body.thread
    const filter = {
      thread: thread
    };
    const update = {
      localUid: localUid,
      remoteUid: remoteUid,
      thread: thread
    }
    textChat.updateOne(filter, update, {
      upsert: true,
    }, (err, result) => {
      if (!err) {
        return res.json({
          status: 'success'
        });
      }
      console.error(err)
    })
  });

  app.get("/secret/userinfo", async (req, res) => {
    const idToken = req.header("Authorization");
    if (idToken) {
      const {
        uid
      } = await admin.auth().verifyIdToken(idToken);
      res.json({
        uid: uid
      });
    }
    res.status(403).send();
  });

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