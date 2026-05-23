"use client";
import React, { useState, useEffect } from "react";

const STATUSES = ["Open", "Pending", "Closed", "Resolved"];

const STATUS_STYLES = {
  Open: {
    dot: "bg-gray-400",
    select: "bg-gray-100 text-gray-700 border-gray-300 focus:ring-gray-300",
    badge: "bg-gray-100 text-gray-700",
  },
  Pending: {
    dot: "bg-yellow-400",
    select: "bg-yellow-50 text-yellow-800 border-yellow-300 focus:ring-yellow-300",
    badge: "bg-yellow-50 text-yellow-800",
  },
  Closed: {
    dot: "bg-red-500",
    select: "bg-red-50 text-red-700 border-red-300 focus:ring-red-300",
    badge: "bg-red-50 text-red-700",
  },
  Resolved: {
    dot: "bg-green-500",
    select: "bg-green-50 text-green-700 border-green-300 focus:ring-green-300",
    badge: "bg-green-50 text-green-700",
  },
};

const ASSIGNEES = ["Ananya Rao", "Vikram Singh", "Priya Menon", "Rahul Sharma"];

const SupportTickets = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingChange, setPendingChange] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("https://ap.elementsenergies.com/api/fetchSupport");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setTableData(
          (data.data || []).map((ticket, index) => ({
            ...ticket,
            ticketId: ticket.id ?? `${ticket.scno}-${ticket.created_at}-${index}`,
            status: STATUSES[index % STATUSES.length],
            assignedTo: ASSIGNEES[index % ASSIGNEES.length],
            lastUpdated: ticket.updated_at || ticket.created_at,
          }))
        );
      } catch (err) {
        console.error("Error fetching support tickets:", err);
        setError("Failed to load support tickets.");
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.Open;

  const handleStatusChange = (ticket, nextStatus) => {
    if (ticket.status === nextStatus) return;
    setPendingChange({
      ticketId: ticket.ticketId,
      scno: ticket.scno,
      subject: ticket.subject,
      currentStatus: ticket.status,
      nextStatus,
    });
  };

  const confirmStatusChange = () => {
    if (!pendingChange) return;
    setTableData((tickets) =>
      tickets.map((ticket) =>
        ticket.ticketId === pendingChange.ticketId
          ? {
              ...ticket,
              status: pendingChange.nextStatus,
              lastUpdated: new Date().toISOString(),
            }
          : ticket
      )
    );
    setPendingChange(null);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full text-black overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-950">Support Tickets</h1>
            <p className="text-sm text-gray-500">Track, assign, and update ticket progress.</p>
          </div>
          <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{tableData.length}</span> tickets
          </div>
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
        )}
        {!loading && error && (
          <div className="text-center py-8 text-red-400 text-sm">{error}</div>
        )}

        {!loading && !error && (
          <div className="w-full overflow-x-auto p-4">
            <table className="w-full min-w-[1100px] border-separate border-spacing-0 text-sm">
              <thead>
                <tr className="bg-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                  <th className="border-b border-gray-200 px-4 py-3 rounded-l-md">SCNO</th>
                  <th className="border-b border-gray-200 px-4 py-3">Company</th>
                  <th className="border-b border-gray-200 px-4 py-3">Subject</th>
                  <th className="border-b border-gray-200 px-4 py-3">Message</th>
                  <th className="border-b border-gray-200 px-4 py-3">Created At</th>
                  <th className="border-b border-gray-200 px-4 py-3">Status</th>
                  <th className="border-b border-gray-200 px-4 py-3">Assigned To</th>
                  <th className="border-b border-gray-200 px-4 py-3 rounded-r-md">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tableData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      No support tickets available
                    </td>
                  </tr>
                ) : (
                  tableData.map((row) => {
                    const statusStyle = getStatusStyle(row.status);

                    return (
                      <tr key={row.ticketId} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="border-b border-gray-200 px-4 py-3 align-top font-semibold text-gray-950">
                          {row.scno}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top text-gray-700">
                          {row.company || "-"}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top">
                          <span className="font-medium text-gray-950">{row.subject || "-"}</span>
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top text-gray-700">
                          <span className="line-clamp-2 block max-w-xs">{row.message || "-"}</span>
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top text-xs text-gray-600">
                          {formatDate(row.created_at)}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top">
                          <div className="relative inline-flex w-28 items-center">
                            <span
                              className={`pointer-events-none absolute left-2.5 h-2 w-2 rounded-full ${statusStyle.dot}`}
                            />
                            <select
                              value={row.status}
                              onChange={(e) => handleStatusChange(row, e.target.value)}
                              className={`w-full appearance-none rounded-md border py-1.5 pl-6 pr-7 text-xs font-semibold outline-none transition focus:ring-2 ${statusStyle.select}`}
                            >
                              {STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <span className="pointer-events-none absolute right-2.5 text-[10px] leading-none text-current">
                              &#9662;
                            </span>
                          </div>
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top text-gray-700">
                          {row.assignedTo}
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3 align-top text-xs text-gray-600">
                          {formatDate(row.lastUpdated)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 text-black shadow-xl">
            <h2 className="text-lg font-semibold text-gray-950">Confirm status change</h2>
            <p className="mt-2 text-sm text-gray-600">
              Update ticket {pendingChange.scno} from{" "}
              <span
                className={`rounded px-2 py-0.5 font-semibold ${
                  getStatusStyle(pendingChange.currentStatus).badge
                }`}
              >
                {pendingChange.currentStatus}
              </span>{" "}
              to{" "}
              <span
                className={`rounded px-2 py-0.5 font-semibold ${
                  getStatusStyle(pendingChange.nextStatus).badge
                }`}
              >
                {pendingChange.nextStatus}
              </span>
              ?
            </p>
            <p className="mt-3 rounded-md bg-gray-50 p-3 text-sm text-gray-700">
              {pendingChange.subject || "No subject"}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingChange(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmStatusChange}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;
