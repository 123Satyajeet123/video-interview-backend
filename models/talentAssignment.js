// models/talentAssignment.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define a schema for the file structure
const FileSchema = new Schema({
  location: { type: String, required: true },
  key: { type: String },
  filename: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
});

// Define a schema for the assignment answers structure
const AssignmentAnswerSchema = new Schema({
  description: { type: String },
  
  files: [FileSchema],
  submittedAt: { type: Date, default: Date.now },
});

// Create a new schema for answers that properly defines all possible sub-objects
const AnswersSchema = new Schema(
  {
    screeningQuestions: { type: Schema.Types.Mixed },
    introductionVideo: {
      location: String,
      key: String,
      filename: String,
      mimetype: String,
      size: Number,
    },
    assignment: AssignmentAnswerSchema, // Use our defined schema
    softSkills: { type: Schema.Types.Mixed },
  },
  { _id: false, minimize: false }
); // Don't remove empty objects

// Update the TalentAssignment schema to use the AnswersSchema
const TalentAssignmentSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    talent: { type: Schema.Types.ObjectId, ref: "Talent", required: true },
    getQrated: { type: Schema.Types.ObjectId, ref: "GetQrated" },
    status: {
      type: String,
      enum: ["Not Started", "Started", "In Process", "Completed", "Declined"],
      default: "Not Started",
    },
    email: { type: String },
    name: { type: String },
    answers: { type: AnswersSchema, default: {} },
    // New fields for email sent status
    getQratedEmailSent: { type: Boolean, default: false },
    getQratedEmailSentAt: { type: Date },
    assignmentEmailSent: { type: Boolean, default: false },
    assignmentEmailSentAt: { type: Date },
    // Per-stage progress tracking
    stageProgress: {
      screening: {
        status: { type: String, enum: ["Not Started", "Started", "In Process", "Completed"], default: "Not Started" },
        startedAt: { type: Date },
        completedAt: { type: Date },
      },
      introductionVideo: {
        status: { type: String, enum: ["Not Started", "Started", "In Process", "Completed"], default: "Not Started" },
        startedAt: { type: Date },
        completedAt: { type: Date },
      },
      softSkills: {
        status: { type: String, enum: ["Not Started", "Started", "In Process", "Completed"], default: "Not Started" },
        startedAt: { type: Date },
        completedAt: { type: Date },
      },
      assignment: {
        status: { type: String, enum: ["Not Started", "Started", "In Process", "Completed"], default: "Not Started" },
        startedAt: { type: Date },
        completedAt: { type: Date },
      },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create a "pre-save" middleware to update timestamps
TalentAssignmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a helper method to update assignments
TalentAssignmentSchema.statics.updateAssignment = async function (
  jobId,
  talentId,
  data
) {
  try {
    const filter = { job: jobId, talent: talentId };
    const update = { $set: data };
    const options = { new: true }; // return the updated document

    const result = await this.findOneAndUpdate(filter, update, options);
    return result;
  } catch (error) {
    console.error("Error in updateAssignment:", error);
    throw error;
  }
};

module.exports = mongoose.model("TalentAssignment", TalentAssignmentSchema);
