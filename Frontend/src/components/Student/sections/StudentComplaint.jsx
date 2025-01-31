import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentComplaint({ studentName, studentRoom, isDarkTheme }) {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComplaint, setNewComplaint] = useState("");

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 h-screen overflow-auto flex flex-col items-center",
        card: "bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-2xl backdrop-blur-lg bg-opacity-80",
        header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
        input: "w-full p-4 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        textarea: "w-full p-4 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none h-32 mb-6",
        button: "w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white font-semibold tracking-wide shadow-md transition-all duration-300 ease-in-out transform hover:scale-105",
        loading: "text-center text-gray-400",
        error: "text-center text-red-400",
        complaintCard: "p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 ease-in-out transform hover:scale-[101%] mb-4",
        resolved: "bg-green-700 bg-opacity-80",
        unresolved: "bg-red-700 bg-opacity-80",
        complaintText: "text-xl font-semibold text-white mb-2",
        date: "text-sm text-gray-300",
        status: "text-xs mt-1 font-semibold",
        resolvedText: "text-green-400",
        unresolvedText: "text-red-400",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900 p-6 h-screen overflow-auto flex flex-col items-center",
        card: "bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl backdrop-blur-lg bg-opacity-80",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        input: "w-full p-4 rounded-lg bg-gray-200 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none mb-6",
        textarea: "w-full p-4 rounded-lg bg-gray-200 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none h-32 mb-6",
        button: "w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold tracking-wide shadow-md transition-all duration-300 ease-in-out transform hover:scale-105",
        loading: "text-center text-blue-400",
        error: "text-center text-red-600",
        complaintCard: "p-6 rounded-lg shadow-lg border border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-[101%] mb-4",
        resolved: "bg-green-200 bg-opacity-80",
        unresolved: "bg-red-200 bg-opacity-80",
        complaintText: "text-xl font-semibold text-gray-900 mb-2",
        date: "text-sm text-gray-600",
        status: "text-xs mt-1 font-semibold",
        resolvedText: "text-green-600",
        unresolvedText: "text-red-600",
    };

    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/complaints/${studentName}`);
                setComplaints(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [studentName]); // Add studentName as a dependency

    const handleSubmitComplaint = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${window.location.origin}/api/complaints`, {
                studentName,
                complaintText: newComplaint,
            });
            setComplaints((prev) => [...prev, response.data]);
            setNewComplaint("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className={theme.container}>
            <div className={theme.card}>
                <h1 className={theme.header}>Student Complaints</h1>

                {loading && <p className={theme.loading}>Loading complaints...</p>}
                {error && <p className={theme.error}>{error}</p>}

                {/* Complaint Submission Form */}
                <form onSubmit={handleSubmitComplaint} className="w-full">
                    <input
                        type="text"
                        value={studentName}
                        readOnly
                        className={theme.input}
                    />
                    <textarea
                        className={theme.textarea}
                        placeholder="Write your complaint here..."
                        value={newComplaint}
                        onChange={(e) => setNewComplaint(e.target.value)}
                    />
                    <button type="submit" className={theme.button}>
                        Submit Complaint
                    </button>
                </form>

                {/* Complaint Cards */}
                <div className="mt-8 w-full">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint._id} // Use complaint._id instead of complaint.id
                            className={`${theme.complaintCard} ${complaint.resolved ? theme.resolved : theme.unresolved}`}
                        >
                            <p className={theme.complaintText}>{complaint.complaintText}</p>
                            <p className={theme.date}>{new Date(complaint.date).toLocaleString()}</p>
                            <p className={`${theme.status} ${complaint.resolved ? theme.resolvedText : theme.unresolvedText}`}>
                                {complaint.status}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default StudentComplaint;
