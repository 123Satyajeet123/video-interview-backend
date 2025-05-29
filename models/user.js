// src/models/User.js
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
    {
        name: String,
        email: { type: String, unique: true },
        resume: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
