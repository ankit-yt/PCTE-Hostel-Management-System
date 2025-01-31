// routes/attendance.js
const express = require('express');
const Attendance = require('../models/Attendance');
const User = require('../models/User'); // Import User model to validate student
const router = express.Router();

// Create attendance record
router.post('/', async (req, res) => {
    const { studentId, date, status } = req.body;

    try {
        const attendance = new Attendance({ studentId, date, status });
        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(400).json({ message: 'Error creating attendance record', error: error.message });
    }
});

// Check if attendance has been submitted today
router.get('/today/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    try {
        const attendance = await Attendance.findOne({
            studentId,
            date: { $gte: startOfDay, $lte: endOfDay }
        });

        if (attendance) {
            return res.status(200).json({ submitted: true, attendance });
        } else {
            return res.status(200).json({ submitted: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance', error: error.message });
    }
});



router.get('/', async (req, res) => {
    const { role } = req.query; // Get role from query parameters
    try {
        const users = role ? await User.find({ role }) : await User.find(); // Filter by role if provided
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get attendance records for a specific student on a specific date
router.get('/:studentId/:date', async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({
            studentId: req.params.studentId,
            date: { $gte: new Date(req.params.date), $lt: new Date(new Date(req.params.date).setDate(new Date(req.params.date).getDate() + 1)) }
        });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
    }
});

// Get attendance records for a specific student
router.get('/:studentId', async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find({ studentId: req.params.studentId }).sort({ date: -1 });
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
    }
});

// Update attendance record
router.put('/:id', async (req, res) => {
    const { status } = req.body;

    try {
        const attendance = await Attendance.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(400).json({ message: 'Error updating attendance record', error: error.message });
    }
});

// Delete attendance record
router.delete('/:id', async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete(req.params.id);
        if (!attendance) {
            return res.status(404).json({ message: 'Attendance record not found' });
        }
        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting attendance record', error: error.message });
    }
});

module.exports = router;