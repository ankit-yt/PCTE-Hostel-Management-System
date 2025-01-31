const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/users');
const studentRoutes = require('./routes/students');
const roomRoutes = require('./routes/rooms');
const complaintRoutes = require('./routes/complaints');
const announcementRoutes = require('./routes/announcements');
const http = require('http'); 
const socketIo = require('socket.io');
const path = require('path'); // Import path module to handle file paths
const attendanceRoutes = require('./routes/attendance');    
const bodyParser = require('body-parser');




// Config
dotenv.config();
connectDB();
const app = express();
const server = http.createServer(app); // Create server
const io = socketIo(server); // Initialize socket.io

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json()); 

// Middleware to serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/attendance', attendanceRoutes);


// Socket.IO Setup
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.use(express.static(path.resolve(__dirname, 'Frontend', 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'Frontend', 'dist', 'index.html'));
});


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');
// const userRoutes = require('./routes/users');
// const studentRoutes = require('./routes/students');
// const roomRoutes = require('./routes/rooms');
// const complaintRoutes = require('./routes/complaints');
// const announcementRoutes = require('./routes/announcements');
// const http = require('http'); 
// const socketIo = require('socket.io');


// // Config
// dotenv.config();
// connectDB();
// const app = express();
// const server = http.createServer(app); // Create server
// const io = socketIo(server); // Initialize socket.io





// // Middleware
// app.use(express.json());
// app.use(cors());



// // Routes
// app.use('/api/users', userRoutes);
// app.use('/api/students', studentRoutes);
// app.use('/api/rooms', roomRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/announcements', announcementRoutes);

// // Socket.IO Setup
// io.on('connection', (socket) => {
//     console.log('New client connected');

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });


// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
