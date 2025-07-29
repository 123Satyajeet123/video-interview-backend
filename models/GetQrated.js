const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String }, // Changed from 'text' to 'question' based on payload
  idealAnswer: { type: String }, // Ideal answer for the question (from payload)
  format: {
    type: String,
    enum: ["text", "boolean"], // Options based on payload
    default: "text",
  },
  required: { type: Boolean, default: true }, // Whether this question is required
  type: {
    type: String,
    enum: ["text", "textarea", "multipleChoice", "checkbox", "dropdown"],
    default: "text",
  },
  options: [String], // For multiple choice, checkbox, dropdown types (optional)
});

// GetQrated schema
const GetQratedSchema = new Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // Screening questions section
    screeningQuestions: {
      method: {
        type: String,
        enum: ["required", "optional", "skip"],
        default: "required",
      },
      questions: [QuestionSchema],
    },

    // Introduction video section
    introductionVideo: {
      method: {
        type: String,
        enum: ["required", "optional", "skip"],
        default: "optional",
      },
      maxDuration: {
        type: Number,
        default: 120, // In seconds
      },
      instructions: {
        type: String,
        default: "Please introduce yourself in a short video (max 2 minutes).",
      },
    },

    // Soft skills assessment section
    softSkills: {
      method: {
        type: String,
        enum: ["required", "optional", "skip"],
        default: "optional",
      },
      skills: {
        type: [String],
      },
      instructions: {
        type: String,
        default: "Please complete the soft skills assessment.",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GetQrated", GetQratedSchema);
