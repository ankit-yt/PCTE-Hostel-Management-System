import React, { useEffect, useState } from "react";
import Section_card from "./Section_card";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { Menu, X } from "lucide-react"; // Icons for hamburger menu
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonSharp } from "react-icons/io5";
import { AiOutlineLogout } from "react-icons/ai";



function Dashboard({ admin_section, adminData, isDarkTheme, toggleTheme, role }) {
    const [activeSection, setActiveSection] = useState(admin_section[0]); // Default to the first section
    const navigate = useNavigate(); // Initialize useNavigate hook for navigation
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state

    const handleLogout = () => {
        localStorage.removeItem("token"); // Example of removing a token from local storage
        navigate("/"); // Redirect to login page
    };

    useEffect(() => {
        const currentActiveSection = admin_section.find(
            (section) => section.sec_name === activeSection.sec_name
        );
        if (currentActiveSection) {
            setActiveSection(currentActiveSection); // Set the active section
        }
    }, [isDarkTheme]);

    return (
        <div className="w-full h-screen relative bg-[#EBEFFF] flex">
            {/* Background */}
            <div className="absolute w-full h-full">
                <img
                    className="w-full h-full object-cover object-[0%_42%] blur-[10%]"
                    src="/dashboard/hostel3.png"
                    alt="Background"
                />
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full z-20 transform transition-transform  duration-300 bg-[#000000b6] shadow-lg ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:relative lg:w-1/6`}
            >
                <div className="h-[4rem] flex justify-between items-center px-4 text-white bg-black lg:bg-transparent">
                    <div className="flex items-center ">
                        <div className="w-[3.2rem] bg-white px-2 py-2 overflow-hidden rounded-md h-[3.5rem]">
                            <img
                                className="w-full h-full object-fit"
                                src="/dashboard/logo.png"
                                alt="Logo"
                            />
                        </div>
                        <h1 className="text-xl font-bold ml-4">{role}</h1>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        className="lg:hidden text-white"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <div style={{ height: "calc(100% - 4rem)" }} className="flex flex-col  text-white">
                    <div className="overflow-y-auto flex-grow px-1 py-2 space-y-2">
                        {admin_section.map((item, index) => (
                            <Section_card
                                key={index}
                                admin_sec={item}
                                isActive={activeSection.sec_name === item.sec_name}
                                onClick={() => {
                                    setActiveSection(item);
                                    setSidebarOpen(false); // Close sidebar on selection
                                }}
                            />
                        ))}
                    </div>

                    <div className="px-4 mb-4 flex w-full h-10 flex-col justify-end items-end space-y-2">
    {/* Logout Button with Red Glowing Effect */}
    <button
        className="rounded-full p-2 hover:shadow-[0_0_10px_4px_rgba(255,0,0,0.8)] transition-all duration-300"
        onClick={handleLogout}
    >
        <AiOutlineLogout size={20} />
    </button>

    {/* Dark Mode Button with White Glowing Effect */}
    <button
        onClick={toggleTheme}
        className={`rounded-full p-2 transition-all duration-300 ${isDarkTheme ? 'text-yellow-500' : 'text-white'} hover:shadow-[0_0_10px_4px_rgba(255,255,255,0.8)]`}
    >
        {isDarkTheme ? <MdOutlineWbSunny size={20} /> : <IoMoonSharp size={20} />}
    </button>
</div>

                </div>
            </div>

            {/* Hamburger Menu */}
            {!isSidebarOpen && (
                <button
                    className="fixed top-4 left-4 z-30 text-white lg:hidden"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                >
                    <Menu size={20} /> {/* Smaller hamburger icon */}
                </button>
            )}

            {/* Main Content */}
            <div
                className={`flex-1 relative bg-black h-full ${isDarkTheme ? "bg-gray-900 text-white" : "bg-gradient-to-r from-blue-200 to-purple-200 text-black"}`}
            >
                <div className="w-full bg-white/20 p-[.1px] h-full overflow-hidden" style={{ height: "calc(100%)" }}>
                    {activeSection.element}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
