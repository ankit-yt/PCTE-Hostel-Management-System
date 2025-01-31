// /server/routes/rooms.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User');

// Route to create a new room
router.post('/', async (req, res) => {
    const { roomNumber, capacity, hostel } = req.body;
    try {
        const newRoom = new Room({ roomNumber, capacity, hostel });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating room' });
    }
});

// Route to fetch all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
});

router.get('/', async (req, res) => {
    const { hostel } = req.query; // Get the hostel from query parameters
    try {
      let rooms;
      if (hostel) {
        // Filter rooms by hostel if the query parameter is provided
        rooms = await Room.find({ hostel });
      } else {
        // Fetch all rooms if no hostel is specified
        rooms = await Room.find();
      }
      res.json(rooms);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching rooms' });
    }
  });

router.get('/available', async (req, res) => {
    try {
        const availableRooms = await Room.find({ occupied: { $lt: '$capacity' } });
        res.json(availableRooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching available rooms' });
    }
});

// Route to update an existing room
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { roomNumber, capacity, hostel } = req.body;
    try {
        const updatedRoom = await Room.findByIdAndUpdate(id, { roomNumber, capacity, hostel }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating room' });
    }
});

// Route to transfer a student from one room to another
router.put('/:id/transfer/:studentId', async (req, res) => {
    const { id, studentId } = req.params; // id = current room ID, studentId = student ID
    const { newRoomId } = req.body; // newRoomId = target room ID

    try {
        // Find the current room
        const currentRoom = await Room.findById(id);
        if (!currentRoom) {
            return res.status(404).json({ message: 'Current room not found' });
        }

        // Find the target room
        const targetRoom = await Room.findById(newRoomId);
        if (!targetRoom) {
            return res.status(404).json({ message: 'Target room not found' });
        }

        // Check if the target room has space
        if (targetRoom.occupied >= targetRoom.capacity) {
            return res.status(400).json({ message: 'Target room is full' });
        }

        // Find the student in the current room
        const student = currentRoom.students.find(student => student._id.toString() === studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found in current room' });
        }

        // Remove the student from the current room
        currentRoom.students = currentRoom.students.filter(student => student._id.toString() !== studentId);
        currentRoom.occupied -= 1; // Decrement occupied count
        await currentRoom.save();

        // Add the student to the target room
        targetRoom.students.push(student);
        targetRoom.occupied += 1; // Increment occupied count
        await targetRoom.save();

        // Update the student's room number in the User model
        const user = await User.findOne({ rollNumber: student.rollNumber });
        if (!user) {
            return res.status(404).json({ message: 'Student not found in User database' });
        }

        user.roomNumber = targetRoom.roomNumber; // Update the room number
        await user.save();

        res.json({ message: 'Student transferred successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error transferring student' });
    }
});

// Route to delete a room
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting room' });
    }
});

// Route to delete a student from a room
router.delete('/:id/students/:studentId', async (req, res) => {
    const { id, studentId } = req.params;
    try {
        const room = await Room.findById(id);
        room.students = room.students.filter(student => student._id.toString() !== studentId);
        room.occupied = room.students.length; // Update the occupied count
        await room.save();
        res.json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting student' });
    }
});



// Route to get students in a specific room
router.get('/:id/students', async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findById(id);
        res.json(room.students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Route to add a student to a room
// Route to add a student to a room
router.post('/:id/students', async (req, res) => {
    const { id } = req.params;
    const { rollNumber } = req.body; // Only rollNumber is needed to find the student

    try {
        // Find the room by ID
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        // Check if the room is full
        if (room.occupied >= room.capacity) {
            return res.status(400).json({ message: 'Room is full' });
        }

        // Find the student in the User model
        const student = await User.findOne({ rollNumber });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check if the student is already assigned to a room
        if (student.roomNumber) {
            return res.status(400).json({ message: 'Student is already assigned to a room' });
        }

        // Add the student to the room
        room.students.push({ rollNumber: student.rollNumber, name: student.name });
        room.occupied += 1; // Increment occupied count
        await room.save();

        // Update the student's room number in the User model
        student.roomNumber = room.roomNumber; // Update the room number
        await student.save();

        res.status(201).json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding student' });
    }
});

// Check if a student exists in the database
router.get('/check-student/:id', async (req, res) => {
    try {
      const student = await User.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ exists: false });
      }
      res.status(200).json({ exists: true });
    } catch (error) {
      res.status(500).json({ message: 'Error checking student', error: error.message });
    }
  });


module.exports = router;