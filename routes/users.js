// routes/users.js
const express = require('express');
const User = require('../models/User');
const Room = require('../models/Room'); // Import the Room model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Create a new user
router.post('/', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error: error.message });
    }
});

// Get all users
router.get('/', async (req, res) => {
    const { role } = req.query; // Get the role from query parameters
    try {
        const query = role ? { role } : {}; // If a role is specified, filter by that role
        const users = await User.find(query);
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// Update a user
// Update a user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the filename
    }
});

const upload = multer({ storage });

// Register a new user
router.post('/register', upload.single('image'), async (req, res) => {
    const { username, password, role, rollNumber, hostel, roomNumber, name, email, phone } = req.body;
    const imagePath = req.file ? req.file.path : null; // Get the file path from Multer

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists.' });
        }

        const newUser = new User({
            username,
            password,
            role,
            rollNumber: role === 'student' ? rollNumber : undefined,
            hostel: role === 'student' ? hostel : undefined,
            roomNumber: role === 'student' ? roomNumber : undefined,
            name,
            email,
            phone,
            image: imagePath // Save the image path in the user document
        });

        // Save the new user to the database
        await newUser.save();

        // If the user is a student, update the corresponding room
        if (role === 'student') {
            const room = await Room.findOne({ roomNumber, hostel });
            if (room) {
                if (room.occupied < room.capacity) {
                    room.students.push({ rollNumber, name: username }); // Adding student to the room
                    room.occupied += 1; // Increment the occupied count
                    await room.save();
                } else {
                    return res.status(400).json({ message: 'Room is full. Cannot add student.' });
                }
            } else {
                return res.status(404).json({ message: 'Room not found.' });
            }
        }

        res.status(201).json({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred during registration.', error: error.message });
    }
});

// Login a user with role validation
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Find user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the user role matches
        if (user.role !== role) {
            return res.status(403).json({ error: 'Role conflict: You are not authorized to log in as this role' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send back the token and studentId
        res.status(200).json({ token, studentId: user._id }); // Include studentId in the response
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

module.exports = router;