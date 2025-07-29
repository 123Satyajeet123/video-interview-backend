const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workExSchema = new Schema({
  location: {
    type: String
  },
  ctc: {
    type: String
  },
  currencyType: {
    type: String
  },
  company: {
    type: String
    // required: true
  }, 
  designation: {
    type: String
    // required: true
  },
  description: {
    type: String
  },
  startDate: {
    type: String
  },
  endDate: {
    type: String
  },
}, {
  timestamps: true
});

module.exports = workExSchema;
