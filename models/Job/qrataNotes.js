const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const questionsByRoleSchema = new Schema({
            id: String,
            question: String,
            ans: String,
            comment: String,
            name:String,
            date: String
})

const workSampleSchema = new Schema({
    company: String,
    assignmentLink: String,
    comment: String,
    date: { type: Date, default: Date.now }
})

module.exports = {questionsByRoleSchema, workSampleSchema };