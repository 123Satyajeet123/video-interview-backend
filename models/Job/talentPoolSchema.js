const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const talentPoolSchema =  new Schema({
  email: {
    type: String
  },
  talentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talent'
  },
},{
  timestamps: true
});

module.exports = talentPoolSchema;
