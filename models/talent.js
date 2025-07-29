const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var educationSchema = require("./educationSchema");
var projectSchema = require("./projectSchema");
var workExSchema = require("./workExSchema");
var personalityAssessmentSchema = require("./personalityAssessmentSchema");
var generalAssessmentSchema = require("./generalAssessmentSchema");
var careerGoalSchema = require("./careerGoalSchema");
// const {
//   questionsByRoleSchema,
//   workSampleSchema,
// } = require("../ats/qrataNotes");
// var referenceInfoSchema = require("../ats/referenceSchema");
var workSampleProjectSchema = require("./workSampleProjectSchema");
var certificateSchema = require("./certificateSchema");
var candidateDocumentSchema = require("./candidateDocumentSchema");

const talentSchema = new Schema(
  {
    firstName: {
      type: String,
      // required: true
    },
    lastName: {
      type: String,
      // required: true
    },
    principlesUserId: {
      type: String,
    },
    principlesShortAssessment: Object,
    principlesAssessmentProgress: {
      type:Number,
      default:0
    },
    whatMakesYouJoinHighpo: {
      type: String,
    },
    account: {
      email: String,
      google: String,
    },
    DOB: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
    },
    // top3Skills: {
    //   type: Array,
    // },
    top3Skills: [
      {
        name: { type: String,},
        score: { type: Number,  }
      }
    ],
    
    isClaimed: {
      type: Boolean,
      default: false,
    },
    setup: {
      type: String,
      default: "resume",
    },
    profileSetup: {
      personalityAssessment: {
        type: String,
        default: false,
      },
      generalAssessment: {
        type: String,
        default: false,
      },
      preference: {
        type: String,
        default: "0",
      },
      coreValues: {
        type: Boolean,
        default: false,
      },
      organisationValues: {
        type: Boolean,
        default: false,
      },
      personalDetails: {
        type: String,
        default: "zero",
      },
      education: {
        type: Boolean,
        default: false,
      },
      experience: {
        type: Boolean,
        default: false,
      },
      projects: {
        type: Boolean,
        default: false,
      },
      resume: {
        type: Boolean,
        default: false,
      },
    },
    contactNumber: {
      type: String,
      // required: true
    },
    whatsAppNotify: {
      type: Boolean
    },
    resume: {
      type: String,
      // required: true
    },
    resumeURL: {
      type: String,
    },
    resumeUploadedOn: String,
    resumeOrignalName: {
      type: String,
    },
    summary: {
      type: String,
    },
    currentLocation: {
      type: String,
    },
    preferredLocation: {
      type: Array,
    },
    currentDesignation: {
      type: String,
    },
    functionalArea: {
      type: String,
    },
    industrySector: {
      type: String,
    },
    preferredDesignation: {
      type: Array,
    },
    currentSalary: {
      type: Number,
    },
    currentCurrencyType: {
      type: String,
    },
    preferenceCurrencyType: {
      type: String,
    },
    preferredSalaryPerHour: {
      type: Number,
    },
    preferredSalaryPerHourCurrency: {
      type: String,
    },
    preferredSalary: {
      type: Number,
    },
    currentSalaryPerHour: {
      type: Number,
    },

    preferenceCurrencyType: {
      type: String,
    },

    timeCommitment: {
      type: Number,
    },
    timeCommitmentType: {
      type: String,
    },
    timeCommitmentComments: {
      type: String,
    },
    noticePeriod: {
      type: String,
    },
    experience: {
      type: Number,
    },
    coreValues: {
      type: Array,
    },
    organisationValues: {
      type: Array,
    },
    languages: {
      type: Array,
    },
    relocation: {
      type: Boolean,
    },
    differentlyAbled: {
      type: Boolean,
      default: false,
    },
    backwardSociety: {
      type: Boolean,
      default: false,
    },
    LGBTCandidate: {
      type: Boolean,
      default: false,
    },
    differentlyAbledDescription: {
      type: String,
    },
    // leadership: Boolean,
    leadership: {
      success: {
        type: Boolean,
      },
      level: {
        type: String,
      },
      experience: {
        type: Array,
      },
      description: {
        type: String,
      },
    },
    skills: {
      type: Array,
    },
    profilePicture: {
      type: String,
    },
    profilePictureURL: {
      type: String,
    },
    videoResume: {
      type: String,
    },
    currentCompany: String,
    typeCompanyPreference: {
      type: Array,
    },
    companySizeLookingFor: {
      type: String,
    },
    whereAreYouJobSearch: {
      type: String,
    },
    typeOfEmployment: {
      Permanent: {
        type: Boolean,
        default: false,
      },
      Contract: {
        type: Boolean,
        default: false,
      },
      Intern: {
        type: Boolean,
        default: false,
      },
      Freelance: {
        type: Boolean,
        default: false
      },
      Fresher: {
        type: Boolean,
        default: false
      }
    },
    modeOfWork: {
      Onsite: {
        type: Boolean,
        default: false,
      },
      Remote: {
        type: Boolean,
        default: false,
      },
      Hybrid: {
        type: Boolean,
        default: false,
      },
    },
    workLinks: {
      githubLink: {
        type: String,
        default: null,
      },
      linkedinLink: {
        type: String,
        default: null,
      },
      portfolioLink: {
        type: String,
        default: null,
      },
      twitterLink: {
        type: String,
        default: null,
      },
      dribblLink: {
        type: String,
        default: null,
      },
      behanceLink: {
        type: String,
        default: null,
      },
    },


    // veriStat: {
    //   proAddBy: { type: String, default: null },
    //   pod_group: { type: String, default: null },
    //   curBy: { type: String },
    //   curDate: { type: Date },
    //   // curSt: { type: Boolean, default: false },
      // curSt: { 
      //   // type: Schema.Types.Mixed,
      //   type: String,
      //   default: "to_vet",
      //   enum: ['to_vet', 'partially_vetted', 'fully_vetted', 'criteria_mismatch'] // Enum defining allowed values for the 'role' field
      // },  // Can be string, boolean, number, etc. },
    //   qaBy: { type: String },
    //   qaDate: { type: Date },
    //   qaSt: { type: Boolean, default: false },
      // curSt: { 
      //    type: Schema.Types.Mixed,
      //    default: "to_vet",
      //    enum: ['to_vet', 'partially_vetted', 'fully_vetted', 'criteria_mismatch'] // Enum defining allowed values for the 'role' field
      //  },  // Can be string, boolean, number, etc. },
    // },

    veriStat: {
      proAddBy: { type: String, default: null },
      pod_group: { type: String, default: null },
      curBy: { type: String },
      curDate: { type: Date },
      curSt: { type: String, default: "to_vet", enum: ['to_vet', 'partially_vetted', 'fully_vetted', 'criteria_mismatch']}, // Enum defining allowed values for the 'role' field },
      qaBy: { type: String },
      qaDate: { type: Date },
      qaSt: { type: Boolean, default: false },
    },


    communicationSkills: Number,
    qrataNotes: {
      roleType: String,
      // questionsByRole: [questionsByRoleSchema],
      // workSample: [workSampleSchema],
      verificationIndicator: {
        salary: {
          type: String,
          document: String,
        },
        referenceInfo: String,
        SkillAndCapability: String,
      },
    },
    referenceInfo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "referenceInfo",
      },
    ],
    parsedResumeData: {
      resumeAnalytics: {
        bravity: Array,
        bulletPoint: Number,
        length: Number,
        sentiment: String,
        softSkill: Array,
        style: Array,
        overall: Array,
        wordUsed: Number,
        resumeRating: Array,
      },
      educationResume: Array,
      workExperienceResume: Array,
      experience: String,
      Location: String,
      PhoneNo: String,
      AllParsedData: Object,
    },

    contractMode: {
      projectExperienceSummary: String,
      experience: Number,
      hourlyWages: Number,
      monthlyWages: Number,
      hoursAvailablePerWeek: Number,
      currency: String,
    },

    role: {
      role_type: String,
      subCategory: String,
    },



    education: [educationSchema],
    projects: [projectSchema],
    workExperience: [workExSchema],
    personalityAssessment: [personalityAssessmentSchema],
    generalAssessment: [generalAssessmentSchema],
    careerGoal: [careerGoalSchema],
    strengths: {
      type: Array,
    },
    opportunities: {
      type: Array,
    },
    searchTag: {
      type: Array,
    },
    candidate_Analytics_feedback: {
      background: {
        type: String,
      },
      motivation: {
        type: String,
      },
      positive: {
        type: String,
      },
      concerns: {
        type: String,
      },
      passions: {
        type: String,
      },
    },
    potentials: {
      interview_Analysis: {
        type: String,
        default: "NA",
      },
      lastedEditedByEmail: {
        type: String,
        default: "NA",
      },
      lastedEditedByName: {
        type: String,
        default: "NA",
      },
    },  
    groups: {
      type: Array
    },
    jobStatus: {
      type: String
    },
    companyType: {
      type: Array
    },
    companySize: {
      type: Array
    },
    companyTypeLookingFor: {
      type: String,
    },
    verificationCode: String,
    workSampleProject: [workSampleProjectSchema],
    certificates: [certificateSchema],
    candidateDocuments: [candidateDocumentSchema],
    confirmed: {
      type: Boolean,
      default: false,
    },
    requested: {
      workSampleProject: {
        isRequested: {
          type: Boolean,
          default: false
        },
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User', // Assuming 'User' is the name of your User model
          default: null
        },
        date: {
          type: Date,
          default: null
        }
      },
      projects: {
        isRequested: {
          type: Boolean,
          default: false
        },
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          default: null
        },
        date: {
          type: Date,
          default: null
        }
      },
      referenceInfo: {
        isRequested: {
          type: Boolean,
          default: false
        },
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          default: null
        },
        date: {
          type: Date,
          default: null
        }
      },
      capabilities: {
        isRequested: {
          type: Boolean,
          default: false
        },
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          default: null
        },
        date: {
          type: Date,
          default: null
        }
      },
      video: {
        isRequested: {
          type: Boolean,
          default: false
        },
        requestedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          default: null
        },
        date: {
          type: Date,
          default: null
        }
      }
    },
    rapid_fire: {
      video_url: {
        type: String,
        default: null,
      },
      audio_url: {
        type: String,
        default: null,
      },
      transcription: {
        type: String,
        default: null,
      },
      analysis: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        enum: ["pending", "processing", "completed", "failed"],
        default: "pending",
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

talentSchema.plugin(passportLocalMongoose, {
  selectFields: "username firstName lastName password email", //Space seperate the required fields
});

var Talent = mongoose.model("Talent", talentSchema);
// var Talent = mongoose.model('Taents_fresh', talentSchema);

module.exports = Talent;