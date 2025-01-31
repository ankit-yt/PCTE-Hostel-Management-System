import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function User_sec({ isDarkTheme }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
    const [editFormData, setEditFormData] = useState({}); // Store form data for editing

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${window.location.origin}/api/users`);
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`${window.location.origin}/api/users/${userId}`);
                setUsers(prev => prev.filter(user => user._id !== userId));
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleEditClick = (user) => {
        setEditingUserId(user._id); // Set the user ID being edited
        setEditFormData({ // Populate the form with the user's current data
            username: user.username,
            name: user.name,
            email: user.email,
            phone: user.phone,
            rollNumber: user.rollNumber || '',
            fatherName: user.fatherName || '',
            class: user.class || '',
            gender: user.gender || '',
            hostel: user.hostel || '',
            roomNumber: user.roomNumber || '',
            hostelType: user.hostelType || '',
        });
    };

    const handleAction = (event, user) => {
        const action = event.target.value;
    
        if (action === "edit") {
            handleEditClick(user);
        } else if (action === "delete") {
            handleDelete(user._id);
        }
    };
    

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${window.location.origin}/api/users/${editingUserId}`, editFormData);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === editingUserId ? { ...user, ...response.data } : user
                )
            );
            setEditingUserId(null); // Close the edit box
        } catch (err) {
            setError('Error updating user');
            console.error(err);
        }
    };

    const handleRegisterNewUser = () => {
        navigate('/register');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
            user.username.toLowerCase().includes(lowerCaseQuery) ||
            (user.rollNumber && user.rollNumber.toLowerCase().includes(lowerCaseQuery))
        );
    });

    const darkThemeStyles = {
        container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
        header: "text-3xl font-extrabold text-cyan-400 mb-6 lg:mb-8 text-center",
        card: "bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl",
        input: "max-w-md w-full p-4 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        button: "bg-green-600 text-white h-14 p-4 rounded-md hover:bg-green-700 transition-all duration-300",

      
        editBox: "bg-gradient-to-br from-gray-900 to-gray-800  rounded-lg shadow-lg p-6 backdrop-blur-lg bg-opacity-10",
        editInput: "p-3  rounded-md bg-gray-900 text-white shadow-sm shadow-cyan-300 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all duration-300",
        editLabel: "text-cyan-300 text-sm font-semibold mb-1",
        editButton: "px-4 py-2 text-white bg-cyan-600 rounded-md shadow-md hover:bg-cyan-700 transition-all duration-300",
        cancelButton: "px-4 py-2 text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 transition-all duration-300",
        actionDropdown: "w-36 px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-md transition-all",
        actionOption: "bg-gray-900 text-white hover:bg-cyan-600 cursor-pointer",
    };

    const lightThemeStyles = {
        container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
        header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
        card: "bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl",
        input: "max-w-md w-full p-4 rounded-lg bg-gray-200 text-gray-700 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
        button: "bg-green-500 text-white p-4 h-14 rounded-md hover:bg-green-700 transition-all duration-300",


        
        editBox: "bg-gradient-to-br from-gray-100 to-white border border-blue-500 rounded-lg shadow-lg p-6 backdrop-blur-lg bg-opacity-40",
        editInput: "p-3 border border-blue-400 rounded-md bg-white text-gray-900 shadow-md focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300",
        editLabel: "text-blue-600 text-sm font-semibold mb-1",
        editButton: "px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 transition-all duration-300",
        cancelButton: "px-4 py-2 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600 transition-all duration-300",
        actionDropdown: "w-36 px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-md transition-all",
        actionOption: "bg-white text-gray-800 hover:bg-blue-500 hover:text-white cursor-pointer",
    };


    const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

    return (
        <div className={`lg:w-full w-screen h-full p-6 ${theme.container} overflow-y-auto`}>
            <h2 className={theme.header}>User Management</h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <>
                    <div className="flex flex-col md:flex-row gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Search by username or roll number"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className={`${theme.input}`}
                        />
                        <button onClick={handleRegisterNewUser} className={`${theme.button} md:mt-0`}>
                            Register New User
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className={`min-w-full ${theme.card} text-black shadow-md overflow-hidden rounded-lg`}>
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="py-2 px-4 border-b">Pic</th>
                                    <th className="py-2 px-4 border-b">Username</th>
                                    <th className="py-2 px-4 border-b">Roll Number</th>
                                    <th className="py-2 px-4 border-b">Hostel</th>
                                    <th className="py-2 px-4 border-b">Room Number</th>
                                    <th className="py-2 px-4 border-b">Role</th>
                                    <th className="py-2 px-4 border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <React.Fragment key={user._id}>
                                        <tr className={`${isDarkTheme ? "text-gray-100" : "text-black"} text-sm`}>
                                            <td className="py-2 px-4 text-center flex justify-center">
                                                <div className='w-12 h-12 rounded-full overflow-hidden'>
                                                    <img className='w-[105%] h-[105%] object-cover object-[0_5%]' src={`${window.location.origin}/${user.image}`} alt={user.username} />
                                                </div>
                                            </td>
                                            <td className="py-2 px-4 text-center">{user.username}</td>
                                            <td className="py-2 px-4 text-center">{user.rollNumber || 'N/A'}</td>
                                            <td className="py-2 px-4 text-center">{user.hostel || 'N/A'}</td>
                                            <td className="py-2 px-4 text-center">{user.roomNumber || 'N/A'}</td>
                                            <td className="py-2 px-4 text-center">{user.role}</td>
                                            <td className="py-2 px-4 text-center">
                                                <select
                                                    onChange={(e) => handleAction(e, user)}
                                                    className={theme.actionDropdown}
                                                >
                                                    <option value="" disabled selected>Select Action</option>
                                                    <option value="edit" className={theme.actionOption}>Edit</option>
                                                    <option value="delete" className={theme.actionOption}>Delete</option>
                                                </select>
                                                {/* <button onClick={() => handleEditClick(user)} className="text-blue-500 hover:underline">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(user._id)} className="text-red-500 ml-2 hover:underline">
                                                    Delete
                                                </button> */}
                                            </td>
                                        </tr>
                                        {editingUserId === user._id && (
    <tr>
        <td colSpan="7" className="p-4">
            <form onSubmit={handleEditSubmit} className={theme.editBox}>
                <h3 className="text-center text-xl font-bold text-cyan-400 mb-4">Edit User Details</h3>

                <div className="grid grid-cols-2 gap-6">
                    {[
                        { label: "Username", name: "username", type: "text" },
                        { label: "Name", name: "name", type: "text" },
                        { label: "Email", name: "email", type: "email" },
                        { label: "Phone", name: "phone", type: "text" },
                        { label: "Roll Number", name: "rollNumber", type: "text" },
                        { label: "Father's Name", name: "fatherName", type: "text" },
                        { label: "Class", name: "class", type: "text" },
                        { label: "Hostel", name: "hostel", type: "text" },
                        { label: "Room Number", name: "roomNumber", type: "text" },
                    ].map(({ label, name, type }) => (
                        user[name] && ( // 👈 Only render if the user has this field
                            <div key={name} className="flex flex-col">
                                <label className={theme.editLabel}>{label}</label>
                                <input
                                    type={type}
                                    name={name}
                                    value={editFormData[name] || ""}
                                    onChange={handleEditFormChange}
                                    className={theme.editInput}
                                />
                            </div>
                        )
                    ))}

                    {/* Gender Select (Only if gender exists) */}
                    {user.gender && (
                        <div className="flex flex-col">
                            <label className={theme.editLabel}>Gender</label>
                            <select
                                name="gender"
                                value={editFormData.gender || ""}
                                onChange={handleEditFormChange}
                                className={theme.editInput}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                    )}

                    {/* Hostel Type Select (Only if hostelType exists) */}
                    {user.hostelType && (
                        <div className="flex flex-col">
                            <label className={theme.editLabel}>Hostel Type</label>
                            <select
                                name="hostelType"
                                value={editFormData.hostelType || ""}
                                onChange={handleEditFormChange}
                                className={theme.editInput}
                            >
                                <option value="boys">Boys Hostel</option>
                                <option value="girls">Girls Hostel</option>
                            </select>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setEditingUserId(null)}
                        className={theme.cancelButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={theme.editButton}
                    >
                        Save
                    </button>
                </div>
            </form>
        </td>
    </tr>
)}



                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default User_sec;