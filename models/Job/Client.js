const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    clientName: String,
    contactPersonName: String,
    designationOfContactPerson: String,
    contactNo: Number,
    companyId: {
        type: String,
        required: true
    },
})

var Client = mongoose.model('Client', clientSchema);

module.exports = Client;