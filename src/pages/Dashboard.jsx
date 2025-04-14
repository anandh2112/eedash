import React from "react";
import StatsCard from "../components/StatsCard";
import Map from "../components/Map";
import Info from "../components/Info";
import DeviceAlert from "../components/DeviceAlert";
import ClientPipeline from "../components/ClientPipeline";

const Dashboard = () => {
  return (
    <div className="flex flex-col bg-gray-100 p-2 gap-2 h-[100%]">
        <StatsCard />

      <div className="grid grid-cols-2 gap-2 h-[100%]">
        <div className="flex flex-col gap-2">
          <Map />
          <Info/>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <DeviceAlert />
          <ClientPipeline />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
