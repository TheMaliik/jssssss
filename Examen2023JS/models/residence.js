const mongo = require("mongoose");
const Schema = mongo.Schema;
const Residence = new Schema({
  name: String,
  surface: Number,
  status: Boolean,
});

module.exports = mongo.model("residence", Residence);
