
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateDocumentSchema =  new Schema({
  document: {
    type: String
  },
  title:{
    type:String
  }
},
{
  timestamps: true
});

module.exports = candidateDocumentSchema;

