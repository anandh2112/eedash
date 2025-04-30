import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaUser, FaBell } from "react-icons/fa";
import Logo from "../images/Logo 1.png";
import "./Layout.css";

const Layout = () => {
  const location = useLocation();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [selectedCompany, setSelectedCompany] = useState(null); // Lifted state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New ticket assigned in Tickets", read: false },
    { id: 2, text: "Installation completed for RMZ", read: false },
    { id: 3, text: "Admin updated user permissions", read: true },
    { id: 4, text: "Energy report generated for Banas", read: false },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notifications-dropdown") && !event.target.closest(".icon-container")) {
        setShowNotifications(false);
      }
      if (!event.target.closest(".profile-dropdown") && !event.target.closest(".profile-icon-container")) {
        setShowProfile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const currentPath = location.pathname;

    // List of sub-tabs under Clients
    const clientSubTabs = [
      "/installations",
      "/operations",
      "/reports",
      "/admin",
      "/tickets",
    ];

    // Highlight the correct tab
    if (currentPath === "/") {
      setActiveTab("Dashboard");
    } else if (currentPath === "/clients") {
      setActiveTab("Clients");
    } else if (clientSubTabs.includes(currentPath)) {
      setActiveTab(currentPath);
    } else if (currentPath.startsWith("/elements-score")) {
      setActiveTab("Elements Score");
    } else if (currentPath.startsWith("/alerts")) {
      setActiveTab("Alerts");
    } else {
      setActiveTab("");
    }

    // Keep submenu open if inside Clients' sub-tabs
    if (clientSubTabs.includes(currentPath) || currentPath === "/clients") {
      setShowSubmenu(true);
    }
  }, [location.pathname]);

  // Toggle submenu only when clicking Clients
  const toggleSubmenu = () => {
    setShowSubmenu((prev) => !prev);
  };

  // Toggle Notifications Dropdown
  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Toggle Profile Dropdown
  const toggleProfile = () => {
    setShowProfile((prev) => !prev);
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Count unread notifications
  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <div className="flex h-[100vh]">
      {/* Sidebar */}
      <aside className="w-[15%] bg-[#e8f5f1] p-[2vmin] flex flex-col items-center">
        <div className="text-[4vmin] font-bold text-[#36404d] mb-[4vmin] flex justify-center items-center p-[10px]">
          <img src={Logo} alt="Company Logo" className="w-[85%] h-auto" />
        </div>
        <nav>
          <Link to="/" className={activeTab === "Dashboard" ? "active" : ""}>
            Dashboard
          </Link>

          <Link
            to="/clients"
            className={activeTab === "Clients" ? "active" : ""}
            onClick={toggleSubmenu}
          >
            Clients
          </Link>

          {/* Submenu for Clients */}
          {showSubmenu && (
            <div className="submenu">
              {/* <Link
                to="/installations"
                className={activeTab === "/installations" ? "active" : ""}
              >
                Installations
              </Link> */}
              <Link
                to="/operations"
                className={activeTab === "/operations" ? "active" : ""}
              >
                Operations
              </Link>
              <Link
                to="/reports"
                className={activeTab === "/reports" ? "active" : ""}
              >
                Reports
              </Link>
              <Link
                to="/admin"
                className={activeTab === "/admin" ? "active" : ""}
              >
                Admin
              </Link>
              <Link
                to="/tickets"
                className={activeTab === "/tickets" ? "active" : ""}
              >
                Tickets
              </Link>
            </div>
          )}

          <Link
            to="/elements-score"
            className={activeTab === "Elements Score" ? "active" : ""}
          >
            Elements Score
          </Link>
          <Link to="/alerts" className={activeTab === "Alerts" ? "active" : ""}>
            Alerts
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="navbar">
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="icons">
            {/* Notification Icon */}
            <div className="icon-container" onClick={toggleNotifications}>
              <FaBell className="icon" />
              {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
            </div>

            {/* Profile Icon */}
            <div className="profile-icon-container" onClick={toggleProfile}>
              <FaUser className="icon" />
            </div>
          </div>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <h4>Notifications</h4>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${notif.read ? "read" : "unread"}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    {notif.text}
                  </div>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </div>
          )}

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="profile-dropdown">
              <h4>Hello, Jonathan!</h4>
              <div className="profile-pic-container">
                {/* Add profile picture source here */}
                <img src="path-to-profile-pic.jpg" alt="Profile" className="profile-pic" />
              </div>
              <div className="profile-options">
                <Link to="/help">Help</Link>
                <Link to="/logout">Log-out</Link>
              </div>
            </div>
          )}
        </header>

        {/* Pass selectedCompany and setSelectedCompany to all sub-tabs */}
        <Outlet context={{ selectedCompany, setSelectedCompany }} />
      </div>
    </div>
  );
};

export default Layout;
