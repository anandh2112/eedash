import React from "react";

const ClientPipeline = () => {
  const pipelines = [
    { id: 1, company: "Metalware", status: "Onboarding", stage: "Site Survey" },
    { id: 2, company: "RMZ", status: "In Progress", stage: "Installation" },
    { id: 3, company: "Banas Infra", status: "Pending", stage: "Documentation" },
  ];

  const getProgress = (stage) => {
    switch (stage) {
      case "Site Survey":
        return { percentage: 25, description: "Project Initialization" };
      case "Installation":
        return { percentage: 50, description: "Installation Phase" };
      case "Development":
        return { percentage: 75, description: "Development Phase" };
      case "Handed Over":
        return { percentage: 100, description: "Handed Over" };
      default:
        return { percentage: 0, description: "Not Started" };
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Client Pipeline</h2>
      <div className="space-y-6">
        {pipelines.map((client) => {
          const progress = getProgress(client.stage);
          return (
            <div
              key={client.id}
              className="border border-gray-200 p-4 rounded-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-gray-800 font-medium text-sm">
                    {client.company}
                  </div>
                  <div className="text-xs text-gray-500">{client.stage}</div>
                </div>
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    client.status === "Onboarding"
                      ? "bg-blue-100 text-blue-700"
                      : client.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                <div
                  className={`h-2.5 rounded-full ${
                    progress.percentage >= 25 && progress.percentage < 50
                      ? "bg-blue-500"
                      : progress.percentage >= 50 && progress.percentage < 75
                      ? "bg-yellow-500"
                      : progress.percentage === 100
                      ? "bg-green-500"
                      : "bg-gray-500"
                  }`}
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-600 text-center">
                {progress.description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientPipeline;