"use client";
import React, { useState } from "react";
import { FaCalendarCheck, FaTicketAlt } from "react-icons/fa";
import BookedSavings from "./BookedSavings";
import SupportTickets from "./SupportTickets";

const Apdiscom = () => {
  const [mainTab, setMainTab] = useState("bookings");

  return (
    <div className="flex min-w-0 flex-col gap-4 w-full">
      {/* Main Toggle: Bookings vs Tickets */}
      <div className="flex flex-col items-center justify-center gap-4 w-full">
        <div className="flex rounded-lg overflow-hidden border-2 border-gray-300 text-sm font-semibold shadow-md">
          <button
            onClick={() => setMainTab("bookings")}
            className={`px-8 py-3 transition-all duration-200 flex items-center gap-2 ${
              mainTab === "bookings"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaCalendarCheck size={18} /> Bookings
          </button>
          <button
            onClick={() => setMainTab("tickets")}
            className={`px-8 py-3 border-l-2 border-gray-300 transition-all duration-200 flex items-center gap-2 ${
              mainTab === "tickets"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <FaTicketAlt size={18} /> Tickets
          </button>
        </div>
      </div>

      {/* Render Booked Savings Component */}
      {mainTab === "bookings" && <BookedSavings />}

      {/* Render Support Tickets Component */}
      {mainTab === "tickets" && <SupportTickets />}
    </div>
  );
};

export default Apdiscom;
