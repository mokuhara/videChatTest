const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeerIdsSchema = Schema({
    uid: String,
    peerId: String,
    updatedAt: String,
}, {
    collection: "peerIds"
});
module.exports = mongoose.model("PeerIdsList", PeerIdsSchema);