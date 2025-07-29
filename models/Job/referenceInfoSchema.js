const mongoose = require('mongoose');
const questionSchema = require('./questionSchema');
const Schema = mongoose.Schema;

const referenceInfoSchema =  new Schema({
  referrerName: {
    type: String,
    // required: true
  },
  referrerEmail: {
    type : String,
    // required: true
  },
  referrerRelation: {
    type : String,
    // required: true
  },
  referrerContact: String,
  referrerCompanyName: String,
  questionShouldAskToReferrer: [questionSchema]
},{
  timestamps: true
});

module.exports = mongoose.model('referenceInfo', referenceInfoSchema);
