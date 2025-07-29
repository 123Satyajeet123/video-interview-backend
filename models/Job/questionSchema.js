const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema =  new Schema({
  question: {
    type: String,
    required: true
  },
  Response: {
    type : String,
    default: ''
  }
},{
  timestamps: true
});

module.exports = questionSchema;
