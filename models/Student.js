// models/student.js
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    hostel: { type: String, required: true },
    roomNumber: { type: String, required: true },
});

// Generate a unique student ID
StudentSchema.pre('save', async function (next) {
    if (this.isNew) {
        this.studentId = `STU${Math.floor(1000 + Math.random() * 9000)}`;
    }
    next();
});

module.exports = mongoose.model('Student', StudentSchema);