const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const personalityAssessmentSchema = new Schema(
  {
    questions: {
      question1: { type: String },
      question2: { type: String },
      question3: { type: String },
      question4: { type: String },
      question5: { type: String },
      question6: { type: String },
      question7: { type: String },
      question8: { type: String },
      question9: { type: String },
      question10: { type: String },
      question11: { type: String },
      question12: { type: String },
      question13: { type: String },
      question14: { type: String },
      question15: { type: String },
      question16: { type: String },
      question17: { type: String },
      question18: { type: String },
      question19: { type: String },
      question20: { type: String },
      question21: { type: String },
      question22: { type: String },
      question23: { type: String },
      question24: { type: String },
      question25: { type: String },
      question26: { type: String },
      question27: { type: String },
      question28: { type: String },
      question29: { type: String },
      question30: { type: String },
      question31: { type: String },
      question32: { type: String },
      question33: { type: String },
      question34: { type: String },
      question35: { type: String },
      question36: { type: String },
      question38: { type: String },
      question39: { type: String },
      question40: { type: String },
      question41: { type: String },
      question42: { type: String },
      question43: { type: String },
      question44: { type: String },
      question45: { type: String },
      question46: { type: String },
      question48: { type: String },
      question49: { type: String },
      question50: { type: String }
    },
    formStage: {
      type: String,
      default: 'one'
    },
    extrovert: {type: Number},
    introvert: {type: Number},
    sensible: {type: Number},
    intuition: {type: Number},
    thinker: {type: Number},
    feeling: {type: Number},
    judging: {type: Number},
    perceiving: {type: Number},
    personalityType: { type: Array },
    personalityTraits: { type: Array },
    careerPaths: { type: Array },
    personalitySummary: { type: String }
  },
  {
    timestamps: true
  }
);

module.exports = personalityAssessmentSchema;
