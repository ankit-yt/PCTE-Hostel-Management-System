const express = require('express');
const Room = require('../models/room');
const Complaint = require('../models/complaint');
const Payment = require('../models/payment');
const router = express.Router();

// Get All Users
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get All Rooms
router.get('/rooms', async (req, res) => {
  const rooms = await Room.find().populate('allocated_users');
  res.json(rooms);
});

// Add a Room
router.post('/rooms', async (req, res) => {
  const { room_no, capacity } = req.body;
  const room = new Room({ room_no, capacity });
  await room.save();
  res.status(201).json(room);
});

module.exports = router;
