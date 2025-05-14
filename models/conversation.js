// src/models/Conversation.js
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    role: { type: String, enum: ["user", "ai"], required: true },
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
