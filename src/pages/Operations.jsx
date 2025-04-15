import React from "react";
import { useOutletContext } from "react-router-dom"; // Import context
import Lucy from "../images/Lucy.jpg";
import ModBus from "../images/ModBus.jpg";

const Operations = () => {
  const { selectedCompany } = useOutletContext(); // Fetch selected company

  // Device details based on selectedCompany
  const getDevicesForCompany = (company) => {
    switch (company) {
      case "Metalware":
        return {
          devices: [
            { id: "RPI-101", name: "Lucy (Device 1)", staticIP: "192.168.1.101", status: "Active", lastPolled: "12 Mar 2025, 14:30", version: "v1.2.3", dateInstalled: "10 Jan 2025", health: 95, image: Lucy }, // Replace with the actual path to the picture
            { id: "MB-201", name: "ModBus (Device 2)", macID: "00:1A:2B:3C:4D:5E", status: "Online", lastPolled: "12 Mar 2025, 14:28", version: "v2.0.1", dateInstalled: "15 Feb 2025", health: 18, image: ModBus } // Replace with the actual path to the picture
          ],
          history: [
            { id: "RPI-101", key: "Static IP", value: "192.168.1.101" },
            { id: "MB-201", key: "MAC ID", value: "00:1A:2B:3C:4D:5E" }
          ]
        };
      case "RMZ":
        return {
          devices: [
            { id: "RPI-202", name: "Lucy (Device 1)", staticIP: "192.168.2.201", status: "Inactive", lastPolled: "11 Mar 2025, 10:15", version: "v1.4.2", dateInstalled: "20 Jan 2025", health: 70, image: Lucy }, // Replace with the actual path to the picture
            { id: "MB-302", name: "ModBus (Device 2)", macID: "AA:BB:CC:DD:EE:FF", status: "Online", lastPolled: "12 Mar 2025, 13:50", version: "v2.1.0", dateInstalled: "18 Feb 2025", health: 85, image: ModBus } // Replace with the actual path to the picture
          ],
          history: [
            { id: "RPI-202", key: "Static IP", value: "192.168.2.201" },
            { id: "MB-302", key: "MAC ID", value: "AA:BB:CC:DD:EE:FF" }
          ]
        };
      case "Banas":
        return {
          devices: [
            { id: "RPI-303", name: "Lucy (Device 1)", staticIP: "192.168.3.55", status: "Active", lastPolled: "10 Mar 2025, 16:45", version: "v1.5.0", dateInstalled: "25 Jan 2025", health: 90, image: Lucy }, // Replace with the actual path to the picture
            { id: "MB-403", name: "ModBus (Device 2)", macID: "11:22:33:44:55:66", status: "Offline", lastPolled: "9 Mar 2025, 12:30", version: "v2.2.3", dateInstalled: "5 Feb 2025", health: 60, image: ModBus } // Replace with the actual path to the picture
          ],
          history: [
            { id: "RPI-303", key: "Static IP", value: "192.168.3.55" },
            { id: "MB-403", key: "MAC ID", value: "11:22:33:44:55:66" }
          ]
        };
      default:
        return {
          devices: [],
          history: []
        };
    }
  };

  const { devices, history } = getDevicesForCompany(selectedCompany);

  // Function to determine health bar color based on value
  const getHealthColor = (health) => {
    if (health < 20) return "text-red-500";
    if (health < 60) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {devices.map((device, index) => (
          <div
            className="bg-white shadow-md rounded-lg overflow-hidden flex"
            key={index}
          >
            {/* Image Section */}
            <div className="w-1/3 bg-gray-200 flex items-center justify-center">
              <img
                src={device.image} // Replace with the actual path to the picture
                alt={device.name}
                className="h-32 object-contain"
              />
            </div>

            {/* Details Section */}
            <div className="p-4 w-2/3 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {device.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Device ID: {device.id}
                </p>
                {device.staticIP && (
                  <p className="text-sm text-gray-700">
                    <strong>Static IP:</strong> {device.staticIP}
                  </p>
                )}
                {device.macID && (
                  <p className="text-sm text-gray-700">
                    <strong>MAC ID:</strong> {device.macID}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> {device.status}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Last Polled:</strong> {device.lastPolled}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Version:</strong> {device.version}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Date Installed:</strong> {device.dateInstalled}
                </p>
              </div>

              {/* Device Health Section */}
              <div className="flex items-center mt-4">
                <div className="relative w-16 h-16">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 36 36"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      className="text-gray-300"
                      strokeWidth="3.8"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className={getHealthColor(device.health)}
                      strokeWidth="3.8"
                      strokeDasharray={`${device.health}, 100`}
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm text-gray-800 font-semibold">
                      {device.health}%
                    </span>
                  </div>
                </div>
                <span className="ml-4 text-sm text-gray-700 font-medium">
                  Device Health
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Hardware History
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((item, index) => (
            <div
              className="bg-white shadow-md p-4 rounded-lg"
              key={index}
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {item.id}
              </h4>
              <p className="text-sm text-gray-700">
                <strong>{item.key}:</strong> {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Operations;