const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  first_name : {
    type  : String,
    // required: true
  },
  last_name : {
    type  : String,
    // required: true
  },
  email : {
    type  : String,
    required: true
  },
  passwordHash : {
    type  : String,
    // required: true
  },
  role : {
    type: String,
    required: true,
    default: 'Admin'
  },
  active: {
    type: Boolean,
    default: false
  },
  companyId: {
    type: String,
    required: true,
    default: '000000000000000000000000'
  },
  clientId: {
    type: String,

},
pod_role : {
  type: String,
  // required: true,
  // default: 'null'
},
pod_group : {
  type: String,
  // required: true,
  // default: 'null'
},
},{timestamps : true})

module.exports = mongoose.model("User", UserSchema);
