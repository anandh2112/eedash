"use client";
import React, { useState, useEffect, useCallback } from "react";

const BookedTypeBadge = ({ shift, rawInput }) => {
  if (shift === null || shift === undefined) {
    return <span className="text-gray-400">—</span>;
  }
  if (shift === "kwh" || shift === "none") {
    return <span className="text-black text-xs">kWh</span>;
  }

  const label = shift === "percent" ? "%" : shift === "equipment" ? "Equip" : shift;

  return (
    <div className="relative group inline-block">
      <span className="text-blue-600 text-xs font-semibold cursor-pointer underline decoration-dotted">
        {label}
      </span>
      {rawInput && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-white text-black text-xs rounded px-2 py-1 whitespace-pre text-left shadow-lg min-w-max border border-gray-200">
          {rawInput}
        </div>
      )}
    </div>
  );
};

const formatShifted = (val) => {
  if (val === null || val === undefined) return <span className="text-gray-400">—</span>;
  const num = parseFloat(val);
  if (isNaN(num)) return <span className="text-gray-400">—</span>;
  const isNegative = num < 0;
  return (
    <span className={isNegative ? "text-red-500 font-semibold" : "text-green-600 font-semibold"}>
      <span className="text-base">{isNegative ? "↑" : "↓"}</span>
      {Math.abs(num)}
    </span>
  );
};

const PeakCell = ({ share, kwh }) => {
  const shareNum = parseFloat(share);
  const kwhNum = parseFloat(kwh);
  return (
    <td className="border px-3 py-2 text-center">
      <div className="font-medium text-black">{isNaN(shareNum) ? "—" : `${shareNum}%`}</div>
      {!isNaN(kwhNum) && (
        <div className="text-gray-500 text-xs">({kwhNum.toFixed(2)})</div>
      )}
    </td>
  );
};

