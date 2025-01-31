import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Register() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        role: 'student',
        rollNumber: '',
        hostel: '',
        roomNumber: '',
        name: '', 
        email: '', 
        phone: '',
        image: null
    });
    
    const [availableRooms, setAvailableRooms] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            if (userData.hostel) {
                try {
                    const response = await axios.get(`${window.location.origin}/api/rooms`, {
                        params: { hostel: userData.hostel }
                    });
                    const filteredRooms = response.data.filter(room => room.occupied < room.capacity);
                    setAvailableRooms(filteredRooms);
                } catch (err) {
                    setMessage('Error fetching rooms');
                }
            } else {
                setAvailableRooms([]);
            }
        };

        fetchRooms();
    }, [userData.hostel]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setUserData({
            ...userData,
            image: e.target.files[0] // Store the selected file
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all user data to FormData
        for (const key in userData) {
            formData.append(key, userData[key]);
        }
        try {
            const response = await axios.post(`${window.location.origin}/api/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Specify the content type
                }
            });
            setMessage(response.data.message);
            // Reset form fields after successful submission
            setUserData({
                username: '',
                password: '',
                role: 'student',
                rollNumber: '',
                hostel: '',
                roomNumber: '',
                name: '', 
                email: '', 
                phone: '',
                image: null
            });
            setAvailableRooms([]); // Reset available rooms
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error occurred.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#EBEFFF] p-4">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-center mb-4">Register New User</h2>
                {message && <p className="text-center text-red-500 mb-2">{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                            name="role"
                            value={userData.role}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="warden">Warden</option>
                            <option value="student">Student</option>
                        </select>
                    </div>

                    <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Student Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    accept="image/*" // Accept only image files
                                    required
                                />
                            </div>

                    {userData.role === 'student' && (
                        <>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Roll Number</label>
                                <input
                                    type="text"
                                    name="rollNumber"
                                    value={userData.rollNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Hostel</label>
                                <input
                                    type="text"
                                    name="hostel"
                                    value={userData.hostel}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Room Number</label>
                                <select
                                    name="roomNumber"
                                    value={userData.roomNumber}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Room</option>
                                    {availableRooms.length > 0 ? (
                                        availableRooms.map((room) => (
                                            <option key={room._id} value={room.roomNumber}>
                                                {room.roomNumber}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">No rooms available</option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            
                        </>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#241553] text-white py-2 rounded-lg hover:bg-[#1d1240]"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;