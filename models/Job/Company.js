const mongoose = require('mongoose');
const talentPoolSchema = require('./talentPoolSchema')

const Company = new mongoose.Schema({
    companyName: {
      type: String,
      required: true,
      unique: true
    },
    companyUrl: {
      type: String,
      required: true,
      unique: true
    },
    // logoImage: {
    //   type: String
    // },
    // bannerImage: {
    //   type: String
    // },
    companyProfile: {
      type: String,
      required: true
    },
    companyFacts: {
      type: String
    },
    techStack: {
      type: []
    },
    perks: {
      type: String
    },
    financialInfo: {
      type: String
    },
    fundingInfo: {
      type: String
    },
    companyType: {
      type: String
    },
    companySize : {
      type : String
    },
    talentpool: [talentPoolSchema],
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    jobs : [{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Job'
    }]
},{timestamps : true});

module.exports = mongoose.model('Company', Company);