const Apdiscom = () => {
  const [activeTab, setActiveTab] = useState("commercial");

  // Compute yesterday's date as the max selectable date
  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split("T")[0];
  };

  const MIN_DATE = "2025-05-01";
  const MAX_DATE = getYesterday();

  const [selectedDate, setSelectedDate] = useState(MAX_DATE);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cat = activeTab === "commercial" ? "com" : "ind";
      const res = await fetch(
        `https://ap.elementsenergies.com/api/getDatewisePoints?date=${selectedDate}&cat=${cat}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setTableData(data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data.");
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white p-2 rounded-md shadow w-full text-black">

        {/* Title + Toggle + Date Picker */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h1 className="text-xl font-bold">Polling Details</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex rounded-md overflow-hidden border border-gray-300 text-sm font-medium">
              <button
                onClick={() => setActiveTab("commercial")}
                className={`px-4 py-1.5 transition-colors ${
                  activeTab === "commercial"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Commercial
              </button>
              <button
                onClick={() => setActiveTab("industrial")}
                className={`px-4 py-1.5 border-l border-gray-300 transition-colors ${
                  activeTab === "industrial"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                Industrial
              </button>
            </div>
            <input
              type="date"
              value={selectedDate}
              min={MIN_DATE}
              max={MAX_DATE}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                if (val < MIN_DATE) return setSelectedDate(MIN_DATE);
                if (val > MAX_DATE) return setSelectedDate(MAX_DATE);
                setSelectedDate(val);
              }}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
        )}
        {!loading && error && (
          <div className="text-center py-8 text-red-400 text-sm">{error}</div>
        )}

        {/* ── COMMERCIAL TABLE ── */}
        {!loading && !error && activeTab === "commercial" && (
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th className="border px-3 py-2" rowSpan={2}>Consumer</th>
                  <th className="border px-3 py-2" colSpan={2}>Previous Day</th>
                  <th className="border px-3 py-2" colSpan={2}>Baseline</th>
                  <th className="border px-3 py-2" colSpan={2}>Actual</th>
                  <th className="border px-3 py-2" rowSpan={2}>Shifted (kWh)</th>
                  <th className="border px-3 py-2" colSpan={2}>Booked</th>
                  <th className="border px-3 py-2" colSpan={3}>Points</th>
                </tr>
                <tr className="bg-gray-200 text-center">
                  <th className="border px-3 py-2">Peak %</th>
                  <th className="border px-3 py-2">Non-Peak %</th>
                  <th className="border px-3 py-2">Peak %</th>
                  <th className="border px-3 py-2">Non-Peak %</th>
                  <th className="border px-3 py-2">Peak %</th>
                  <th className="border px-3 py-2">Non-Peak %</th>
                  <th className="border px-3 py-2">kWh</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Peak Share</th>
                  <th className="border px-3 py-2">Streak</th>
                  <th className="border px-3 py-2">Commitment</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-4 text-gray-400">No data available</td>
                  </tr>
                ) : (
                  tableData.map((row, i) => (
                    <tr key={i} className="text-center hover:bg-gray-100">
                      <td className="border px-3 py-2 text-left">
                        <span className="font-medium text-black text-sm">{row.short_name}</span>
                        <span className="text-gray-400 text-xs ml-1">({row.scno})</span>
                      </td>
                      <PeakCell share={row.previousDay?.peakShare} kwh={row.previousDay?.peakKwh} />
                      <PeakCell share={row.previousDay?.nonPeakShare} kwh={row.previousDay?.nonPeakKwh} />
                      <PeakCell share={row.avg?.peakShare} kwh={row.avg?.peakKwh} />
                      <PeakCell share={row.avg?.nonPeakShare} kwh={row.avg?.nonPeakKwh} />
                      <PeakCell share={row.target?.peakShare} kwh={row.target?.peakKwh} />
                      <PeakCell share={row.target?.nonPeakShare} kwh={row.target?.nonPeakKwh} />
                      <td className="border px-3 py-2">{formatShifted(row.kwhDifference)}</td>
                      <td className="border px-3 py-2 font-semibold text-black">{row.bookedKwh ?? "—"}</td>
                      <td className="border px-3 py-2 text-center">
                        <BookedTypeBadge shift={row.shift} rawInput={row.raw_inputs} />
                      </td>
                      <td className="border px-3 py-2 text-black font-semibold">{row.points?.peakShare ?? "—"}</td>
                      <td className="border px-3 py-2 text-black font-semibold">{row.points?.streak ?? "—"}</td>
                      <td className="border px-3 py-2 text-black font-semibold">{row.points?.commitment ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── INDUSTRIAL TABLE ── */}
        {!loading && !error && activeTab === "industrial" && (
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th className="border px-3 py-2" rowSpan={2}>Consumer</th>
                  <th className="border px-3 py-2" rowSpan={2}>Window</th>
                  <th className="border px-3 py-2" colSpan={2}>Previous Day</th>
                  <th className="border px-3 py-2" colSpan={2}>Baseline</th>
                  <th className="border px-3 py-2" colSpan={2}>Actual</th>
                  <th className="border px-3 py-2" rowSpan={2}>Shifted (kWh)</th>
                  <th className="border px-3 py-2" colSpan={2}>Booked</th>
                  <th className="border px-3 py-2" colSpan={3}>Points</th>
                </tr>
                <tr className="bg-gray-200 text-center">
                  <th className="border px-3 py-2">Peak %</th>
                  <th className="border px-3 py-2">Non-Peak %</th>
                  <th className="border px-3 py-2">Peak %</th>
                  <th className="border px-3 py-2">Non-Peak %</th>
                  <th className="border px-3 py-2">Peak %</th>
                  <th className="border px-3 py-2">Non-Peak %</th>
                  <th className="border px-3 py-2">kWh</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Peak Share</th>
                  <th className="border px-3 py-2">Streak</th>
                  <th className="border px-3 py-2">Commitment</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="text-center py-4 text-gray-400">No data available</td>
                  </tr>
                ) : (
                  tableData.map((row, i) => {
                    const windows = [
                      { label: "Morning", data: row.morning },
                      { label: "Evening", data: row.evening },
                    ];
                    return windows.map(({ label, data }, wi) => (
                      <tr key={`${i}-${wi}`} className="text-center hover:bg-gray-100 align-middle">
                        {wi === 0 && (
                          <td className="border px-3 py-2 text-left align-middle" rowSpan={2}>
                            <span className="font-medium text-black text-sm">{row.short_name}</span>
                            <br />
                            <span className="text-gray-400 text-xs">({row.scno})</span>
                          </td>
                        )}
                        <td className="border px-3 py-1.5 font-medium text-black">{label}</td>
                        <PeakCell share={data?.previousDay?.peakShare} kwh={data?.previousDay?.peakKwh} />
                        <PeakCell share={data?.previousDay?.nonPeakShare} kwh={data?.previousDay?.nonPeakKwh} />
                        <PeakCell share={data?.avg?.peakShare} kwh={data?.avg?.peakKwh} />
                        <PeakCell share={data?.avg?.nonPeakShare} kwh={data?.avg?.nonPeakKwh} />
                        <PeakCell share={data?.target?.peakShare} kwh={data?.target?.peakKwh} />
                        <PeakCell share={data?.target?.nonPeakShare} kwh={data?.target?.nonPeakKwh} />
                        <td className="border px-3 py-1.5">{formatShifted(data?.kwhDifference)}</td>
                        <td className="border px-3 py-1.5 font-semibold text-black">{data?.bookedKwh ?? "—"}</td>
                        <td className="border px-3 py-1.5 text-center">
                          <BookedTypeBadge shift={data?.shift} rawInput={data?.raw_inputs} />
                        </td>
                        <td className="border px-3 py-1.5 font-semibold text-black">{data?.points?.peakShare ?? "—"}</td>
                        <td className="border px-3 py-1.5 font-semibold text-black">{data?.points?.streak ?? "—"}</td>
                        <td className="border px-3 py-1.5 font-semibold text-black">{data?.points?.commitment ?? "—"}</td>
                      </tr>
                    ));
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default Apdiscom;