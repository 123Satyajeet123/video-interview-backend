const mongoose = require('mongoose');

const gptWorkSampleSchema = new mongoose.Schema({
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Talent',
      required: true
    },
    workSamples: [{
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      suggestions: {
        type: String,
        required: true
      },
      status: {
        type: String,
        enum: ['pending', 'submitted', 'approved', 'rejected'],
        default: 'pending'
      },
      submissionUrl: {
        type: String
      },
      submissionDate: {
        type: Date
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });
  
  // Update the updatedAt timestamp before saving
  gptWorkSampleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });
  
  module.exports = mongoose.model('GptWorkSample', gptWorkSampleSchema);
  