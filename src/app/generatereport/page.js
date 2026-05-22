"use client";

import { useState } from "react";

/**
 * Returns previous month & year
 * Example:
 *  - Jan 2026 → Dec 2025
 *  - Nov 2025 → Oct 2025
 */
const getPreviousMonthYear = () => {
  const now = new Date();
  let month = now.getMonth(); // 0 = Jan, 11 = Dec
  let year = now.getFullYear();

  if (month === 0) {
    month = 12;
    year -= 1;
  }

  return {
    month: String(month).padStart(2, "0"),
    year: String(year),
  };
};

export default function GenerateReportPage() {
  const { month: defaultMonth, year: defaultYear } = getPreviousMonthYear();

  const [month, setMonth] = useState(defaultMonth);
  const [year, setYear] = useState(defaultYear);

  const [loading, setLoading] = useState(false);
  const [jobStarted, setJobStarted] = useState(false);
  const [expectedFile, setExpectedFile] = useState(null);
  const [error, setError] = useState(null);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    setJobStarted(false);
    setExpectedFile(null);

    try {
      const res = await fetch("/api/generatereport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: Number(month),
          year: Number(year),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start report");

      // ✅ Job accepted – report is generating in background
      setJobStarted(true);
      setExpectedFile(
        `/reports/Metalware_Report_${month}_${year}.pptx`
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-xl mx-auto">
        {/* Card */}
        <div className="rounded-xl border border-slate-200 shadow-sm bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-800">
            Generate Monthly Energy PPT Report
          </h2>

          {/* Inputs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Month
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {[
                  ["01", "January"], ["02", "February"], ["03", "March"],
                  ["04", "April"], ["05", "May"], ["06", "June"],
                  ["07", "July"], ["08", "August"], ["09", "September"],
                  ["10", "October"], ["11", "November"], ["12", "December"],
                ].map(([val, label]) => (
                  <option key={val} value={val}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Year
              </label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-800
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateReport}
            disabled={loading}
            className={`mt-6 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white
              ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-900 hover:to-slate-800"
              }
              transition-all`}
          >
            {loading ? "Starting report generation…" : "Generate Report"}
          </button>

          {/* Error */}
          {error && (
            <p className="mt-4 text-sm text-red-600">
              ❌ {error}
            </p>
          )}

          {/* Job Started / Download */}
          {jobStarted && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-amber-800">
                ⏳ Report generation started
              </p>
              <p className="text-sm text-amber-700 mt-1">
                This may take 2–4 minutes. Please wait, then download the report.
              </p>

              {expectedFile && (
                <a
                  href={expectedFile}
                  download
                  className="inline-block mt-3 text-sm font-semibold text-indigo-700 hover:underline"
                >
                  ⬇ Try Download Report
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
