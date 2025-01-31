// models/Complaint.js
const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    studentName: {
        type: String,
        required: true,
    },
    
    complaintText: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    resolved: {
        type: Boolean,
        default: false,
    },
    announcement: {
        type: String,
    },
    status: {
        type: String,
        default: 'Pending', // Default status
    },
});

module.exports = mongoose.model('Complaint', ComplaintSchema);