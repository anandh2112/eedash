import React, { useState } from "react";
import { useOutletContext } from "react-router-dom"; // Import context hook
import "./Installations.css";

const Installations = () => {
  const { selectedCompany } = useOutletContext(); // Get selected company from context

  // Installation data based on selectedCompany
  const getInstallationsForCompany = (company) => {
    switch (company) {
      case "Metalware":
        return [
          { id: 1, title: "Metalware Setup", description: "Configuring devices at Noida's Metalware site.", acknowledgers: ["CH"] },
          { id: 2, title: "Firmware Update", description: "Latest software patch deployment.", acknowledgers: [] },
          { id: 3, title: "Network Optimization", description: "Improving connectivity at Metalware.", acknowledgers: ["JP"] },
          { id: 4, title: "Server Integration", description: "Syncing cloud services.", acknowledgers: ["CH"] },
        ];
      case "RMZ":
        return [
          { id: 1, title: "RMZ Installation", description: "Deploying hardware at RMZ EcoWorld.", acknowledgers: ["JP"] },
          { id: 2, title: "Device Calibration", description: "Ensuring sensors function optimally.", acknowledgers: [] },
          { id: 3, title: "Security Patch", description: "Applying security updates for RMZ.", acknowledgers: ["CH"] },
          { id: 4, title: "Power Optimization", description: "Enhancing energy efficiency.", acknowledgers: [] },
        ];
      case "Banas":
        return [
          { id: 1, title: "Banas Dairy Setup", description: "Establishing industrial monitoring.", acknowledgers: ["CH"] },
          { id: 2, title: "System Upgrade", description: "Upgrading servers and control units.", acknowledgers: ["JP"] },
          { id: 3, title: "Sensor Realignment", description: "Adjusting tracking systems.", acknowledgers: [] },
          { id: 4, title: "Performance Tuning", description: "Fine-tuning efficiency at Banas Dairy.", acknowledgers: ["JP"] },
        ];
      default:
        return [
          { id: 1, title: "Installation 1", description: "This is a short description about installation 1.", acknowledgers: ["CH"] },
          { id: 2, title: "Installation 2", description: "This is a short description about installation 2.", acknowledgers: [] },
          { id: 3, title: "Installation 3", description: "This is a short description about installation 3.", acknowledgers: ["JP"] },
          { id: 4, title: "Installation 4", description: "This is a short description about installation 4.", acknowledgers: ["CH"] },
        ];
    }
  };

  const [installations, setInstallations] = useState(getInstallationsForCompany(selectedCompany));

  // Handle acknowledgment toggle
  const toggleAcknowledge = (index) => {
    setInstallations((prevInstallations) => {
      return prevInstallations.map((card, i) => {
        if (i === index) {
          const hasAcknowledged = card.acknowledgers.includes("JP");
          const updatedAcknowledgerList = hasAcknowledged
            ? card.acknowledgers.filter(name => name !== "JP")
            : [...card.acknowledgers, "JP"];

          return { ...card, acknowledgers: updatedAcknowledgerList };
        }
        return card;
      });
    });
  };

  return (
    <div className="installations-container">
      <h1 className="installations-heading">
        {selectedCompany ? `${selectedCompany} Installations` : "Installations"}
      </h1>
      <div className="installations-grid">
        {installations.map((card, index) => (
          <div key={card.id} className="installation-card">
            <h2 className="installation-title">{card.title}</h2>
            <p className="installation-description">{card.description}</p>
            <div className="acknowledgment" onClick={() => toggleAcknowledge(index)}>
              <span className="tick-mark">✔️</span>
              <span className={`acknowledgment-bubble ${card.acknowledgers.length === 0 ? "hidden" : ""}`}>
                {card.acknowledgers.length}
              </span>
              {card.acknowledgers.length > 0 && (
                <span className="tooltip">
                  {card.acknowledgers.join(", ")}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Installations;
