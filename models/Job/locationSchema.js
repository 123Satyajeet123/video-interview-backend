const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const location = new Schema({
  city: String,
  state: String,
  country: String,
  location: String,
});

// module.exports = filter;
const locationOption = mongoose.model("locationOptions", location);

module.exports = locationOption;
