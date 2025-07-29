const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const careerGoalSchema = new Schema({
    goal : {
        type : String
    },
    motivatesYou  : {
        type : String
    },
    planToAchieve : {
        type : String
    },
    howItsAchieved : {
        type : String,
    },
    nextStep: {
        type: String
    },
    timeToComplete : {
        type : String
    },
    status: {
        type: String,
    },
    comments: {
        type : String,
        default: ''
    }
},
    {
    timestamps: true
  });

module.exports = careerGoalSchema;
