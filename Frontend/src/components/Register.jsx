import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Register({ isDarkTheme }) {
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
    const hostel = userData.hostel === 'Boys hostel' ? 'Boys hostel' : userData.hostel === 'Girls hostel' ? 'Girls hostel' : '';

    useEffect(() => {
        const fetchRooms = async () => {
            if (hostel) {
                try {
                    const response = await axios.get(`${window.location.origin}/api/rooms`, {
                        params: { hostel }
                    });
                    const roomsByHostel = response.data.filter(room => room.hostel === hostel);
                    const availableRooms = roomsByHostel.filter(room => room.occupied < room.capacity);
                    setAvailableRooms(availableRooms);
                } catch (err) {
                    setMessage('Error fetching rooms');
                    console.error(err);
                }
            } else {
                setAvailableRooms([]);
            }
        };
    
        fetchRooms();
    }, [hostel]);

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
            image: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in userData) {
            formData.append(key, userData[key]);
        }
        try {
            const response = await axios.post(`${window.location.origin}/api/users/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage(response.data.message);
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
            setAvailableRooms([]);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error occurred.');
        }
    };

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black p-4 text-white",
        formContainer: "bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6",
        header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
        input: "w-full px-4 py-2 border text-black border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500",
        button: "w-full bg-green-700 hover:bg-green-500 text-white py-2 rounded-lg hover:bg-[#1d1240]",
        message: "text-red-500 text-center mb-2",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
        formContainer: "bg-white rounded-lg shadow-lg p-6",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        input: "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
        button: "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700",
        message: "text-red-600 text-center mb-2",
    };

    const theme = !isDarkTheme ? darkThemeStyles : lightThemeStyles;

    return (
        <div className={`flex items-center justify-center min-h-screen ${theme.container}`}>
            <div className={theme.formContainer}>
                <h2 className={theme.header}>Register New User</h2>
                {message && <p className={theme.message}>{message}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            className={theme.input}
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
                            className={theme.input}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                            name="role"
                            value={userData.role}
                            onChange={handleInputChange}
                            className={theme.input}
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
                            className={theme.input}
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
                            className={theme.input}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Student Image</label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleFileChange}
                            className={theme.input}
                            accept="image/*"
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
                                    className={theme.input}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Hostel</label>
                                <select name="hostel" value={userData.hostel} onChange={handleInputChange} className={theme.input} required>
                                    <option value="">Select Hostel</option>
                                    <option value="Boys hostel">Boys hostel</option>
                                    <option value="Girls hostel">Girls hostel</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Room Number</label>
                                <select
                                    name="roomNumber"
                                    value={userData.roomNumber}
                                    onChange={handleInputChange}
                                    className={theme.input}
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
                                    className={theme.input}
                                    required
                                />
                            </div>
                        </>
                    )}
                    <button type="submit" className={theme.button}>
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;