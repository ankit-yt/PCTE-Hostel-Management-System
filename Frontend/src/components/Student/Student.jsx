// Student.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdPayment } from "react-icons/md";
import { MdOutlineCoPresent } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { CgProfile } from "react-icons/cg";

import Dashboard from '../dashboard/Dashboard';
import Announcements from './sections/Announcements';
import Attendance from './sections/Attendance';
import StudentProfile from './sections/StudentProfile';
import Payment from './sections/Payment';

import StudentComplaint from './sections/StudentComplaint';
import Student_entry from './sections/Student_entry';

function Student() {
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState(null);
    const [error, setError] = useState(null);
    const [studentId, setStudentId] = useState(""); // Store student ID
    const [studentName, setStudentName] = useState(""); // Store student name
    const [studentroom, setStudentroom] = useState(""); // Store student name

    const [isDarkTheme, setIsDarkTheme] = useState(true);
        // Function to toggle theme
        const toggleTheme = () => {
          setIsDarkTheme(!isDarkTheme);
        };


        useEffect(() => {
            const fetchStudentData = async () => {
                try {
                    // Retrieve the studentId from local storage
                    const storedStudentId = localStorage.getItem('studentId');
                    if (storedStudentId) {
                        setStudentId(storedStudentId); // Set the studentId state
    
                        // Fetch student data using the studentId
                        const response = await axios.get(`${window.location.origin}/api/users/${storedStudentId}`);
                        setStudentData(response.data);
                        setStudentName(response.data.name); // Assuming the name is in the response data
                        setStudentroom(response.data.roomNumber); // Assuming the name is in the response data
                        
                    } else {
                        navigate('/login'); // Redirect to login if no studentId found
                    }
                } catch (err) {
                    setError(err.response ? err.response.data.message : err.message);
                }
            };
    
            fetchStudentData();
        }, [navigate]);
    

    // Define sections for the dashboard
    const studentSections = [
        {
            sec_name: "Profile",
            icon: <CgProfile />,
            element: <StudentProfile studentId={studentId}  isDarkTheme={isDarkTheme}/>
        },
        {
            sec_name: "Announcements",
            icon: <TfiAnnouncement />,
            element: <Announcements isDarkTheme={isDarkTheme}/>
        },
        {
            sec_name: "Attendance",
            icon: <MdOutlineCoPresent />,
            element: <Attendance studentId={studentId} isDarkTheme={isDarkTheme} />
        },
        {
            sec_name: "Complaint",
            icon: <MdPayment />,
            element: <StudentComplaint studentName={studentName} studentRoom={studentroom} isDarkTheme={isDarkTheme}  />
        },

    ];

    if (error) {
        return <div>Error: {error}</div>; // Display error if any
    }

    return (
        <Dashboard admin_section={studentSections} adminData={studentData} isDarkTheme={isDarkTheme} toggleTheme={toggleTheme}  role={"Student"} />
    );
}

export default Student;