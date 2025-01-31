import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";

function Hostel_rooms({ isDarkTheme }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newRoom, setNewRoom] = useState({ roomNumber: '', capacity: '', hostel: '' });
  const [editRoom, setEditRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newStudent, setNewStudent] = useState({ rollNumber: '', name: '' });
  const [transferStudentId, setTransferStudentId] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [targetRoomId, setTargetRoomId] = useState("");

  useEffect(() => {
    const fetchRoomsAndStudents = async () => {
      try {
        // Fetch all rooms
        const roomsResponse = await axios.get(`${window.location.origin}/api/rooms`);
        setRooms(roomsResponse.data);

        // Fetch all students
        const studentsResponse = await axios.get(`${window.location.origin}/api/users`);
        const allStudents = studentsResponse.data.filter(user => user.role === 'student');

        // Match students to their rooms
        const updatedRooms = roomsResponse.data.map(room => {
          const studentsInRoom = allStudents.filter(student => student.roomNumber === room.roomNumber);
          return {
            ...room,
            students: studentsInRoom.map(student => ({
              rollNumber: student.rollNumber,
              name: student.name,
            })),
            occupied: studentsInRoom.length,
          };
        });

        setRooms(updatedRooms);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRoomsAndStudents();
  }, []);

  const handleNewRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoom({
      ...newRoom,
      [name]: value,
    });
  };

  const addNewRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${window.location.origin}/api/rooms`, newRoom);
      setRooms([...rooms, response.data]);
      setNewRoom({ roomNumber: '', capacity: '', hostel: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const editExistingRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${window.location.origin}/api/rooms/${editRoom._id}`, {
        roomNumber: editRoom.roomNumber,
        capacity: editRoom.capacity,
        hostel: editRoom.hostel,
      });
      setRooms(rooms.map(room => (room._id === editRoom._id ? response.data : room)));
      setEditRoom(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      const response = await axios.get(`${window.location.origin}/api/rooms/${roomId}/students`);
      if (response.data.length > 0) {
        setError("Cannot delete room. It is occupied by students.");
        return;
      }

      await axios.delete(`${window.location.origin}/api/rooms/${roomId}`);
      setRooms(rooms.filter(room => room._id !== roomId));
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStudents = async (roomId) => {
    if (selectedRoom === roomId) {
      setSelectedRoom(null);
      setStudents([]);
      return;
    }

    try {
      const response = await axios.get(`${window.location.origin}/api/rooms/${roomId}/students`);
      setStudents(response.data);
      setSelectedRoom(roomId);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteStudent = async (roomId, studentId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this student?");
    if (!isConfirmed) return; // Stop if the user cancels the action
  
    try {
      await axios.delete(`${window.location.origin}/api/rooms/${roomId}/students/${studentId}`);
      setStudents(students.filter(student => student._id !== studentId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewStudentChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({
      ...newStudent,
      [name]: value,
    });
  };

  const addNewStudent = async (e) => {
    e.preventDefault();
    if (selectedRoom) {
      try {
        const response = await axios.post(`${window.location.origin}/api/rooms/${selectedRoom}/students`, newStudent);
        setStudents([...students, response.data.students[response.data.students.length - 1]]);
        setNewStudent({ rollNumber: '', name: '' });
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const fetchAvailableRooms = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/rooms`);
      const available = response.data.filter(room => room.occupied < room.capacity);
      setAvailableRooms(available);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTransferClick = async (studentId) => {
    setTransferStudentId(studentId);
    await fetchAvailableRooms();
  };

  const handleTransferStudent = async () => {
    if (!transferStudentId || !targetRoomId) return;

    try {
      // Make a PUT request to transfer the student
      await axios.put(`${window.location.origin}/api/rooms/${selectedRoom}/transfer/${transferStudentId}`, {
        newRoomId: targetRoomId,
      });

      // Update the UI
      const updatedStudents = students.filter(student => student._id !== transferStudentId);
      setStudents(updatedStudents);

      // Reset state
      setTransferStudentId(null);
      setTargetRoomId("");
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  const darkThemeStyles = {
    container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white",
    header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",
    card: "bg-gradient-to-r from-gray-800 to-gray-900   rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl",
    input: "max-w-md w-1/4 p-3 rounded-lg bg-gray-700 text-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
    input2: "max-w-md w-full p-3 rounded-lg bg-gray-700 text-gray-900 border border-gray-600 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
    button: "bg-green-600 text-white p-4 h-[3rem] flex justify-center items-center rounded-md w-38 hover:bg-green-700 transition-all duration-300",
  };

  const lightThemeStyles = {
    container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
    header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
    card: "bg-gradient-to-r  from-white to-gray-100 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl",
    input: "max-w-md w-1/4 p-3 rounded-lg bg-gray-200 text-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
    input2: "max-w-md w-full p-3 rounded-lg bg-gray-200 text-gray-900 focus:ring-2 focus:ring-cyan-400 focus:outline-none mb-6",
    button: "bg-green-500 text-white p-4 h-[3rem] flex justify-center items-center rounded-md w-38 hover:bg-green-700 transition-all duration-300",
  };

  const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

  return (
    <div className={`p-6 lg:h-full h-screen lg:w-full w-screen  ${theme.container}`}>
      <h2 className={theme.header}>Hostel Management</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* Add New Room Form */}
          <form onSubmit={addNewRoom} className={`mb-4 ${theme.card} p-4 rounded shadow-md`}>
            <h2 className={`text-base ${isDarkTheme ? "text-gray-100" : "text-black"} font-semibold mb-2`}>Add New Room</h2>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                value={newRoom.roomNumber}
                onChange={handleNewRoomChange}
                required
                className={`${theme.input}`}
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={newRoom.capacity}
                onChange={handleNewRoomChange}
                required
                className={`${theme.input}`}
              />
              <input
                type="text"
                name="hostel"
                placeholder="Hostel Name"
                value={newRoom.hostel}
                onChange={handleNewRoomChange}
                required
                className={`${theme.input}`}
              />
              <button type="submit" className={`${theme.button}`}>Add Room</button>
            </div>
          </form>

          {/* Edit Room Form */}
          {editRoom && (
            <form onSubmit={editExistingRoom} className={`mb-4 ${theme.card} p-4 rounded shadow-md`}>
              <h2 className={`text-base ${isDarkTheme ? "text-gray-100" : "text-black"} font-semibold mb-2`}>Edit Room</h2>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  name="roomNumber"
                  placeholder="Room Number"
                  value={editRoom.roomNumber}
                  onChange={(e) => setEditRoom({ ...editRoom, roomNumber: e.target.value })}
                  required
                  className={`${theme.input}`}
                />
                <input
                  type="number"
                  name="capacity"
                  placeholder="Capacity"
                  value={editRoom.capacity}
                  onChange={(e) => setEditRoom({ ...editRoom, capacity: e.target.value })}
                  required
                  className={`${theme.input}`}
                />
                <input
                  type="text"
                  name="hostel"
                  placeholder="Hostel Name"
                  value={editRoom.hostel}
                  onChange={(e) => setEditRoom({ ...editRoom, hostel: e.target.value })}
                  required
                  className={`${theme.input}`}
                />
                <button type="submit" className={`${theme.button}`}>Save Changes</button>
              </div>
            </form>
          )}

          {/* Rooms Table */}
          <div className="lg:overflow-hidden overflow-auto rounded-xl">
            <table className={`min-w-full overflow-auto ${theme.card} shadow-md rounded-lg`}>
              <thead>
                <tr className="bg-gray-200 text-black">
                  <th className="py-2 px-4 border-b">Room Number</th>
                  <th className="py-2 px-4 border-b">Hostel</th>
                  <th className="py-2 px-4 border-b">Capacity</th>
                  <th className="py-2 px-4 border-b">Occupied</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <React.Fragment key={room._id}>
                    <motion.tr
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', transition: { duration: 0.3 } }}
                      className="cursor-pointer"
                    >
                      <td className="py-2 px-4  text-center">{room.roomNumber}</td>
                      <td className="py-2 px-4  text-center">{room.hostel}</td>
                      <td className="py-2 px-4  text-center">{room.capacity}</td>
                      <td className="py-2 px-4  text-center">{room.occupied}</td>
                      <td className="py-2 gap-4  justify-center flex space-x-2">
                        <select
                          onChange={(e) => {
                            const action = e.target.value;
                            if (action === "view") {
                              fetchStudents(room._id);
                            } else if (action === "edit") {
                              setEditRoom(room);
                            } else if (action === "delete") {
                              deleteRoom(room._id);
                            }
                            e.target.value = "";
                          }}
                          className={`rounded-md p-2 ${isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-900'} focus:ring-2 focus:ring-cyan-400 focus:outline-none`}
                        >
                          <option value="" disabled selected>Select Action</option>
                          <option value="view">View Students</option>
                          <option value="edit">Edit</option>
                          <option value="delete">Delete</option>
                        </select>
                      </td>
                    </motion.tr>
                    {selectedRoom === room._id && (
                      <tr>
                        <td colSpan="5" className="px-4 py-2">
                          <div className={`${theme.card} p-6 rounded-xl shadow-lg`}>
                            <h2 className="text-2xl font-bold mb-4 text-center tracking-wider">
                              Students in Room: <span className="text-blue-500">{room.roomNumber}</span>
                            </h2>
                            <div className={`${theme.card} p-5`}>
                              <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">
                                Students List
                              </h3>
                              {students.length > 0 ? (
                                <ul className="">
                                  {students.map((student) => (
                                    <li key={student._id} className="flex justify-between py-2 items-center">
                                      <div className="flex flex-col">
                                        <span className="font-semibold">{student.name}</span>
                                        <span className="text-sm text-gray-400">Roll No: {student.rollNumber}</span>
                                      </div>
                                      <div className="flex space-x-2">
                                       
                                        <button
                                          onClick={() => handleTransferClick(student._id)}
                                          className="text-blue-500 font-medium hover:underline hover:text-blue-400 transition"
                                        >
                                          Transfer
                                        </button>
                                        <button
        onClick={() => deleteStudent(selectedRoom, student._id)}
        disabled={student.isInDatabase} // Disable if the student is in the database
        className={`text-red-500 font-medium hover:underline hover:text-red-400 transition ${
          student.isInDatabase ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        Delete
      </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400 text-center">No students in this room.</p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Transfer Student Modal */}
          {transferStudentId && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className={`${theme.card} p-6 rounded-lg`}>
                <h3 className="text-lg font-semibold mb-4">Transfer Student</h3>
                <select
                  value={targetRoomId}
                  onChange={(e) => setTargetRoomId(e.target.value)}
                  className={`${theme.input} w-full`}
                >
                  <option value="" disabled>Select a Room</option>
                  {availableRooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.roomNumber} (Capacity: {room.capacity}, Occupied: {room.occupied})
                    </option>
                  ))}
                </select>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => setTransferStudentId(null)}
                    className={`${theme.button} bg-gray-500 hover:bg-gray-600`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransferStudent}
                    className={`${theme.button}`}
                  >
                    Transfer
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Hostel_rooms;