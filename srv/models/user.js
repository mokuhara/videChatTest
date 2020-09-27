const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserListSchema = Schema(
  {
    uid: String,
    iconUrl: String,
    name: String,
  },
  {
    collection: "users",
  }
);
module.exports = mongoose.model("UsersList", UserListSchema);
