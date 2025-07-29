const mongoose = require('mongoose');

const TalentScoreTemplateSchema = new mongoose.Schema({

    
    templateName: {
        type: String,
        required: true
    },
    templateDescription: {
        type: String,
    },
    templateType: {
        type: String,
    },
    templateFields: [
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
        }
    ],

},{timestamps : true});

module.exports = mongoose.model('TalentScoreTemplate', TalentScoreTemplateSchema);