// src/models/Job.js
const mongoose = require("mongoose");
const JobSchema = new mongoose.Schema(
    {
      title: String,
      description: String,
      requirements: [String],
      company: String,
      job_title: { type: String,  },
      industry: { type: String,  },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);
