"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const BASELINE_COLUMNS = [
  "target",
  "previousDay",
  "sevenDayAvg",
  "sevenDayMedian",
  "thirtyDayAvg",
  "thirtyDayMedian",
];

const COLUMN_LABELS = {
  target: "target",
  previousDay: "previousDay",
  sevenDayAvg: "sevenDayAvg",
  sevenDayMedian: "sevenDayMedian",
  thirtyDayAvg: "thirtyDayAvg",
  thirtyDayMedian: "thirtyDayMedian",
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatNumber = (value, suffix = "") => {
  if (value === null || value === undefined || value === "") return "-";
  const num = Number(value);
  if (Number.isNaN(num)) return "-";
  return `${num.toFixed(2)}${suffix}`;
};

const BookingCell = ({ bookedKwh, slot }) => {
  if (bookedKwh === null || bookedKwh === undefined) {
    return <td className="border px-2 py-2 text-center text-gray-400">--</td>;
  }

  if (typeof bookedKwh === "number" || typeof bookedKwh === "string") {
    const value = Number(bookedKwh);
    if (Number.isNaN(value)) {
      return <td className="border px-2 py-2 text-center text-gray-400">--</td>;
    }
    return <td className="border px-2 py-2 text-center font-medium text-black">{value.toFixed(2)}</td>;
  }

  const slotValue = bookedKwh?.[slot?.toLowerCase()];
  if (slotValue === null || slotValue === undefined) {
    return <td className="border px-2 py-2 text-center text-gray-400">--</td>;
  }
  return <td className="border px-2 py-2 text-center font-medium text-black">{Number(slotValue).toFixed(2)}</td>;
};

const getShiftValue = (logic, slot, isIndustrial) => {
  const difference = logic?.kwhDifference;
  if (difference === null || difference === undefined) return null;
  if (typeof difference === "number" || typeof difference === "string") return difference;
  if (isIndustrial && slot) return difference[slot.toLowerCase()];
  return difference.total ?? difference.peak ?? difference.morning ?? difference.evening ?? null;
};

const MetricCell = ({ share, kwh }) => (
  <td className="border px-2 py-2 text-center">
    <div className="font-medium text-black">{formatNumber(share, "%")}</div>
    {kwh !== null && kwh !== undefined && (
      <div className="text-xs text-gray-500">({formatNumber(kwh)})</div>
    )}
  </td>
);

const ShiftedCell = ({ value }) => {
  if (value === null || value === undefined || value === "") {
    return <td className="border px-2 py-2 text-center text-gray-400">-</td>;
  }

  const num = Number(value);
  if (Number.isNaN(num)) {
    return <td className="border px-2 py-2 text-center text-gray-400">-</td>;
  }

  return (
    <td
      className={`border px-2 py-2 text-center font-semibold ${
        num < 0 ? "text-red-500" : "text-green-600"
      }`}
    >
      {num.toFixed(2)}
    </td>
  );
};

const LogicCells = ({ logic, slot, isIndustrial }) => {
  const slotPrefix = slot?.toLowerCase();
  const peakShareKey = isIndustrial ? `${slotPrefix}PeakShare` : "peakShare";
  const peakKwhKey = isIndustrial ? `${slotPrefix}PeakKwh` : "peakKwh";

  return (
    <>
      <MetricCell share={logic?.[peakShareKey]} kwh={logic?.[peakKwhKey]} />
      <MetricCell share={logic?.nonPeakShare} kwh={logic?.nonPeakKwh} />
      <ShiftedCell value={getShiftValue(logic, slot, isIndustrial)} />
    </>
  );
};

const getColumnSpan = (column) => (column === "target" ? 2 : 3);

const BaselineLogics = ({ consumer, activeTab, onBack }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isIndustrial = activeTab === "industrial";
  const cat = isIndustrial ? "ind" : "com";

  const fetchDetails = useCallback(async () => {
    if (!consumer?.scno) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://ap.elementsenergies.com/api/getBaselineLogics?scno=${encodeURIComponent(
          consumer.scno
        )}&cat=${cat}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDetails(data);
    } catch (err) {
      console.error("Error fetching baseline logics:", err);
      setError("Failed to load baseline logics.");
      setDetails(null);
    } finally {
      setLoading(false);
    }
  }, [cat, consumer?.scno]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const rows = useMemo(() => details?.data || [], [details]);
  const metricColSpan = BASELINE_COLUMNS.reduce(
    (total, column) => total + getColumnSpan(column),
    0
  );
  const emptyColSpan = metricColSpan + (isIndustrial ? 3 : 2);

  return (
    <div className="flex min-w-0 min-h-0 flex-col gap-4 w-full">
      <div className="bg-white p-2 rounded-md shadow w-full min-w-0 min-h-0 text-black">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold">Baseline Logics</h1>
            <p className="text-sm text-gray-500">
              {details?.short_name || consumer?.short_name || "-"}{" "}
              <span className="text-gray-400">({details?.scno || consumer?.scno})</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
        )}
        {!loading && error && (
          <div className="text-center py-8 text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="w-full max-w-full min-w-0 max-h-[calc(100vh-230px)] overflow-auto pb-4">
            <table className="w-max min-w-full border-collapse text-xs">
              <thead>
                <tr className="bg-gray-300 text-center">
                  <th className="sticky top-0 z-10 border bg-gray-300 px-2 py-2" rowSpan={2}>
                    Date
                  </th>
                  {isIndustrial && (
                    <th className="sticky top-0 z-10 border bg-gray-300 px-2 py-2" rowSpan={2}>
                      Window
                    </th>
                  )}
                  <th className="sticky top-0 z-10 border bg-gray-300 px-2 py-2" rowSpan={2}>
                    Booking
                  </th>
                  {BASELINE_COLUMNS.map((column) => (
                    <th
                      key={column}
                      className="sticky top-0 z-10 border bg-gray-300 px-2 py-2"
                      colSpan={getColumnSpan(column)}
                    >
                      {COLUMN_LABELS[column]}
                    </th>
                  ))}
                </tr>
                <tr className="bg-gray-200 text-center">
                  {BASELINE_COLUMNS.map((column) => (
                    <React.Fragment key={column}>
                      <th className="sticky top-[34px] z-10 border bg-gray-200 px-2 py-2">
                        Peak %
                      </th>
                      <th className="sticky top-[34px] z-10 border bg-gray-200 px-2 py-2">
                        Non-Peak %
                      </th>
                      {column !== "target" && (
                        <th className="sticky top-[34px] z-10 border bg-gray-200 px-2 py-2">
                          Shifted
                        </th>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
                
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={emptyColSpan} className="text-center py-4 text-gray-400">
                      No data available
                    </td>
                  </tr>
                ) : isIndustrial ? (
                  rows.map((row, rowIndex) =>
                    ["Morning", "Evening"].map((slot, slotIndex) => (
                      <tr
                        key={`${row.date}-${slot}-${rowIndex}`}
                        className="text-center hover:bg-gray-100 align-middle"
                      >
                        {slotIndex === 0 && (
                          <td className="border px-2 py-2 align-middle font-medium" rowSpan={2}>
                            {formatDate(row.date)}
                          </td>
                        )}
                        <td className="border px-2 py-2 font-medium text-black">{slot}</td>
                        <BookingCell bookedKwh={row.bookedKwh} slot={slot} />
                        {BASELINE_COLUMNS.map((column) =>
                          column === "target" ? (
                            <React.Fragment key={column}>
                              <MetricCell
                                share={row[column]?.[`${slot.toLowerCase()}PeakShare`]}
                                kwh={row[column]?.[`${slot.toLowerCase()}PeakKwh`]}
                              />
                              <MetricCell
                                share={row[column]?.nonPeakShare}
                                kwh={row[column]?.nonPeakKwh}
                              />
                            </React.Fragment>
                          ) : (
                            <LogicCells
                              key={column}
                              logic={row[column]}
                              slot={slot}
                              isIndustrial={isIndustrial}
                            />
                          )
                        )}
                      </tr>
                    ))
                  )
                ) : (
                  rows.map((row, rowIndex) => (
                    <tr key={`${row.date}-${rowIndex}`} className="text-center hover:bg-gray-100">
                      <td className="border px-2 py-2 font-medium">{formatDate(row.date)}</td>
                      <BookingCell bookedKwh={row.bookedKwh} />
                      {BASELINE_COLUMNS.map((column) =>
                        column === "target" ? (
                          <React.Fragment key={column}>
                            <MetricCell
                              share={row[column]?.totalPeakShare ?? row[column]?.peakShare}
                              kwh={row[column]?.totalPeakKwh ?? row[column]?.peakKwh}
                            />
                            <MetricCell
                              share={row[column]?.nonPeakShare}
                              kwh={row[column]?.nonPeakKwh}
                            />
                          </React.Fragment>
                        ) : (
                          <LogicCells
                            key={column}
                            logic={row[column]}
                            isIndustrial={isIndustrial}
                          />
                        )
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div style={{ height: 48 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BaselineLogics;
