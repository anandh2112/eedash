import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import "./Tickets.css";

const allTicketsData = {
  Metalware: [
    {
      id: "TKT-001",
      name: "Amit Sharma",
      email: "amit@metalware.in",
      issue: "Dashboard not displaying real-time energy consumption data",
      category: "Software - Dashboard",
      date: "10 Mar 2025",
      time: "9:30 AM",
      priority: "High",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-002",
      name: "Neha Verma",
      email: "neha@metalware.in",
      issue: "Billing summary showing incorrect energy usage calculation",
      category: "Billing & Reports",
      date: "10 Mar 2025",
      time: "10:00 AM",
      priority: "Urgent",
      status: "Resolved",
      resolvedBy: { name: "Chemmal", time: "10:45 AM" },
    },
    {
      id: "TKT-003",
      name: "Rahul Kapoor",
      email: "rahul@metalware.in",
      issue: "Energy meters are not syncing with the dashboard",
      category: "Hardware - Energy Meter",
      date: "10 Mar 2025",
      time: "10:30 AM",
      priority: "Low",
      status: "In Progress",
      resolvedBy: { name: "Immanuvel", time: "12:00 PM" },
    },
    {
      id: "TKT-004",
      name: "Priya Nair",
      email: "priya@metalware.in",
      issue: "Request for a new report format to track daily energy consumption",
      category: "Software - Reporting",
      date: "10 Mar 2025",
      time: "11:00 AM",
      priority: "Low",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-005",
      name: "Ankit Mehta",
      email: "ankit@metalware.in",
      issue: "Main power distribution unit sensor failure detected",
      category: "Hardware - Sensors",
      date: "10 Mar 2025",
      time: "11:30 AM",
      priority: "High",
      status: "Resolved",
      resolvedBy: { name: "Immanuvel", time: "12:00 PM" },
    },
    {
      id: "TKT-006",
      name: "Suman Rao",
      email: "suman@metalware.in",
      issue: "System logout issue after 10 minutes of inactivity",
      category: "Software - Authentication",
      date: "10 Mar 2025",
      time: "12:00 PM",
      priority: "High",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-007",
      name: "Vikas Singh",
      email: "vikas@metalware.in",
      issue: "Energy monitoring device not responding to remote commands",
      category: "Hardware - IoT Device",
      date: "10 Mar 2025",
      time: "12:30 PM",
      priority: "Urgent",
      status: "In Progress",
      resolvedBy: { name: "Anandh", time: "1:00 PM" },
    },
    {
      id: "TKT-008",
      name: "Ravi Mishra",
      email: "ravi@metalware.in",
      issue: "Historical energy usage data missing for last week",
      category: "Software - Reporting",
      date: "10 Mar 2025",
      time: "1:00 PM",
      priority: "Low",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-009",
      name: "Anjali Gupta",
      email: "anjali@metalware.in",
      issue: "Live energy usage graph displaying incorrect values",
      category: "Software - Dashboard",
      date: "10 Mar 2025",
      time: "1:30 PM",
      priority: "High",
      status: "Resolved",
      resolvedBy: { name: "Chemmal", time: "2:00 PM" },
    },
    {
      id: "TKT-010",
      name: "Rohan Bhatia",
      email: "rohan@metalware.in",
      issue: "Device firmware update failing intermittently",
      category: "Hardware - Firmware",
      date: "10 Mar 2025",
      time: "2:00 PM",
      priority: "Urgent",
      status: "In Progress",
      resolvedBy: { name: "Anandh", time: "2:30 PM" },
    }
  ],
  RMZ: [
    {
      id: "TKT-101",
      name: "Rajesh Kumar",
      email: "rajesh@rmz.com",
      issue: "Energy monitoring tool not updating live data",
      category: "Software - Dashboard",
      date: "10 Mar 2025",
      time: "9:00 AM",
      priority: "High",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-102",
      name: "Sita Reddy",
      email: "sita@rmz.com",
      issue: "Incorrect cost estimation in billing section",
      category: "Billing & Reports",
      date: "10 Mar 2025",
      time: "9:30 AM",
      priority: "Urgent",
      status: "Resolved",
      resolvedBy: { name: "Chemmal", time: "10:00 AM" },
    },
    {
      id: "TKT-103",
      name: "Manoj Pandey",
      email: "manoj@rmz.com",
      issue: "Temperature sensor data not syncing",
      category: "Hardware - Sensors",
      date: "10 Mar 2025",
      time: "10:00 AM",
      priority: "Low",
      status: "In Progress",
      resolvedBy: { name: "Immanuvel", time: "11:30 AM" },
    },
    {
      id: "TKT-104",
      name: "Asha Nair",
      email: "asha@rmz.com",
      issue: "User login issue with multi-factor authentication",
      category: "Software - Authentication",
      date: "10 Mar 2025",
      time: "10:30 AM",
      priority: "High",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-105",
      name: "Karan Patel",
      email: "karan@rmz.com",
      issue: "Unexpected shutdown of IoT gateway",
      category: "Hardware - IoT Device",
      date: "10 Mar 2025",
      time: "11:00 AM",
      priority: "Urgent",
      status: "Resolved",
      resolvedBy: { name: "Anandh", time: "11:45 AM" },
    },
    {
      id: "TKT-106",
      name: "Preeti Malhotra",
      email: "preeti@rmz.com",
      issue: "Energy reports not being generated properly",
      category: "Software - Reporting",
      date: "10 Mar 2025",
      time: "11:30 AM",
      priority: "Low",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-107",
      name: "Suresh Yadav",
      email: "suresh@rmz.com",
      issue: "Real-time alerts not triggering on threshold breach",
      category: "Software - Alerts",
      date: "10 Mar 2025",
      time: "12:00 PM",
      priority: "High",
      status: "In Progress",
      resolvedBy: { name: "Immanuvel", time: "1:00 PM" },
    },
    {
      id: "TKT-108",
      name: "Deepa Iyer",
      email: "deepa@rmz.com",
      issue: "Unexpected delays in energy data processing",
      category: "Software - Data Processing",
      date: "10 Mar 2025",
      time: "12:30 PM",
      priority: "Low",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-109",
      name: "Ravi Kumar",
      email: "ravi@rmz.com",
      issue: "Dashboard widgets not displaying correct values",
      category: "Software - Dashboard",
      date: "10 Mar 2025",
      time: "1:00 PM",
      priority: "High",
      status: "Resolved",
      resolvedBy: { name: "Chemmal", time: "1:30 PM" },
    },
    {
      id: "TKT-110",
      name: "Meera Joshi",
      email: "meera@rmz.com",
      issue: "Energy meter firmware update failing",
      category: "Hardware - Firmware",
      date: "10 Mar 2025",
      time: "1:30 PM",
      priority: "Urgent",
      status: "In Progress",
      resolvedBy: { name: "Anandh", time: "2:00 PM" },
    }
  ],
  Banas: [
    {
      id: "TKT-201",
      name: "Arun Gupta",
      email: "arun@banas.com",
      issue: "Power consumption data not refreshing",
      category: "Software - Dashboard",
      date: "10 Mar 2025",
      time: "9:00 AM",
      priority: "High",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-202",
      name: "Pooja Desai",
      email: "pooja@banas.com",
      issue: "Billing report shows incorrect monthly summary",
      category: "Billing & Reports",
      date: "10 Mar 2025",
      time: "9:45 AM",
      priority: "Urgent",
      status: "Resolved",
      resolvedBy: { name: "Chemmal", time: "10:15 AM" },
    },
    {
      id: "TKT-203",
      name: "Rakesh Mehta",
      email: "rakesh@banas.com",
      issue: "Sensor readings are inconsistent",
      category: "Hardware - Sensors",
      date: "10 Mar 2025",
      time: "10:15 AM",
      priority: "Low",
      status: "In Progress",
      resolvedBy: { name: "Immanuvel", time: "11:45 AM" },
    },
    {
      id: "TKT-204",
      name: "Sunita Sharma",
      email: "sunita@banas.com",
      issue: "Dashboard is loading slowly",
      category: "Software - Performance",
      date: "10 Mar 2025",
      time: "10:45 AM",
      priority: "High",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-205",
      name: "Dev Patel",
      email: "dev@banas.com",
      issue: "Device connection dropping frequently",
      category: "Hardware - IoT Device",
      date: "10 Mar 2025",
      time: "11:15 AM",
      priority: "Urgent",
      status: "Resolved",
      resolvedBy: { name: "Anandh", time: "11:45 AM" },
    },
    {
      id: "TKT-206",
      name: "Rekha Iyer",
      email: "rekha@banas.com",
      issue: "Energy report missing daily data",
      category: "Software - Reporting",
      date: "10 Mar 2025",
      time: "11:45 AM",
      priority: "Low",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-207",
      name: "Mahesh Verma",
      email: "mahesh@banas.com",
      issue: "Threshold breach alerts not being sent",
      category: "Software - Alerts",
      date: "10 Mar 2025",
      time: "12:15 PM",
      priority: "High",
      status: "In Progress",
      resolvedBy: { name: "Immanuvel", time: "1:15 PM" },
    },
    {
      id: "TKT-208",
      name: "Aarti Nair",
      email: "aarti@banas.com",
      issue: "Data processing taking longer than usual",
      category: "Software - Data Processing",
      date: "10 Mar 2025",
      time: "12:45 PM",
      priority: "Low",
      status: "Open",
      resolvedBy: null,
    },
    {
      id: "TKT-209",
      name: "Suresh Kumar",
      email: "suresh@banas.com",
      issue: "Graphs on the dashboard not updating",
      category: "Software - Dashboard",
      date: "10 Mar 2025",
      time: "1:15 PM",
      priority: "High",
      status: "Resolved",
      resolvedBy: { name: "Chemmal", time: "1:45 PM" },
    },
    {
      id: "TKT-210",
      name: "Jyoti Reddy",
      email: "jyoti@banas.com",
      issue: "Firmware update not applying",
      category: "Hardware - Firmware",
      date: "10 Mar 2025",
      time: "1:45 PM",
      priority: "Urgent",
      status: "In Progress",
      resolvedBy: { name: "Anandh", time: "2:15 PM" },
    }
  ]
};


