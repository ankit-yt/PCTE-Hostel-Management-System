// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: true }, // Reference to the student
    date: { type: Date, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }, // Status can be Present or Absent
});

module.exports = mongoose.model('Attendance', attendanceSchema);