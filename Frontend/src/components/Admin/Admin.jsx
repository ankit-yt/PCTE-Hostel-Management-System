// /src/components/Admin.js
import React, { useEffect, useState } from "react";
import Dashboard from "../dashboard/Dashboard";
import { TbLayoutDashboard } from "react-icons/tb";
import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineBedroomParent } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import User_sec from "./sections/User_sec";
import Hostel_rooms from "./sections/Hostel_rooms";
import Dashboard_sec from "./sections/Dashboard_sec";
import Announcement from "./sections/Announcement";
import axios from "axios";
import AdminComplaint from "./sections/AdminComplaint";


function Admin() {
  const [adminData, setAdminData] = useState(null); // State for user data
  const [isDarkTheme, setIsDarkTheme] = useState(true);
    // Function to toggle theme
    const toggleTheme = () => {
      setIsDarkTheme(!isDarkTheme);
    };
  
  const admin_section = [
    {
      sec_name: "Dashboard",
      icon: <TbLayoutDashboard size={"20px"} />,
      element: <Dashboard_sec isDarkTheme={isDarkTheme} />
    },
    {
      sec_name: "User Management",
      icon: <FaRegCircleUser size={"20px"} />,
      element: <User_sec isDarkTheme={isDarkTheme} />
    },
    {
      sec_name: "Complaints Management",
      icon: <TbLayoutDashboard size={"20px"} />,
      element: <AdminComplaint isDarkTheme={isDarkTheme} />
    },
    {
      sec_name: "Hostel Room Management",
      icon: <MdOutlineBedroomParent size={"20px"} />,
      element: <Hostel_rooms isDarkTheme={isDarkTheme} />
    },
    {
      sec_name: "Announcement",
      icon: <IoMdNotificationsOutline size={"20px"} />,
      element: <Announcement isDarkTheme={isDarkTheme} />
    },
  ];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${window.location.origin}/api/admin`); // Fetch data from the admin endpoint
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);



  return <Dashboard admin_section={admin_section} adminData={adminData} isDarkTheme={isDarkTheme} toggleTheme={toggleTheme} role={"Admin"}  />;
}

export default Admin;