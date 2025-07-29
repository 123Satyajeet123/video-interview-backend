const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workSampleProjectSchema =  new Schema({
  document: {
    type: String
  },
  title:{
    type:String
  }, 
  link:{
    type:String
  },
  description:{
    type:String
  }
},
{
  timestamps: true
});

module.exports = workSampleProjectSchema;
