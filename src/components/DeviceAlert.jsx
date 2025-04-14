import React from "react";

const DeviceAlert = () => {
  const alerts = [
    { id: 1, message: "DG Set - Overload", type: "Critical", time: "2 mins ago", status: "unaddressed" },
    { id: 2, message: "Main Panel - Voltage Drop", type: "Warning", time: "10 mins ago", status: "being addressed" },
    { id: 3, message: "Solar Meter - Dysfunctional", type: "Critical", time: "30 mins ago", status: "unaddressed" },
    { id: 4, message: "Modbus - Offline", type: "Critical", time: "40 mins ago", status: "being addressed" },
    { id: 5, message: "Battery - Low Voltage", type: "Warning", time: "1 hour ago", status: "unaddressed" },
  ];

  // Filter alerts to only include unaddressed and being addressed statuses
  const filteredAlerts = alerts.filter(
    (alert) => alert.status === "unaddressed" || alert.status === "being addressed"
  );

  const affectedCount = filteredAlerts.length;

  const getColor = () => {
    if (affectedCount === 0) return "text-green-600";
    if (affectedCount <= 2) return "text-yellow-500";
    return "text-red-600";
  };

  const getAlertBackground = (status) => {
    if (status === "being addressed") return "bg-yellow-100 border-yellow-300";
    return "bg-red-100 border-red-300"; // Default for unaddressed
  };

  return (
    <div className="bg-white flex flex-col justify-start shadow-md rounded-lg p-4 w-full gap-9">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Alerts</h2>
      <div className="flex flex-col gap-2">
        <div className={`text-9xl text-center font-bold ${getColor()}`}>{affectedCount}</div>
        <div className={`text-md text-center text-gray-500 mb-4 ${getColor()}`}>Devices Affected</div>
      </div>
      {/* Scrollable list container */}
      <ul
        className={`space-y-3 overflow-y-auto ${affectedCount > 4 ? "max-h-64" : ""} custom-scrollbar`}
      >
        {affectedCount > 0 ? (
          filteredAlerts.map((alert) => (
            <li
              key={alert.id}
              className={`border rounded p-3 ${getAlertBackground(alert.status)}`}
            >
              <div className="text-sm text-gray-900 font-medium">{alert.message}</div>
              <div className="text-xs text-gray-600">{alert.time}</div>
            </li>
          ))
        ) : (
          // Empty gray cards for 0 affected devices
          Array.from({ length: 3 }).map((_, index) => (
            <li
              key={`empty-${index}`}
              className="border rounded p-3 bg-gray-100 border-gray-300"
            >
              <div className="text-sm text-gray-400 font-medium">-</div>
              <div className="text-xs text-gray-400">-</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DeviceAlert;