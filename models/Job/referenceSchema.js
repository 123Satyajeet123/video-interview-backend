const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const referenceSchema = new Schema({
  name: {
    type: String
  },
  mobile: {
    type: Number
  },
  email: {
    type: String
  },
  description: {
    type: String
  }
},{
  timestamps: true
});

module.exports = referenceSchema;
