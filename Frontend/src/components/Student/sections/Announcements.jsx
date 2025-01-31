// components/sections/Announcements.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io(`${window.location.origin}`); // Your backend URL

function Announcements({ isDarkTheme }) {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white h-full p-6",
        header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
        announcementCard: "bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-[101%]",
        title: "text-lg font-bold",
        content: "text-gray-300 mt-2",
        date: "text-sm text-gray-500",
        loading: "text-cyan-400 animate-pulse text-center",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900 h-full p-6",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        announcementCard: "bg-white rounded-lg shadow-lg p-4 transition-transform duration-300 hover:scale-[101%]",
        title: "text-lg font-bold",
        content: "text-gray-700 mt-2",
        date: "text-sm text-gray-500",
        loading: "text-blue-600 animate-pulse text-center",
    };

    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/announcements`);
                setAnnouncements(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching announcements:", error);
                setLoading(false);
            }
        };

        fetchAnnouncements();

        // Listen for new announcements
        socket.on('newAnnouncement', (announcement) => {
            setAnnouncements(prev => [announcement, ...prev]); // Add new announcement to the top
        });

        return () => {
            socket.off('newAnnouncement'); // Cleanup listener
        };
    }, []);

    if (loading) return <div className={theme.loading}>Loading announcements...</div>;

    return (
        <div className={theme.container}>
            <h2 className={theme.header}>Announcements</h2>
            {announcements.length === 0 ? (
                <p className="text-center ">No announcements available.</p>
            ) : (
                <ul className="space-y-4">
                    {announcements.map((announcement) => (
                        <li key={announcement._id} className={theme.announcementCard}>
                            <h3 className={theme.title}>{announcement.title}</h3>
                            <p className={theme.content}>{announcement.content}</p>
                            <p className={theme.date}>{new Date(announcement.createdAt).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Announcements;