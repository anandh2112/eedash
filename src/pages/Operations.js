import React from "react";
import { useOutletContext } from "react-router-dom"; // Import context
import "./Operations.css";

const Operations = () => {
  const { selectedCompany } = useOutletContext(); // Fetch selected company

  // Device details based on selectedCompany
  const getDevicesForCompany = (company) => {
    switch (company) {
      case "Metalware":
        return {
          devices: [
            { name: "Lucy (Device 1)", staticIP: "192.168.1.101", status: "Active", lastPolled: "12 Mar 2025, 14:30", version: "v1.2.3", image: "lucy_metalware.jpg" },
            { name: "ModBus (Device 2)", macID: "00:1A:2B:3C:4D:5E", status: "Online", lastPolled: "12 Mar 2025, 14:28", version: "v2.0.1", image: "modbus_metalware.jpg" }
          ],
          history: [
            { name: "Lucy (Device)", key: "Static IP", value: "192.168.1.101" },
            { name: "ModBus (Device)", key: "MAC ID", value: "00:1A:2B:3C:4D:5E" }
          ]
        };
      case "RMZ":
        return {
          devices: [
            { name: "Lucy (Device 1)", staticIP: "192.168.2.201", status: "Inactive", lastPolled: "11 Mar 2025, 10:15", version: "v1.4.2", image: "lucy_rmz.jpg" },
            { name: "ModBus (Device 2)", macID: "AA:BB:CC:DD:EE:FF", status: "Online", lastPolled: "12 Mar 2025, 13:50", version: "v2.1.0", image: "modbus_rmz.jpg" }
          ],
          history: [
            { name: "Lucy (Device)", key: "Static IP", value: "192.168.2.201" },
            { name: "ModBus (Device)", key: "MAC ID", value: "AA:BB:CC:DD:EE:FF" }
          ]
        };
      case "Banas":
        return {
          devices: [
            { name: "Lucy (Device 1)", staticIP: "192.168.3.55", status: "Active", lastPolled: "10 Mar 2025, 16:45", version: "v1.5.0", image: "lucy_banas.jpg" },
            { name: "ModBus (Device 2)", macID: "11:22:33:44:55:66", status: "Offline", lastPolled: "9 Mar 2025, 12:30", version: "v2.2.3", image: "modbus_banas.jpg" }
          ],
          history: [
            { name: "Lucy (Device)", key: "Static IP", value: "192.168.3.55" },
            { name: "ModBus (Device)", key: "MAC ID", value: "11:22:33:44:55:66" },
            { name: "Dairy Monitor", key: "Serial No", value: "5678-4321-876" }
          ]
        };
      default:
        return {
          devices: [
            { name: "Lucy (Device 1)", staticIP: "192.168.1.101", status: "Active", lastPolled: "12 Mar 2025, 14:30", version: "v1.2.3", image: "placeholder.jpg" },
            { name: "ModBus (Device 2)", macID: "00:1A:2B:3C:4D:5E", status: "Online", lastPolled: "12 Mar 2025, 14:28", version: "v2.0.1", image: "placeholder.jpg" }
          ],
          history: [
            { name: "Lucy (Device)", key: "Static IP", value: "192.168.1.101" },
            { name: "ModBus (Device)", key: "MAC ID", value: "00:1A:2B:3C:4D:5E" },
            { name: "Device 3", key: "Serial No", value: "1234-5678-910" }
          ]
        };
    }
  };

  const { devices, history } = getDevicesForCompany(selectedCompany);

  return (
    <div className="operations-container">
      <div className="cards-container">
        {devices.map((device, index) => (
          <div className="card" key={index}>
            <div className="card-header">
              <h3>{device.name}</h3>
            </div>
            <div className="card-content">
              <div className="device-details">
                {device.staticIP && <p><strong>Static IP:</strong> {device.staticIP}</p>}
                {device.macID && <p><strong>MAC ID:</strong> {device.macID}</p>}
                <p><strong>Status:</strong> {device.status}</p>
                <p><strong>Last Polled:</strong> {device.lastPolled}</p>
                <p><strong>Version:</strong> {device.version}</p>
              </div>
              <div className="device-image"> 
                <img src={device.image} alt={device.name} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="hardware-history-container">
        <h3>Hardware History</h3>
        <div className="hardware-cards">
          {history.map((item, index) => (
            <div className="hardware-card" key={index}>
              <h4>{item.name}</h4>
              <p><b>{item.key}:</b></p>
              <p>{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Operations;
