// Role_card.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Role_card({ item }) {
  const navigate = useNavigate();

  const handleSelectRole = () => {
    navigate(`/login?role=${item.role.toLowerCase()}`); // Ensure URL uses lowercase for roles
  };

  return (
    <div className='w-96 h-48 bg-white/20 relative backdrop-blur-md border border-white/30 shadow-lg rounded-lg p-6'>
      <div className='upper w-full h-1/2 flex flex-col items-center'>
        {item.icon}
        <div className='mt-2'>
          <h1 className='text-[17px] font-semibold'>{item.role}</h1>
        </div>
      </div>
      <div className='lower flex justify-center items-center w-full flex-col h-1/2'>
        <p className='py-3 text-gray-300 text-sm'>{item.description}</p>
        <button
          className='px-8 py-1 w-fit h-fit bg-[#241553] rounded-full text-white font-semibold text-sm'
          onClick={handleSelectRole}
        >
          Select
        </button>
      </div>
    </div>
  );
}

export default Role_card;