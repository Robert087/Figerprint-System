import React, { useState } from "react"
import {
  FaUsers, FaBook, FaFingerprint, FaSignOutAlt, FaUserPlus, FaHome, FaMoon, FaSun, FaBell
} from "react-icons/fa"
import CourseManagement from "./CourseManagement"
import StudentManagement from "./StudentManagement"
import FingerprintLinker from "./FingerprintLinker"
import DefineDoctorTab from "./DefineDoctorTab"
import ManageSchedule from "./ManageSchedule"
import NotificationTab from "./AdminNotificationsTab.js"
import "../dashboard.css"

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const toggleSidebar = () => setCollapsed(!collapsed)
  const toggleTheme = () => setDarkMode(!darkMode)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "courses", label: "Manage Courses", icon: <FaBook /> },
    { id: "students", label: "Manage Students", icon: <FaUsers /> },
    { id: "fingerprint", label: "Link Fingerprints", icon: <FaFingerprint /> },
    { id: "define-doctor", label: "Define Doctor", icon: <FaUserPlus /> },
    { id: "schedule", label: "Manage Schedule", icon: <FaBook /> },
    { id: "notifications", label: "Notifications", icon: <FaBell /> },
    { id: "logout", label: "Logout", icon: <FaSignOutAlt /> }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case "courses": return <CourseManagement />
      case "students": return <StudentManagement />
      case "fingerprint": return <FingerprintLinker />
      case "define-doctor": return <DefineDoctorTab />
      case "schedule": return <ManageSchedule />
      case "notifications": return <NotificationTab />
      case "dashboard": return (
        <div className="dashboard-layout">
          <div className="dashboard-header">
            <h1>Welcome, Admin</h1>
            <p className="subtitle">Manage the system’s core modules with ease.</p>
          </div>
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon courses"><FaBook /></div>
              <div className="stat-info">
                <h3>Courses</h3>
                <div className="stat-value">12</div>
                <div className="stat-detail">Available Courses</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><FaUsers /></div>
              <div className="stat-info">
                <h3>Students</h3>
                <div className="stat-value">160</div>
                <div className="stat-detail">Registered Students</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon fingerprint"><FaFingerprint /></div>
              <div className="stat-info">
                <h3>Fingerprints</h3>
                <div className="stat-value">140</div>
                <div className="stat-detail">Linked Fingerprints</div>
              </div>
            </div>
          </div>
        </div>
      )
      case "logout":
        localStorage.clear()
        window.location.href = "/"
        return null
      default:
        return null
    }
  }

  return (
    <div className={`layout ${darkMode ? "dark-mode" : ""}`}>
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo">Admin</h2>
          <div className="toggle-btn" onClick={toggleSidebar}>
            {collapsed ? "»" : "«"}
          </div>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section-title">Management</div>
          {tabs.map(tab => (
            <div key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}>
              <div className="tab-icon">{tab.icon}</div>
              <span className="tab-label">{tab.label}</span>
            </div>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="theme-toggle" onClick={toggleTheme}>
            <span className="theme-icon">{darkMode ? <FaSun /> : <FaMoon />}</span>
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="main">
        <div className="header">
          <div className="header-left">
            <h2>Admin Dashboard</h2>
          </div>
          <div className="header-right">
            <div className="profile-dropdown">
              <div className="profile-info">
                <div className="profile-avatar">A</div>
                <span className="profile-name">Admin</span>
              </div>
            </div>
          </div>
        </div>

        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
