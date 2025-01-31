// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'warden', 'student'] },
    rollNumber: { type: String }, // Optional for non-students
    hostel: { type: String },      // Optional for non-students
    roomNumber: { type: String },  // Optional for non-students
    name: { type: String }, // New field
    email: { type: String }, // New field
    phone: { type: String }, // New field
    image: { type: String , required: true }, // New field 
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Match entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);