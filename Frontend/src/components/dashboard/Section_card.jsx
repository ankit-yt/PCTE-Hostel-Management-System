import React from "react";

function Section_card({ admin_sec, isActive, onClick , isDarkTheme}) {
  return (
    <div
      className={`flex h-10 my-1 gap-2 ml-3 items-center  p-2 rounded-lg transition-all cursor-pointer ${
        isActive ? "bg-[#d6cece] text-black font-semibold " : "hover:bg-[#000000]"
      }`}
      onClick={onClick} // Handle section click
    >
      {admin_sec.icon}
      <h1 className="leading-none text-sm">{admin_sec.sec_name}</h1>
    </div>
  );
}

export default Section_card;
