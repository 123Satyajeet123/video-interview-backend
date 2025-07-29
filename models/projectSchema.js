const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema(
  {
    projectName: {
      type: String,
      required: true
    },
    projectDescription: {
      type: String,
      required: true
    },
    projectLinks: {
      type: Array
    },
    projectSummary: {
      type: String
    },
    projectCompany: {
      type: String
    },
    projectTeam: {
      type: Array
    },
    projectStartDate: {
      month: { 
        type: String,
        required:true
      },
      year: { 
        type: String,
        required:true 
      }
    },
    projectEndDate: {
      month: { 
        type: String,
        required:true 
      },
      year: { 
        type: String,
        required:true 
      }
    },
    projectRole: {
      type: String,
      required:true
    },
    projectContribution: {
      type: String
    },
    projectTools: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

module.exports = projectSchema;
