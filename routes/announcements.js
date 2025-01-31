// routes/announcements.js
const express = require('express');
const Announcement = require('../models/Announcement');
const router = express.Router();
const { io } = require('../server'); // Import the io instance

// Create a new announcement
router.post('/', async (req, res) => {
    const { title, content } = req.body;
    try {
        const announcement = new Announcement({ title, content });
        await announcement.save();
        
        // Emit new announcement to all clients
        io.emit('newAnnouncement', announcement);
        
        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ message: 'Error creating announcement', error: error.message });
    }
});

// Get all announcements
router.get('/', async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 });
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements', error: error.message });
    }
});

// Delete an announcement
router.delete('/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id);
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting announcement', error: error.message });
    }
});

module.exports = router;