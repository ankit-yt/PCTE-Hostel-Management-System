const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/userController');

// Routes
router.post('/login', loginUser);
router.post('/register', registerUser); // Optional, for testing

module.exports = router;
