const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema =  new Schema({
  documentDetail: {
    type: String
  },
  documentURL: {
    type: String
  },
  recruiterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

module.exports = documentSchema;
