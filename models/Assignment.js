const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FileSchema = new Schema({
  location: String,
  key: String,
  filename: String,
  mimetype: String,
  size: Number,
});

const AssignmentSchema = new Schema({
  jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  documents: [FileSchema],
  scheduledTime: { type: Number }, // in minutes, optional
}, { timestamps: true });

module.exports = mongoose.model('Assignment', AssignmentSchema); 