import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { PiStudent } from "react-icons/pi";
import { GiLetterBomb } from "react-icons/gi";
import { TfiAnnouncement } from "react-icons/tfi";



const socket = io(`${window.location.origin}`); // Your backend URL

function AdminDashboard({isDarkTheme}) {
  const [students, setStudents] = useState([]);
  const [availableRooms, setAvailableRooms] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  const [showStudentList, setShowStudentList] = useState(false); // State for student list visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch students by role
        const studentsRes = await axios.get(`${window.location.origin}/api/users?role=student`);
        // Fetch other data
        const roomsRes = await axios.get(`${window.location.origin}/api/rooms`);
        const complaintsRes = await axios.get(`${window.location.origin}/api/complaints`);
        const announcementsRes = await axios.get(`${window.location.origin}/api/announcements`);
        
        setStudents(studentsRes.data);
        setAvailableRooms(roomsRes.data.available || 0);
        setPendingComplaints(complaintsRes.data.filter(complaint => !complaint.resolved));
        setAnnouncements(announcementsRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();

    socket.on("dataUpdated", fetchData); // Listen for real-time updates

    return () => {
      socket.off("dataUpdated", fetchData); // Cleanup listener
    };
  }, []);

  const toggleStudentList = () => {
    setShowStudentList(!showStudentList); // Toggle student list visibility
  };

  console.log(isDarkTheme )

  const darkThemeStyles ={
container: "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white ",
header: "text-3xl font-extrabold text-cyan-400 mb-6 text-center",

card:"bg-gradient-to-r from-gray-800 to-gray-900 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl"
  }

  const lightThemeStyles = {
    container: "bg-gradient-to-br from-white via-gray-200 to-gray-100 text-gray-900",
    header: "text-3xl font-extrabold text-blue-600 mb-6 text-center",
    card:"bg-gradient-to-r from-white to-gray-100 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-[102%] hover:shadow-3xl"

  }

  const theme = isDarkTheme ? darkThemeStyles : lightThemeStyles;

  return (
    <div className={`p-6 relative ${theme.container} h-full overflow-auto`} >
      <h2 className={theme.header}>Announcement</h2>

{loading ? (
    <p className="text-center text-gray-500">Loading...</p>
) : error ? (
    <p className="text-center text-red-500">{error}</p>
) : (
    <>
  

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metrics Cards */}
        <div className={`${theme.card} shadow-md rounded-lg p-4 flex items-center flex-col cursor-pointer`} onClick={toggleStudentList}>
          <div className="w-12 h-12 border-2  rounded-full flex items-center justify-center">
          <PiStudent size={"25px"}/>
          </div>
          <div className="mt-2">
            <h2 className="text-lg text-center  font-bold">{students.length}</h2>
            <p className="text-sm text-gray-500">Total Students</p>
          </div>
        </div>

       

        {/* Pending Complaints */}
        <div className={`${theme.card} shadow-md rounded-lg p-4 flex items-center flex-col cursor-pointer`} >
          <div className="w-12 h-12 border-2 rounded-full flex items-center justify-center">
          <GiLetterBomb size={"25px"} />
          </div>
          <div className="mt-2">
            <h2 className="text-lg text-center font-bold">{pendingComplaints.length}</h2>
            <p className="text-sm text-gray-500">Pending Complaints</p>
          </div>
        </div>

        {/* Announcements */}
        <div className={`${theme.card} shadow-md rounded-lg p-4 flex items-center flex-col cursor-pointer`} >
          <div className="w-12 h-12 border-2 rounded-full flex items-center justify-center">
          <TfiAnnouncement size={"25px"} />

          </div>
          <div className="mt-2">
            <h2 className="text-lg font-bold text-center ">{announcements.length}</h2>
            <p className="text-sm text-gray-500">New Announcements</p>
          </div>
        </div>
      </div>

      {showStudentList && (
  <div className={`mt-8  ${theme.card}  shadow-md rounded-lg p-4`}>
    <h2 className="text-lg font-bold mb-4">Student List</h2>
    {students.length === 0 ? (
      <p className="text-center text-white">No students found</p>
    ) : (
      <table className="table-auto w-full border-collapse border overflow-hidden rounded-lg border-gray-700 text-sm text-white">
        <thead className="bg-gray-200 text-black">
          <tr>
            <th className=" px-4 py-2">Username</th>
            <th className=" px-4 py-2">Roll No</th>
            <th className=" px-4 py-2">Hostel</th>
            <th className=" px-4 py-2">Room</th>
            <th className=" px-4 py-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} >
              <td className={`${isDarkTheme ? "text-white " : "text-black"} text-center px-4 py-2 `}>{student.username}</td>
              <td className={`${isDarkTheme ? "text-white " : "text-black"} text-center px-4 py-2 `}>{student.rollNumber}</td>
              <td className={`${isDarkTheme ? "text-white " : "text-black"} text-center px-4 py-2 `}>{student.hostel}</td>
              <td className={`${isDarkTheme ? "text-white " : "text-black"} text-center px-4 py-2 `}>{student.roomNumber}</td>
              <td className={`${isDarkTheme ? "text-white " : "text-black"} text-center px-4 py-2 `}>{student.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


      {/* Pending Complaints Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Pending Complaints</h2>
        <div className={`${theme.card}  shadow-md rounded-lg p-4`}>
          {pendingComplaints.length === 0 ? (
            <p className="text-center ">No pending complaints</p>
          ) : (
            <ul className="">
              {pendingComplaints.map((complaint) => (
                <li key={complaint._id} className="py-3 flex items-center justify-between">
                  <p className={`text-sm ${isDarkTheme ? "text-white " : "text-black"}  `}>
                  <strong>Complaint: </strong> {complaint.complaintText}
                  </p>
                  <span className={`text-xs ${isDarkTheme ? "text-white " : "text-black"}  `}>{new Date(complaint.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent Announcements Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Recent Announcements</h2>
        <div className={`${theme.card} shadow-md rounded-lg p-4`}>
          {announcements.length === 0 ? (
            <p className="text-center ">No new announcements</p>
          ) : (
            <ul className="">
              {announcements.map((announcement) => (
                <li key={announcement._id} className="py-3 flex items-center justify-between">
                  <p className="text-sm ">
                    Announcement: <strong>{announcement.title}</strong>
                  </p>
                 
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </>
            )}
    </div>
  );
}

export default AdminDashboard;