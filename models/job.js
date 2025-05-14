// src/models/Job.js
const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        requirements: [String],
        company: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
