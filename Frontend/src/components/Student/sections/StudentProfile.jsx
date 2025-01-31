// components/sections/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentProfile({ studentId, isDarkTheme }) {
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
        card: "bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl p-8 w-96 transform transition-transform duration-500 hover:scale-[102%] hover:shadow-3xl",
        header: "mt-4 text-3xl font-extrabold text-teal-400 tracking-wide",
        text: "text-gray-300",
        loading: "text-teal-400 animate-pulse",
        error: "text-red-500",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
        card: "bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl p-8 w-96 transform transition-transform duration-500 hover:scale-[102%] hover:shadow-3xl",
        header: "mt-4 text-3xl font-extrabold text-blue-600 tracking-wide",
        text: "text-gray-700",
        loading: "text-blue-600 animate-pulse",
        error: "text-red-600",
    };

    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/users/${studentId}`);
                setStudentData(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
            } finally {
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        }
    }, [studentId]);

    if (loading) return <div className={`text-center ${theme.loading}`}>Loading...</div>;
    if (error) return <div className={`text-center ${theme.error}`}>Error: {error}</div>;
    if (!studentData) return null;

    return (
        <div className={`flex justify-center items-center min-h-screen ${theme.container}`}>
            <div className={`${theme.card} backdrop-blur-lg bg-opacity-20 shadow-xl`}>
                <div className="relative z-10 flex flex-col items-center space-y-6">
                    <div className="relative">
                        <img 
                            src={`${window.location.origin}/${studentData.image}`} 
                            alt={`${studentData.name}'s profile`}
                            className="w-40 h-40 rounded-full border-8 border-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 object-cover shadow-2xl transform transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400 via-indigo-600 to-pink-500 opacity-20"></div>
                    </div>
                    <h2 className={theme.header}>{studentData.name}</h2>
                    <p className="text-sm text-gray-400">{studentData.username}</p>
                </div>

                <div className={`mt-8 space-y-6 ${theme.text}`}>
                    <div className="flex justify-between">
                        <span className="font-semibold text-opacity-80">Roll Number:</span>
                        <span>{studentData.rollNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-opacity-80">Hostel:</span>
                        <span>{studentData.hostel}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-opacity-80">Room Number:</span>
                        <span>{studentData.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-opacity-80">Email:</span>
                        <span>{studentData.email}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold text-opacity-80">Phone:</span>
                        <span>{studentData.phone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentProfile;
