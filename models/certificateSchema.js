const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const certificateSchema =  new Schema({
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

module.exports = certificateSchema;
