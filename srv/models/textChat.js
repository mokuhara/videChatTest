const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeerIdsSchema = Schema({
    localUid: String,
    remoteUid: String,
    thread: Array,
}, {
    collection: "textChat"
});
module.exports = mongoose.model("textChat", PeerIdsSchema);