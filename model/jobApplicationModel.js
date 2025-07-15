const mongoose = require('mongoose')

const jobApplicationSchema = mongoose.Schema({
    jobTitle: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    }
})

const jobApplication = mongoose.model('jobApplication', jobApplicationSchema)

module.exports = jobApplication