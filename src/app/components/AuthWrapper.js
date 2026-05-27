"use client";

import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AuthWrapper({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);



  return (
     
    <>
      <div className="fixed w-[15%] h-screen">
        <Sidebar />
      </div>
      <div className="ml-[15%] flex min-w-0 flex-col w-[85%]">
        <div className="h-12 top-0 left-[15%] w-[85%] flex fixed">
          <Navbar />
        </div>
        <div className="h-[94%] mt-12 min-w-0 overflow-hidden bg-gray-100">{children}</div>
      </div>
    </>
    )
}
