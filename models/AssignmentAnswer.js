const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  location: String,
  key: String,
  filename: String,
  mimetype: String,
  size: Number,
});

const AssignmentAnswerSchema = new Schema({
  assignmentId: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
  talentId: { type: Schema.Types.ObjectId, ref: 'Talent', required: true },
  description: { type: String },
  documents: [FileSchema],
  timeTaken: { type: Number }, // in seconds or minutes, optional
  startedAt: { type: Date },
  submittedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('AssignmentAnswer', AssignmentAnswerSchema); 