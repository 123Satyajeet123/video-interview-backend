const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const educationSchema = new Schema(
  {
    universityName: {
      type: String,
    },
    degree: {
      type: String,
    },
    startDate: {
      type: String
    },
    endDate: {
     type: String
    },
    major: {
      type: String
    },
    description: {
      type: String
    },
    gpa: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = educationSchema;
