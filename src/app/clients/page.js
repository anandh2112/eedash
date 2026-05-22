"use client";
import { useState } from "react";
import Apdiscom from "../components/Apdiscom";
import Metalware from "../components/Metalware";
import companyData from "../../../data/clients.json";

const CLIENTS = [
  { label: "AP Discom", value: "ap_discom" },
  { label: "Metalware", value: "metalware" },
];

export default function ClientsPage() {
  const [selected, setSelected] = useState("ap_discom");

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <label htmlFor="client-select" className="font-semibold text-black">
          Select Client:
        </label>
        <select
          id="client-select"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" 
        >
          {CLIENTS.map(({ label, value }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {selected === "metalware" ? (
        <Metalware data={companyData["metalware"]} />
      ) : (
        <Apdiscom data={companyData["ap_discom"]} />
      )}
    </div>
  );
}