const Tickets = () => {
  const { selectedCompany } = useOutletContext(); // Get selected company from context
  const [ticketList, setTicketList] = useState([]);

  useEffect(() => {
    setTicketList(allTicketsData[selectedCompany] || []);
  }, [selectedCompany]);

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const handleStatusChange = (index, newStatus) => {
    setTicketList((prevTickets) => {
      return prevTickets.map((ticket, i) => {
        if (i === index) {
          const updatedResolvedBy =
            newStatus === "In Progress" || newStatus === "Resolved"
              ? ticket.resolvedBy || { name: "Jonathan", time: "3:00 PM" }
              : null;

          return { ...ticket, status: newStatus, resolvedBy: updatedResolvedBy };
        }
        return ticket;
      });
    });
  };

  const filteredTickets = ticketList.filter((ticket) => {
    return (
      (searchTerm === "" ||
        ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.category.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (priorityFilter === "" || ticket.priority === priorityFilter) &&
      (statusFilter === "" || ticket.status === statusFilter)
    );
  });

  return (
    <div className="tickets-container">
      <div className="filter-container">
        <div className="search-container">
          <h3>Search :</h3>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-search-bar"
          />
        </div>
        <div className="dropdown-filter">
          <h3>Priority :</h3>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>
        <div className="dropdown-filter">
          <h3>Status :</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-dropdown"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      <table className="tickets-table">
        <thead>
          <tr className="tickets-header">
            <th>Ticket</th>
            <th>Raised By</th>
            <th>Priority</th>
            <th>Description</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTickets.map((ticket, index) => (
            <tr key={index} className="ticket-row">
              <td className="ticket-col ticket-info">
                <span className="ticket-id">{ticket.id}</span>
                <span className="ticket-time">{ticket.date} | {ticket.time}</span>
              </td>
              <td className="ticket-col raised-by">
                <span className="ticket-name">{ticket.name}</span>
                <span className="ticket-email">{ticket.email}</span>
              </td>
              <td className={`ticket-col priority ${ticket.priority.toLowerCase()}`}>
                <span>{ticket.priority}</span>
              </td>
              <td className="ticket-col description">
                <span className="ticket-issue">{ticket.issue}</span>
                <span className="ticket-category">{ticket.category}</span>
              </td>
              <td className="ticket-col status">
                <select
                  className={`ticket-status-dropdown ${ticket.status.toLowerCase()}`}
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(index, e.target.value)}
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                {ticket.resolvedBy && (
                  <span className="ticket-resolved">
                    {ticket.resolvedBy.name} | {ticket.resolvedBy.time}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tickets;