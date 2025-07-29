const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const role = new Schema({
  standardizedRole: String,
  subCategories: Array,
});

// module.exports = filter;
const roleOption = mongoose.model("roleOptions", role);

module.exports = roleOption;
