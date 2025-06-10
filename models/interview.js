// src/models/Interview.js
const mongoose = require("mongoose");
const InterviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Interview", InterviewSchema);
