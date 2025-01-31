import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WardenComplaint({isDarkTheme}) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [announcements, setAnnouncements] = useState({});

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black h-full overflow-auto text-white p-8",
        header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
        loading: "text-center text-gray-400",
        error: "text-center text-red-500",
        complaintCard: "bg-opacity-60 backdrop-blur-md p-6 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl",
        section: "space-y-4",
        sectionTitle: "font-semibold text-lg text-gray-300",
        sectionContent: "text-sm text-gray-200",
        time: "text-sm text-gray-400",
        status: "text-sm font-medium",
        resolved: "text-green-500",
        unresolved: "text-red-500",
        input: "bg-gray-700 p-3 rounded-md text-gray-200 placeholder-gray-400 w-full",
        button: "bg-green-600 text-white p-3 rounded-md w-full hover:bg-green-700 transition-all duration-300",
        deleteButton: "bg-red-600 text-white p-3 rounded-md w-full hover:bg-red-700 transition-all duration-300",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 h-full overflow-auto text-gray-900 p-8",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        loading: "text-center text-blue-400",
        error: "text-center text-red-600",
        complaintCard: "bg-white bg-opacity-80 rounded-xl shadow-lg p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-2xl",
        section: "space-y-4",
        sectionTitle: "font-semibold text-lg text-gray-900",
        sectionContent: "text-sm text-gray-800",
        time: "text-sm text-gray-600",
        status: "text-sm font-medium",
        resolved: "text-green-600",
        unresolved: "text-red-600",
        input: "bg-gray-200 p-3 rounded-md text-gray-900 placeholder-gray-600 w-full",
        button: "bg-blue-500 text-white p-3 rounded-md w-full hover:bg-blue-600 transition-all duration-300",
        deleteButton: "bg-red-500 text-white p-3 rounded-md w-full hover:bg-red-600 transition-all duration-300",
    };

    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles; // Change to lightThemeStyles if you want to use light theme

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/complaints`);
                setComplaints(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComplaints();
    }, []);

    const handleResolve = async (complaintId) => {
        const announcement = announcements[complaintId];
        if (!announcement.trim()) return; // Prevent empty announcement submissions

        try {
            const response = await axios.put(`${window.location.origin}/api/complaints/${complaintId}/resolve`, {
                announcement,
            });
            setComplaints((prev) =>
                prev.map((complaint) =>
                    complaint._id === complaintId ? response.data : complaint
                )
            );
            setAnnouncements((prev) => ({ ...prev, [complaintId]: '' })); // Clear the specific announcement input
        } catch (err) {
            setError(`Failed to resolve complaint: ${err.message}`);
        }
    };

    const handleDelete = async (complaintId) => {
        try {
            await axios.delete(`${window.location.origin}/api/complaints/${complaintId}`);
            setComplaints((prev) => prev.filter((complaint) => complaint._id !== complaintId));
        } catch (err) {
            setError(`Failed to delete complaint: ${err.message}`);
        }
    };

    return (
        <div className={theme.container}>
            <h2 className={theme.header}>Complaints Dashboard</h2>
            {loading ? (
                <p className={theme.loading}>Loading...</p>
            ) : error ? (
                <p className={theme.error}>{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {complaints.map((complaint) => (
                        <div key={complaint._id} className={theme.complaintCard}>
                            <div className={theme.section}>
                                <div className='flex justify-between'>
                                <div>
                                    <p className={theme.sectionTitle}>Name</p>
                                    <p className={theme.sectionContent}>{complaint.studentName}</p>
                                </div>
                                <div>
                                    <p className={theme.sectionTitle}>Time</p>
                                    <p className={theme.sectionContent}>
                                        {new Date(complaint.date).toLocaleString()}
                                    </p>
                                </div>
                                </div>
                                <div>
                                    <p className={theme.sectionTitle}>Complaint</p>
                                    <p className={theme.sectionContent}>{complaint.complaintText}</p>
                                </div>
                                <div>
                                    <p className={`${theme.status} ${complaint.resolved ? theme.resolved : theme.unresolved}`}>
                                        {complaint.resolved ? 'Resolved' : 'Unresolved'}
                                    </p>
                                </div>
                                {!complaint.resolved && (
                                    <div className="mt-4 space-y-4">
                                        <input
                                            type="text"
                                            value={announcements[complaint._id] || ''}
                                            onChange={(e) => setAnnouncements((prev) => ({
                                                ...prev,
                                                [complaint._id]: e.target.value,
                                            }))}
                                            placeholder="Enter announcement"
                                            className={theme.input}
                                        />
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleResolve(complaint._id)}
                                                className={theme.button}
                                            >
                                                Resolve
                                            </button>
                                            
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default WardenComplaint;
