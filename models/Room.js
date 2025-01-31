// /server/models/Room.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    }
});

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
    },
    hostel: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    occupied: {
        type: Number,
        default: 0,
    },
    students: [studentSchema] // Array of students
});

module.exports = mongoose.model('Room', roomSchema);