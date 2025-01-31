import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StudentAttendance({ studentId, isDarkTheme }) {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/attendance/${studentId}`);
                setAttendanceRecords(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [studentId]);

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
        header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
        table: "bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg",
        rowHover: "hover:bg-gray-700",
        date: "px-6 py-4 border-b border-gray-700",
        statusPresent: "text-green-400",
        statusAbsent: "text-red-400",
        loading: "text-cyan-400 animate-pulse",
        error: "text-red-500",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        table: "bg-gradient-to-r from-white to-gray-100 rounded-lg shadow-lg",
        rowHover: "hover:bg-blue-100",
        date: "px-6 py-4 border-b border-gray-300",
        statusPresent: "text-green-700",
        statusAbsent: "text-red-700",
        loading: "text-blue-600 animate-pulse",
        error: "text-red-600",
    };

    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    if (loading) {
        return <p className={`text-center ${theme.loading}`}>Loading attendance records...</p>;
    }

    if (error) {
        return <p className={`text-center ${theme.error}`}>{error}</p>;
    }

    return (
        <div className={`p-6 min-h-screen overflow-auto ${theme.container}`}>
            <div className="max-w-4xl mx-auto backdrop-blur-md bg-opacity-20 rounded-2xl p-6 shadow-xl">
                <h2 className={theme.header}>Attendance Records</h2>
                {attendanceRecords.length === 0 ? (
                    <p className="text-center text-gray-500">No attendance records available.</p>
                ) : (
                    <table className={`w-full text-left text-sm border-collapse ${theme.table}`}>
                        <thead>
                            <tr className="text-lg">
                                <th className={`${theme.date}`}>Date</th>
                                <th className={`${theme.date}`}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceRecords.map((record) => (
                                <tr
                                    key={record._id}
                                    className={`transition duration-300 ease-in-out ${theme.rowHover}`}
                                >
                                    <td className={theme.date}>
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td
                                        className={`${theme.date} ${
                                            record.status === 'Present'
                                                ? theme.statusPresent
                                                : theme.statusAbsent
                                        } font-semibold`}
                                    >
                                        {record.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default StudentAttendance;
