// src/models/Interview.js
const mongoose = require("mongoose");
const InterviewSchema = new mongoose.Schema(
    {
        talent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Talent",
            required: true,
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "completed"],
            default: "pending",
        },
        conversation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversation",
        },
        videoUrl: {
            type: String,
            default: null,
        },
        // Dynamic interview configuration
        interviewConfig: {
            maxMainQuestions: {
                type: Number,
                default: 5,
                min: 1,
                max: 20
            },
            maxFollowUpQuestions: {
                type: Number,
                default: 2,
                min: 0,
                max: 5
            },
            maxTotalQuestions: {
                type: Number,
                default: 15,
                min: 1,
                max: 50
            },
            closingStatement: {
                type: String,
                default: "Thank you for your time. Your interview is complete now. We have gathered sufficient information to assess your application. Our team will review your responses and contact you with next steps soon.",
                maxlength: 500
            },
            questionTypes: {
                type: [String],
                default: ["technical", "experience", "technical_challenges", "team_collaboration", "behavioral"],
                enum: ["technical", "experience", "technical_challenges", "team_collaboration", "behavioral", "candidate_questions", "conclusion"]
            },
            customInstructions: {
                type: String,
                default: "",
                maxlength: 1000
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interview", InterviewSchema);
