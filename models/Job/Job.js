const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TalentScoreTemplateSchema = require("./TalentScoreTemplateSchema");
//const Template = require("./scorecard");
// const ScorecardId = require("./ScoreCard");
var ApplicationSchema = require("./Application");
var questionSchema = require("./questionSchema");
const GetQrated = require("./GetQrated");

const jobSchema = new Schema(
  {
    // scorecardId: [ScorecardId],
    job_title: {
      type: String,
      required: true
    },
    position: {
      type: Number,
      required: true
    },
    job_role: {
      role_type: { type: String, 
        // required: true 
      },
      subCategory: { type: String, 
        // required: true 
      }
    },
    assignedClient: {
      client_id: { type: String, required: true },
      client_name: { type: String, required: true },
      client_industry: { type: String }
    },
    industry: {
      type: String,
    },
    functional_area: {
      type: String,
    },
    assignTo: {
      pod: String,
      podMember: String,
    },
    talentScoreTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TalentScoreTemplate",
    },
    employment_type: {
      type: String,
      required: true
    },
    min_experience: {
      type: Number,
      required: true
    },
    max_experience: {
      type: Number,
      required: true
    },
    min_salary: {
      type: Number,
      required: true
    },
    max_salary: {
      type: Number,
      required: true
    },
    currencyType: {
      // type: Number,
      type: String,
      required: true
    },
    currentSalary: {
      currencyType: {
        type: String,
      },
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    marketStandard: {
      currencyType: {
        type: String,
      },
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
    },
    skills: {
      type: Array,
    },

    job_location: {
      type: Array,
      required: true
    },
    howQuicklyDoYouWantThemToJoin: {
      type: String,
      // required: true
    },
    job_description: {
      type: String,
      // required: true,
    },
    job_description_file: {
      type: String,
    },
    additionalRequirements: {
      type: String,
    },
    // ---------------------------------------------
    interviewRoundsDescription: {
      type: Array
    },
    interviewSchedulingLink: {
      type: String,
    },
    idealCandidates: [
      {
        candidateLinkedinOrResumeLink: {
          type: String,
        },
        candidateResume: {
          type: String,
        },
        whyThisCandidateIsIdeal: {
          type: String,
        },
      },
    ],
    colleaguesLeadingInterviews: [
      {
        name: { type: String },
        email: { type: String },
      },
    ],
    questions: [questionSchema],
    active: {
      type: Boolean,
      default: false,
    },
    close: {
      type: Boolean,
      default: false,
    },
    onHold: {
      type: Boolean,
      default: false,
    },
    majorChallenges: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        majorChallenge: {
          type: String,
          // required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    ourRecommendations: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          auto: true,
        },
        recommendation: {
          type: String,
          // required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deleted: {
      type: Boolean,
      default: false,
    },
    daily_status: {
      type: String,
      default: "No",
    },
    applications: [ApplicationSchema],
    getQratedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GetQrated",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedRecruiter: {
      type:Array,
      // required: true
    },
    // isDraft: {
    //   type: Boolean,
    //   default: false,
    // },
    draftStage: {
      type: Number,
      enum: [0, 1, 2, 3, 4],
      default: null
    },
    clientComments: [
      {
        text: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    businessChallenges: {
      type: String
    },
    keyResponsibilities: {
      type: String
    },
    personalityTraits: {
      type: Array,
    },
    mustHaves: {
      type:String
    },
    targetCompanies:{
      type:Array
    },
    industries:{
      type:Array
    },
    hiringTeam: [
      {
        name: { type: String, 
          // required: true 
        },
        email: { type: String, 
          // required: true 
        },
        calendlyLink: { type: String },
        comments: { type: String }
      }
    ],
    about: {
      type: String
    },
    pitch: {
      type: String
    },
    compensationVariablesPlusEsops:{
      type:String
    },
 
    // idealProfiles:{
    //   type:Array
    // },
     // Add the new health field with nested structure
  //    health: {
  //     health: {
  //         type: String,
  //         enum: ['healthy', 'at_risk', 'critical'],
  //         // required: true
  //     },
  //     reason: {
  //         type: String,
  //         // required: true
  //     },
  //     scores: {
  //         curated: {
  //             type: String,
  //              enum: ['healthy', 'at_risk', 'critical']
  //             },
  //         round1: {
  //             type: String,
  //              enum: ['healthy', 'at_risk', 'critical'],
  //             default: null
  //         },
  //         round2: {
  //             type: String,
  //              enum: ['healthy', 'at_risk', 'critical'],
  //             default: null
  //         },
  //         round3: {
  //             type: String,
  //              enum: ['healthy', 'at_risk', 'critical'],
  //             default: null
  //         },
  //         offered: {
  //             type: String,
  //              enum: ['healthy', 'at_risk', 'critical'],
  //             default: null
  //         }
  //     },
  //     jobInfo: {
  //       curated: {
  //           type: Number
  //       },
  //       round1: {
  //           type: Number
  //       },
  //       round2: {
  //           type: Number
  //       },
  //       round3: {
  //           type: Number
  //       },
  //       offered: {
  //           type: Number
  //       }
  //   }
  // },
  },
  { timestamps: true }
);

var Job = mongoose.model("Job", jobSchema);

module.exports = Job;