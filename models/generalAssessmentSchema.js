const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const generalAssessmentSchema = new Schema(
  {
    questions:  {
      Grit1: { type: Number },
      Grit2: { type: Number },
      Grit3: { type: Number },
      Grit4: { type: Number },
      Grit5: { type: Number },
      Grit6: { type: Number },
      Grit7: { type: Number },
      Grit8: { type: Number },
      EI1: { type: Number },
      EI2: { type: Number },
      EI3: { type: Number },
      EI4: { type: Number },
      EI5: { type: Number },
      EI6: { type: Number },
      EI7: { type: Number },
      EI8: { type: Number },
      EI9: { type: Number },
      EI10: { type: Number },
      EI11: { type: Number },
      EI12: { type: Number },
      Motivation1: { type: String },
      Motivation2: { type: String },
      Motivation3: { type: String },
      Motivation4: { type: String },
      Motivation5: { type: String },
      Motivation6: { type: String },
      Communication1: {
        Sensor: { type: String },
        Feeler: { type: String },
        Thinker: { type: String },
        Intutior: { type: String }
      },
      Communication1: {
        Sensor: { type: String },
        Feeler: { type: String },
        Thinker: { type: String },
        Intutior: { type: String }
      },
      Communication1: {
        Sensor: { type: Number },
        Feeler: { type: Number },
        Thinker: { type: Number },
        Intutior: { type: Number }
      },
      Communication2: {
        Sensor: { type: Number },
        Feeler: { type: Number },
        Thinker: { type: Number },
        Intutior: { type: Number }
      },
      Communication3: {
        Sensor: { type: Number },
        Feeler: { type: Number },
        Thinker: { type: Number },
        Intutior: { type: Number }
      },
      Communication4: {
        Sensor: { type: Number },
        Feeler: { type: Number },
        Thinker: { type: Number },
        Intutior: { type: Number }
      },
      Communication5: {
        Sensor: { type: Number },
        Feeler: { type: Number },
        Thinker: { type: Number },
        Intutior: { type: Number }
      },
      Communication6: {
        Sensor: { type: Number },
        Feeler: { type: Number },
        Thinker: { type: Number },
        Intutior: { type: Number }
      }
    },
    formStage: {
      type: String,
      default: 'one'
    },
    gritScore : { type: Number},
    emotionalIntelligence : { type: Number},
    primaryCommunicatingStyle: { type: String },
    secondaryCommunicatingStyle: { type: String },
    primaryMotivation: { type: String},
    secondaryMotivation: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = generalAssessmentSchema;
