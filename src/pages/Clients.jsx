import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";

const clientData = {
  Noida: {
    Metalware: {
      address: "Sector 62, Noida, India",
      contact: "+91 9876543210",
      onboarding: "10 Jan 2023",
      version: "v3.2",
      devices: { raspberryPi: 2, modBus: 1 },
      polling: { expected: 1440, received: 1306 },
    },
  },
  Bangalore: {
    RMZ: {
      address: "RMZ EcoWorld, Bangalore, India",
      contact: "+91 9812345678",
      onboarding: "15 Mar 2022",
      version: "v4.1",
      devices: { raspberryPi: 3, modBus: 2 },
      polling: { expected: 1500, received: 1400 },
    },
  },
  Ahmedabad: {
    Banas: {
      address: "Banas Dairy, Ahmedabad, India",
      contact: "+91 9908765432",
      onboarding: "5 Sep 2021",
      version: "v2.8",
      devices: { raspberryPi: 1, modBus: 3 },
      polling: { expected: 1600, received: 1550 },
    },
  },
};

const allCompanies = {
  Metalware: clientData.Noida.Metalware,
  RMZ: clientData.Bangalore.RMZ,
  Banas: clientData.Ahmedabad.Banas,
};

const Clients = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const { selectedCompany, setSelectedCompany } = useOutletContext(); // Get context

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setSelectedCompany(""); // Reset company selection when city changes
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const availableCompanies = selectedCity
    ? Object.keys(clientData[selectedCity] || {})
    : ["Metalware", "RMZ", "Banas"];

  const details = allCompanies[selectedCompany] || {
    address: "-",
    contact: "-",
    onboarding: "-",
    version: "-",
    devices: { raspberryPi: "-", modBus: "-" },
    polling: { expected: "-", received: "-" },
  };

  const successPercentage =
    details.polling.expected !== "-" && details.polling.received !== "-"
      ? ((details.polling.received / details.polling.expected) * 100).toFixed(2)
      : "-";

  return (
    <div className="flex flex-col bg-gray-100 p-2 gap-2 h-[100%]">
      {/* Filters Section */}
      <div className="grid grid-cols-2 gap-5 w-[50%]">
        <div>
          <label className="block text-lg font-semibold">City:</label>
          <select
            className="border border-gray-300 rounded-md p-2 w-[100%]"
            onChange={handleCityChange}
            value={selectedCity}
          >
            <option value="">Select City</option>
            <option value="Noida">Noida</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Ahmedabad">Ahmedabad</option>
          </select>
        </div>
        <div>
          <label className="block text-lg font-semibold">Company:</label>
          <select
            className="border border-gray-300 rounded-md p-2 w-[100%]"
            onChange={handleCompanyChange}
            value={selectedCompany}
          >
            <option value="">Select Company</option>
            {availableCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-2 gap-4 h-[100%]">
        {/* Left Section */}
        <div className="grid grid-row-2 bg-gray-100 p-2 gap-2 h-[100%]">
          {/* Company and Device Details */}
          <div className="bg-white shadow-md p-4 rounded-md h-[100%]">
            <h3 className="text-xl font-bold mb-2">Company Details:</h3>
            <p>
              <strong>Address:</strong> {details.address}
            </p>
            <p>
              <strong>Contact:</strong> {details.contact}
            </p>
            <p>
              <strong>On-Boarding:</strong> {details.onboarding}
            </p>
            <p>
              <strong>Current Version:</strong> {details.version}
            </p>
            <h3 className="text-xl font-bold mt-4 mb-2">Device Details:</h3>
            <div className="flex space-x-4">
              <div className="p-4 border rounded-md shadow-md">
                <h4 className="font-semibold">Lucy (Pi)</h4>
                <p>{details.devices.raspberryPi}</p>
              </div>
              <div className="p-4 border rounded-md shadow-md">
                <h4 className="font-semibold">ModBus</h4>
                <p>{details.devices.modBus}</p>
              </div>
            </div>
          </div>

          {/* Polling Details */}
          <div className="bg-white shadow-md p-4 rounded-md">
            <h3 className="text-xl font-bold mb-2">Polling Details:</h3>
            <div className="flex space-x-4">
              <div className="p-4 border rounded-md shadow-md">
                <h4 className="font-semibold">Expected Polling</h4>
                <p>{details.polling.expected}</p>
              </div>
              <div className="p-4 border rounded-md shadow-md">
                <h4 className="font-semibold">Received Polling</h4>
                <p>{details.polling.received}</p>
              </div>
              <div className="p-4 border rounded-md shadow-md">
                <h4 className="font-semibold">Success %</h4>
                <p>{successPercentage}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full flex items-center justify-center border-l">
          <div className="w-3/4 h-3/4 bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Image Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;