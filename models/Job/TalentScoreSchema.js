const mongoose = require('mongoose');

const TalentScoreSchema = new mongoose.Schema({

    talentId: {
        type: String,
        required: true
    },
    templateId: {
        type: String,
        required: true
    },
    jobId: {
        type: String,
        required: true
    },
    summary: {
        type: String,
    },
    scores: [
        {
            dimension: {
                type: String,
                required: true
            },
            criteria: {
                type: String,
            },
            whatToEvaluate: {   // 🔁 renamed field
                type: String,
            },
            whatToLookFor: {   // 🔁 renamed field
                type: String,
            },
            comment: {
                type: String,
            },
            score: {
                type: String,
            }
        }
    ],
    

},{timestamps : true});

module.exports = mongoose.model('TalentScore', TalentScoreSchema);