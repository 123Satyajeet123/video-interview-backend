const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notesSchema =  new Schema({
  comment: {
    type: String
  },
  recruiterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  user_name:{
    type:String
  }
},
{
  timestamps: true
});

module.exports = notesSchema;
