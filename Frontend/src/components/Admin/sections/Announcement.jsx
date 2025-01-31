// src/components/Admin/sections/Announcement.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { motion } from "motion/react"
import { MdDeleteForever } from "react-icons/md";


const socket = io(`${window.location.origin}`); // Connect to the server

function Announcement({isDarkTheme}) {
    const [announcements, setAnnouncements] = useState([]);
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);  // Added loading state

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/announcements`);
                setAnnouncements(response.data);
                setLoading(false);  // Set loading to false after data is fetched
            } catch (err) {
                setError(err.message);
                setLoading(false);  // Set loading to false in case of an error
            }
        };
        // Fetch announcements on mount
        fetchAnnouncements();

        // Listen for new announcements
        socket.on('newAnnouncement', (announcement) => {
            setAnnouncements((prev) => [announcement, ...prev]);
        });

        return () => {
            socket.off('newAnnouncement'); // Clean up the listener
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewAnnouncement((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${window.location.origin}/api/announcements`, newAnnouncement);
            setAnnouncements((prev) => [response.data, ...prev]);
            setNewAnnouncement({ title: '', content: '' });
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            try {
                await axios.delete(`${window.location.origin}/api/announcements/${id}`);
                setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const darkThemeStyles ={
    container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white ",
    header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
    card:"bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl shadow-gray-800 transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl",
    input: "max-w-md w-full  p-4 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
    button: "bg-green-600 text-white p-4 h-14  rounded-md w-38 hover:bg-green-700 transition-all duration-300",
      }
    
      const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        card:"bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl",
        input: "max-w-md w-full  p-4 rounded-lg bg-gray-200 text-gray-300  focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
    button: "bg-green-500 text-white p-4 h-14  rounded-md w-38 hover:bg-green-700 transition-all duration-300",
    
      }
    
      const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    return (
        <div className={`w-full h-full p-6 overflow-y-auto ${theme.container}`}>
        <h2 className={theme.header}>Announcement</h2>

        {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
            <p className="text-center text-red-500">{error}</p>
        ) : (
            <>
          

            <form onSubmit={handleSubmit} className={`mb-6  ${theme.card}  p-4 rounded-md shadow-md`}>
                <div className="flex flex-col md:flex-row md:items-center mb-4">
                    <input
                        type="text"
                        name="title"
                        value={newAnnouncement.title}
                        onChange={handleChange}
                        placeholder="Announcement Title"
                        required
                        className="border outline-none p-2 mr-2 text-gray-700 flex-grow rounded-md"
                    />
                    <textarea
                        name="content"
                        value={newAnnouncement.content}
                        onChange={handleChange}
                        placeholder="Announcement Content"
                        required
                        className="border outline-none p-2 mr-2 text-gray-700 flex-grow rounded-lg"
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white  rounded-md px-3 py-2">
                        Announce
                    </button>
                </div>
            </form>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="">
                <table className={`min-w-full  ${theme.card} overflow-hidden shadow-md rounded-lg`}>
                    <thead>
                        <tr className="bg-gray-200 text-black">
                            <th className="py-2 px-4 ">Title</th>
                            <th className="py-2 px-4 ">Content</th>
                            <th className="py-2 px-4 ">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {announcements.map((announcement) => (
                            <motion.tr key={announcement._id} 
                            whileHover={{
                                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight background color change on hover
                                transition: { duration: 0.3 } // Smooth transition with a duration of 0.3s
                              }}
                              
                              style={{ transition: 'background-color 0.1s ease' }}
                            
                            >
                                <td className="py-2 px-4">{announcement.title}</td>
                                <td className="py-2 px-4">{announcement.content}</td>
                                <td className="py-2 px-4">
                                    <button onClick={() => handleDelete(announcement._id)} className="text-red-500 text-center flex justify-center  w-full font-semibold  hover:underline">
                                    <MdDeleteForever size={24}/>

                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                        {announcements.length === 0 && (
                            <tr>
                                <td colSpan="3" className="py-2 px-4 text-center">No announcements available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            </>
            )}
        </div>
    );
}

export default Announcement;