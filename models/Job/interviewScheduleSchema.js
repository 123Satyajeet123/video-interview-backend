const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const interviewScheduleSchema =  new Schema({
  candidateEmail: {
    type: String
  },
  candidateName: {
    type: String
  },
  recruiterEmails: {
    type: Array
  },
  interviewDate: {
    type: String
  },
  interviewTime: {
    type: String
  },
  interviewType: {
    type: String
  },
  cancelInterview: {
    type: Boolean,
    default: false
  },
  comments: {
    type: String
  },
  recruiterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},{
  timestamps: true
});

module.exports = interviewScheduleSchema;
