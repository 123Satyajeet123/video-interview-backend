const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assessmentSchema =  new Schema({
  assessmentName : {
    type: String
  },
  assessmentURL : {
    type: String
  },
  recruiterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

module.exports = assessmentSchema;
