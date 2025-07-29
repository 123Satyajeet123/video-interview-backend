const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const filter = new Schema({
     type : { 
         type: String
        },
    city : [String],
    designation :[String],
    skill :[String],
    searchTag:[String],
    recruiter:[Object],
    client:[String],
    pod:[String]
})

// module.exports = filter;
module.exports = mongoose.model('filter', filter);