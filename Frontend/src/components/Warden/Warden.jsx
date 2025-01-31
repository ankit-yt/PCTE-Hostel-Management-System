import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Attendence from './sections/Attendence';
import { MdOutlineCoPresent } from "react-icons/md";
import Dashboard from '../dashboard/Dashboard';
import Profile from './sections/Profile';
import WardenComplaint from './sections/WardenComplaint';
import Entry from './sections/Entry';
function Warden() {
    const navigate = useNavigate();

       const [isDarkTheme, setIsDarkTheme] = useState(true);
            // Function to toggle theme
            const toggleTheme = () => {
              setIsDarkTheme(!isDarkTheme);
            };

        
  
    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        const userRole = JSON.parse(atob(token.split('.')[1])).role;
        if (userRole !== 'admin' && userRole !== 'warden' && userRole !== 'student') {
          navigate('/');
        }
      }
    }, [navigate]);

    const wardenSections = [
        {
            sec_name: "Attendence",
            icon: <MdOutlineCoPresent />,
            element: <Attendence isDarkTheme={isDarkTheme}/>
        },
        
        {
          sec_name: "Complaint",
          icon: <MdOutlineCoPresent />,
          element: <WardenComplaint isDarkTheme={isDarkTheme}/>
      },
      

    ]
  
    return (
        <Dashboard admin_section={wardenSections} isDarkTheme={isDarkTheme} toggleTheme={toggleTheme}  role={"Warden"} />
    );
}

export default Warden
