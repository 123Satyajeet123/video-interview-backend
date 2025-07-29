const mongoose = require('mongoose');

const gptProjectSchema = new mongoose.Schema({
  talentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Talent',
    required: true
  },
  projects: [{
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'abandoned'],
      default: 'pending'
    },
    githubUrl: {
      type: String
    },
    liveUrl: {
      type: String
    },
    completionDate: {
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
gptProjectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('GptProject', gptProjectSchema);
