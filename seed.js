// seedData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./models/Student');
const connectDB = require('./config/db');

dotenv.config();

const sampleStudents = [
    {
        name: 'Alice Smith',
        rollNumber: 'CS101',
        hostel: 'Hostel A',
        roomNumber: '101'
    },
    {
        name: 'Bob Johnson',
        rollNumber: 'CS102',
        hostel: 'Hostel B',
        roomNumber: '202'
    },
    {
        name: 'Charlie Brown',
        rollNumber: 'CS103',
        hostel: 'Hostel A',
        roomNumber: '103'
    },
    {
        name: 'Diana Prince',
        rollNumber: 'CS104',
        hostel: 'Hostel C',
        roomNumber: '204'
    },
    {
        name: 'Edward Elric',
        rollNumber: 'CS105',
        hostel: 'Hostel B',
        roomNumber: '105'
    }
];

const seedDatabase = async () => {
    await connectDB();
    
    // Clear existing students
    await Student.deleteMany({});
    
    // Insert sample students
    await Student.insertMany(sampleStudents);
    console.log('Sample data inserted successfully!');
    
    // Close the connection
    mongoose.connection.close();
};

seedDatabase().catch((error) => {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
});