import React from 'react'
import Role_card from './Role_card'
import { RiAdminLine } from 'react-icons/ri';
import { IoPersonOutline } from 'react-icons/io5';
import { PiStudentLight } from 'react-icons/pi';


function Role_selection() {
  const roles = [
    {
      icon: <RiAdminLine size={"40px"} color='#240046' />,
      role: "Admin",
      description: "Oversee all operations",
    },
    {
      icon: <IoPersonOutline size={"40px"} color='#240046' />,
      role: "Warden",
      description: "Supervise hostel activities",
    },
    {
      icon: <PiStudentLight size={"40px"} color='#240046' />,
      role: "Student",
      description: "Access personal details",
    },
  ];

  return (
    <div className='w-full h-screen flex-col relative flex bg-[#EBEFFF]'>
      <div className=' background_image pointer-events-none w-full h-full absolute  top-0 '>
        <img className='w-full h-full object-cover ' src="https://scontent.fixc2-1.fna.fbcdn.net/v/t1.6435-9/39535853_1929872993736078_4675401329982570496_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=L6j2trELwtoQ7kNvgE5MS9o&_nc_zt=23&_nc_ht=scontent.fixc2-1.fna&_nc_gid=AAUBOC55NaVmP-Sy57rrABT&oh=00_AYAlpP9sfyToLg7NsD1-sDPT9nPErhV2M8Dxx6Mov9Sp6w&oe=67B1EE11" alt="" />
      </div>
      <div className='z-10 w-full gap-5 flex items-center justify-center h-1/4'>
      <div className='w-46 h-16'>
        <img className='w-full object-cover h-full' src="https://pcte.edu.in/wp-content/uploads/2024/02/PCTE-removebg-preview.png" alt="" />
      </div>
      <div className='w-42 h-20'>
        <img className='w-full h-full object-cover' src="/role_selection/hostel.jpg" alt="" />
      </div>
      </div>
      <div className='w-full h-3/4 g-red-500  flex flex-col md:flex-row justify-center gap-5 md:gap-10 items-center p-4'>
        {roles.map((item, index) => (
          <Role_card item={item} />

        ))}

      </div>
    </div>
  )
}

export default Role_selection
