// models/TalentGetQratedAnswer.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GetQratedAnswerSchema = new Schema(
  {
    talent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Talent",
      required: true,
    },
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: false },
    getQrated: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GetQrated",
      required: true,
    },
    answers: { type: Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["Not Started", "Started", "In Process", "Completed"],
      default: "Not Started",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GetQratedAnswer", GetQratedAnswerSchema);
