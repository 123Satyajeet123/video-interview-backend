// src/models/Conversation.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ["user", "assistant", "system"], required: true },
    text: { type: String, required: true },
    at: { type: Date, default: Date.now },
});

const ConversationSchema = new mongoose.Schema(
    {
        interview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Interview",
            required: true,
        },
        messages: [MessageSchema],
        isEnded: { type: Boolean, default: false }, // Indicates if conversation has ended
        interviewMetadata: {
            mainQuestionsAsked: { type: Number, default: 0 },
            followUpQuestionsAsked: { type: Number, default: 0 },
            currentQuestionType: { 
                type: String, 
                enum: ["technical", "experience", "technical_challenges", "team_collaboration", "behavioral", "candidate_questions", "conclusion"],
                default: "technical"
            },
            interviewPhase: { 
                type: String, 
                enum: ["started", "in_progress", "concluding", "completed"],
                default: "started"
            },
            lastMainQuestionIndex: { type: Number, default: 0 },
            // Store interview-specific configuration for reference
            interviewConfig: {
                maxMainQuestions: { type: Number, default: 5 },
                maxFollowUpQuestions: { type: Number, default: 2 },
                maxTotalQuestions: { type: Number, default: 15 },
                closingStatement: { type: String, default: "" },
                questionTypes: { type: [String], default: [] },
                customInstructions: { type: String, default: "" }
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
