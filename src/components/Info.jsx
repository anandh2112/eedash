import React from "react";
import ticketIcon from "../images/ticket.png"; // Importing the ticket icon
import usersIcon from "../images/users.png"; // Importing the users icon

const Info = () => {
  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Active Users Card */}
      <div className="bg-white shadow-md rounded-lg p-4 w-full flex justify-around items-center">
        {/* Users Icon */}
        <div className="mr-4">
          <img src={usersIcon} alt="Users Icon" className="w-12 h-12" />
        </div>
        {/* Active Users Info */}
        <div className="flex gap-4 items-center">
          <h2 className="text-lg font-semibold text-gray-800">Active Users</h2>
          <p className="text-2xl font-bold text-gray-900">15</p>
        </div>
      </div>

      {/* Active Tickets Card */}
      <div className="bg-white shadow-md rounded-lg p-4 w-full flex justify-around items-center">
        {/* Ticket Icon */}
        <div className="mr-4">
          <img src={ticketIcon} alt="Ticket Icon" className="w-12 h-12" />
        </div>
        {/* Active Tickets Info */}
        <div className="flex gap-4 items-center">
          <h2 className="text-lg font-semibold text-gray-800">Active Tickets</h2>
          <p className="text-2xl font-bold text-gray-900">10</p>
        </div>
      </div>
    </div>
  );
};

export default Info;