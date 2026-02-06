import React from "react";

const FixedHeader = () => {
  return (
    <div className="fixed top-0 left-0 w-full flex items-center z-50">
      <h1 className="text-[128px] font-bold text-black ml-4">
        AstroPlays
      </h1>
      <div className="ml-auto h-8 w-full bg-gray-400"></div>
    </div>
  );
};

export default FixedHeader;
