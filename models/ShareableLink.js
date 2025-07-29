// models/ats/shareableLink.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShareableLinkSchema = new Schema(
  {
    job: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },
    getQrated: {
      type: Schema.Types.ObjectId,
      ref: "GetQrated",
      required: false,
    },
    assignment: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: false,
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30 * 24 * 60 * 60 // Expire after 30 days
    }
  }
);

module.exports = mongoose.model("ShareableLink", ShareableLinkSchema);