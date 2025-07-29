const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var notesSchema = require("./notesSchema");
var documentSchema = require("./documentSchema");
var assessmentSchema = require("./assessmentSchema");
var interviewScheduleSchema = require("./interviewScheduleSchema");
var referenceSchema = require("./referenceSchema");

const ApplicationSchema = new Schema(
  {
    talentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Talent",
    },
    applied: {
      type: Boolean,
      default: true,
    },
    curated: {
      type: Boolean,
      default: false,
    },
    shortlisted: {
      type: Boolean,
      default: false,
    },
    interviewed: {
      type: Boolean,
      default: false,
    },
    offered: {
      type: Boolean,
      default: false,
    },
    hired: {
      type: Boolean,
      default: false,
    },
    rejected: {
      type: Boolean,
      default: false,
    },
    stages: {
      applied: {
        type: Boolean,
        default: true,
      },
      appliedDate: {
        type: Date,
        default: Date.now,
      },
      curated: {
        type: Boolean,
        default: false,
      },
      curatedDate: {
        type: Date,
      },
      shortlisted: {
        type: Boolean,
        default: false,
      },
      shortlistedDate: {
        type: Date,
      },
      interviewed: {
        type: Boolean,
        default: false,
      },
      interviewedDate: {
        type: Date,
      },
      offered: {
        type: Boolean,
        default: false,
      },
      offeredDate: {
        type: Date,
      },
      hired: {
        type: Boolean,
        default: false,
      },
      hiredDate: {
        type: Date,
      },
      rejected: {
        type: Boolean,
        default: false,
      },
      rejectedDate: {
        type: Date,
      },
    },
    rejectedComment: {
      type: String,
      default: "",
    },
    recruiterDetail: {
      type: Object,
    },
    // addedByRecruiterEmail: {
    //   type: String,
    //   default : ''
    // },
    // addedByRecruiterName: {
    //   type: String,
    //   default : ''
    // },
    // addedByRecruiterId: {
    //   type: String,
    //   default : ''
    // },
    applicationType: {
      type: Number,
    },
    notes: [notesSchema],
    documents: [documentSchema],
    assessment: [assessmentSchema],
    interviewSchedule: [interviewScheduleSchema],
    references: [referenceSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = ApplicationSchema;
