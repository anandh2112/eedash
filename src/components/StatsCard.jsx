import React from "react";

const StatsCard = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-2 pt-3 pb-3 w-full">
      <div className="flex justify-around flex-wrap">

        {/* Clients */}
        <div className="flex flex-col w-[20%]  border-r-[0.5px] border-gray-300 items-center flex-1 min-w-[120px]">
          <h3 className="text-md text-gray-600 pb-1">Clients</h3>
          <p className="text-lg font-bold text-gray-900">1,234</p>
        </div>

        {/* Devices */}
        <div className="flex flex-col w-[20%] border-l-[0.5px] border-r-[0.5px] border-gray-300 items-center flex-1 min-w-[120px]">
          <h3 className="text-md text-gray-600 pb-1">Devices</h3>
          <p className="text-lg font-bold text-gray-900">1,450</p>
        </div>

        {/* Energy */}
        <div className="flex flex-col w-[20%] border-l-[0.5px] border-r-[0.5px] border-gray-300 items-center flex-1 min-w-[120px]">
          <h3 className="text-md text-gray-600 pb-1">Energy Tracker</h3>
          <p className="text-lg font-bold text-gray-900">11,438 kWh</p>
        </div>

        {/* CO2 */}
        <div className="flex flex-col w-[20%] border-l-[0.5px] border-gray-300 items-center flex-1 min-w-[120px]">
          <h3 className="text-md text-gray-600 pb-1">Emission Tracker</h3>
          <p className="text-lg font-bold text-gray-900">702 kg</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
