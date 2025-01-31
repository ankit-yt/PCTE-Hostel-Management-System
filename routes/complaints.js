// routes/complaints.js
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new complaint
router.post('/', async (req, res) => {
    try {
        const complaint = new Complaint({
            studentName: req.body.studentName,
            complaintText: req.body.complaintText,
            status: 'Pending', // Set initial status to Pending
        });
        await complaint.save();
        res.status(201).json(complaint);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Resolve a complaint by ID
router.put('/:id/resolve', async (req, res) => {
    try {
        const { announcement } = req.body;
        const complaint = await Complaint.findByIdAndUpdate(req.params.id, {
            resolved: true,
            announcement,
            status: `Solved: ${announcement}`, // Update status to solved with announcement
        }, { new: true });

        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(200).json(complaint); // Return the updated complaint
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a complaint by ID
router.delete('/:id', async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(req.params.id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all complaints for a specific student
router.get('/:studentName', async (req, res) => {
    try {
        const complaints = await Complaint.find({ studentName: req.params.studentName });
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;