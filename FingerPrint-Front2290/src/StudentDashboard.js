"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaUser,
  FaChartBar,
  FaBook,
  FaFingerprint,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaBars,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaGlobe,
  FaEdit,
  FaKey,
  FaSignOutAlt,
  FaSearch,
  FaHome,
} from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import {
  fetchStudentProfile,
  fetchTimetable,
  fetchAttendanceSummary,
  fetchFingerprintLogs,
  matchFingerprint,
  fetchCourseAttendance,
} from "./services/studentService"
import "./dashboard.css"

function StudentDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("english")
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const profileDropdownRef = useRef(null)

  // Student data states
  const [student, setStudent] = useState({})
  const [timetable, setTimetable] = useState([])
  const [attendanceSummary, setAttendanceSummary] = useState({})
  const [fingerprintLogs, setFingerprintLogs] = useState([])
  const [fingerprintTodayScanned, setFingerprintTodayScanned] = useState(false)
  const [courses, setCourses] = useState([])
  const [activeDay, setActiveDay] = useState("Sunday")
  const [notifications, setNotifications] = useState([
    { message: "Midterm exams start next week.", date: "2025-04-05", isRead: false },
    { message: "Project deadline extended.", date: "2025-04-03", isRead: true },
    { message: "New course materials available.", date: "2025-04-01", isRead: false },
    { message: "Campus closed for holiday.", date: "2025-03-28", isRead: true },
  ])

  useEffect(() => {
    const loadData = async () => {
      try {
        const profile = await fetchStudentProfile()
        const table = await fetchTimetable()
        const summary = await fetchAttendanceSummary()
        const logs = await fetchFingerprintLogs()
        const courseList = await fetchCourseAttendance()

        setStudent(profile)
        setTimetable(table)
        setAttendanceSummary(summary)
        setFingerprintLogs(logs)
        setCourses(courseList)

        const today = new Date().toISOString().slice(0, 10)
        const scannedToday = logs.some((log) => log.date === today && log.result === "Success")
        setFingerprintTodayScanned(scannedToday)
      } catch (error) {
        console.error("Error loading student data:", error)
      }
    }
    loadData()

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/")
    }
  }

  const toggleDarkMode = () => setDarkMode(!darkMode)
  
  const toggleLanguage = () => {
    setLanguage(language === "english" ? "arabic" : "english")
  }

  const handleFingerprintScan = async () => {
    try {
      const result = await matchFingerprint()
      alert(result.message)
      if (result.success) setFingerprintTodayScanned(true)
    } catch (error) {
      alert("Failed to scan fingerprint.")
      console.error(error)
    }
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <FaHome /> },
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "courseAttendance", label: "Course Attendance", icon: <FaBook /> },
    { id: "fingerprintLog", label: "Fingerprint Log", icon: <FaFingerprint /> },
    { id: "schedule", label: "Schedule", icon: <FaCalendarAlt /> },
    { id: "notifications", label: "Notifications", icon: <FaBell />, badge: notifications.filter(n => !n.isRead).length },
    { id: "settings", label: "Settings", icon: <FaCog /> },
  ]

  // Get breadcrumb title based on active tab
  const getBreadcrumbTitle = () => {
    const tab = tabs.find(t => t.id === activeTab)
    return tab ? tab.label : ""
  }

  // Filter logs based on search query
  const filteredLogs = fingerprintLogs.filter(log => 
    log.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.result.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter courses based on search query
  const filteredCourses = courses.filter(course => 
    course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.courseCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className={`layout ${darkMode ? "dark-mode" : ""} ${language === "arabic" ? "rtl" : "ltr"}`}>
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-logo"> 🎓 Akhbar El-Youm Academy</h2>
          <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            <FaBars />
          </div>
        </div>
        
        <div className="sidebar-content">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="tab-icon">{tab.icon}</div>
              {!collapsed && (
                <>
                  <span className="tab-label">{tab.label}</span>
                  {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="sidebar-footer">
          <div className="theme-toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
            {!collapsed && <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>}
          </div>
        </div>
      </div>

      <div className="main">
        <header className="header">
          <div className="header-left">
            <div className="search-container">
              <FaSearch className="search-icon" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="header-right" ref={profileDropdownRef}>
            <div className="profile-dropdown" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
              <div className="profile-info">
                <div className="profile-avatar">
                  {student.displayName?.charAt(0) || "S"}
                </div>
                <span className="profile-name">{student.displayName}</span>
                <FaChevronDown className="dropdown-icon" />
              </div>
              
              {profileDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      {student.displayName?.charAt(0) || "S"}
                    </div>
                    <div className="dropdown-user-info">
                      <h4>{student.displayName}</h4>
                      <p>{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-item">
                    <FaEdit className="dropdown-item-icon" />
                    <span>Edit Profile</span>
                  </div>
                  
                  <div className="dropdown-item">
                    <FaKey className="dropdown-item-icon" />
                    <span>Change Password</span>
                  </div>
                  
                  <div className="dropdown-item" onClick={toggleLanguage}>
                    <FaGlobe className="dropdown-item-icon" />
                    <span>{language === "english" ? "العربية" : "English"}</span>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-item-icon" />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="breadcrumb">
            <span className="breadcrumb-item">Home</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-item active">{getBreadcrumbTitle()}</span>
          </div>
          
          <div className="content">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="tab-content"
              >
                {activeTab === "dashboard" && (
                  <div className="dashboard-layout">
                    <div className="dashboard-header">
                      <h1>Welcome back, {student.displayName}</h1>
                      <p className="subtitle">Here's what's happening with your academic progress</p>
                    </div>
                    
                    <div className="dashboard-stats">
                      <div className="stat-card">
                        <div className="stat-icon attendance">
                          <FaChartBar />
                        </div>
                        <div className="stat-info">
                          <h3>Attendance Rate</h3>
                          <div className="stat-value">{attendanceSummary.percentage?.toFixed(1)}%</div>
                          <div className="stat-detail">
                            <span>{attendanceSummary.attended} of {attendanceSummary.total} lectures</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <div className="stat-icon courses">
                          <FaBook />
                        </div>
                        <div className="stat-info">
                          <h3>Active Courses</h3>
                          <div className="stat-value">{courses.length}</div>
                          <div className="stat-detail">
                            <span>{courses.filter(c => {
                              const logsForCourse = fingerprintLogs.filter(log => log.courseCode === c.courseCode);
                              const successLogs = logsForCourse.filter(log => log.result === "Success").length;
                              const totalSessions = logsForCourse.length || 1;
                              const attendancePercent = Math.round((successLogs / totalSessions) * 100);
                              return attendancePercent < 75;
                            }).length} need attention</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <div className="stat-icon gpa">
                          <FaUser />
                        </div>
                        <div className="stat-info">
                          <h3>Current GPA</h3>
                          <div className="stat-value">{student.gpa}</div>
                          <div className="stat-detail">
                            <span>{student.year} Year</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="stat-card">
                        <div className="stat-icon fingerprint">
                          <FaFingerprint />
                        </div>
                        <div className="stat-info">
                          <h3>Fingerprint Status</h3>
                          <div className="stat-value">{fingerprintTodayScanned ? "Scanned Today" : "Not Scanned"}</div>
                          <div className="stat-detail">
                            {!fingerprintTodayScanned && (
                              <button onClick={handleFingerprintScan} className="scan-btn">
                                Scan Now
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dashboard-row">
                      <div className="dashboard-col">
                        <div className="dashboard-card">
                          <div className="card-header">
                            <h3>Today's Schedule</h3>
                            <button className="view-all-btn" onClick={() => setActiveTab("schedule")}>View All</button>
                          </div>
                          
                          <div className="schedule-list">
                            {(() => {
                              const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
                              const todaySessions = timetable.filter(session => session.day === today);
                              
                              if (todaySessions.length === 0) {
                                return <p className="no-data">No classes scheduled for today. 🎉</p>;
                              }
                              
                              return todaySessions.map((session, index) => (
                                <div key={index} className="schedule-item">
                                  <div className="schedule-time">{session.time.split(' - ')[0]}</div>
                                  <div className="schedule-details">
                                    <h4>{session.course}</h4>
                                    <p>{session.location} • {session.instructor}</p>
                                  </div>
                                </div>
                              ));
                            })()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="dashboard-col">
                        <div className="dashboard-card">
                          <div className="card-header">
                            <h3>Recent Notifications</h3>
                            <button className="view-all-btn" onClick={() => setActiveTab("notifications")}>View All</button>
                          </div>
                          
                          <div className="notification-list-compact">
                            {notifications.slice(0, 3).map((note, index) => (
                              <div key={index} className={`notification-item-compact ${!note.isRead ? 'unread' : ''}`}>
                                <div className="notification-content">
                                  <p>{note.message}</p>
                                  <span className="notification-date">{note.date}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="profile-layout">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        {student.displayName?.charAt(0) || "S"}
                      </div>
                      <div className="profile-header-info">
                        <h1>{student.displayName}</h1>
                        <p>{student.department} • {student.year} Year</p>
                      </div>
                      <button className="edit-profile-btn">
                        <FaEdit /> Edit Profile
                      </button>
                    </div>
                    
                    <div className="profile-content">
                      <div className="profile-section">
                        <h3>Personal Information</h3>
                        <div className="profile-info-grid">
                          <div className="profile-info-item">
                            <label>Full Name</label>
                            <p>{student.displayName}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Email Address</label>
                            <p>{student.email}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Student ID</label>
                            <p>{student.id || "N/A"}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Phone Number</label>
                            <p>{student.phone || "Not provided"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="profile-section">
                        <h3>Academic Information</h3>
                        <div className="profile-info-grid">
                          <div className="profile-info-item">
                            <label>Department</label>
                            <p>{student.department}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Academic Year</label>
                            <p>{student.year}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>GPA</label>
                            <p>{student.gpa}</p>
                          </div>
                          <div className="profile-info-item">
                            <label>Advisor</label>
                            <p>{student.advisor || "Not assigned"}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="profile-section">
                        <h3>Fingerprint Status</h3>
                        <div className="fingerprint-status">
                          {student.fingerprintRegistered ? (
                            <div className="fingerprint-registered">
                              <FaFingerprint className="fingerprint-icon" />
                              <div>
                                <h4>Fingerprint Registered</h4>
                                <p>Your fingerprint is registered in the system.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="fingerprint-not-registered">
                              <FaFingerprint className="fingerprint-icon" />
                              <div>
                                <h4>Fingerprint Not Registered</h4>
                                <p>Please register your fingerprint for attendance tracking.</p>
                                <button onClick={handleFingerprintScan} className="register-btn">
                                  Register Now
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "fingerprintLog" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Fingerprint Log</h1>
                      <p className="subtitle">Track your attendance records</p>
                    </div>
                    
                    <div className="data-filters">
                      <div className="filter-group">
                        <select className="filter-select">
                          <option value="all">All Results</option>
                          <option value="success">Success</option>
                          <option value="failed">Failed</option>
                        </select>
                        
                        <select className="filter-select">
                          <option value="all">All Locations</option>
                          <option value="main">Main Campus</option>
                          <option value="lab">Lab Building</option>
                          <option value="library">Library</option>
                        </select>
                      </div>
                      
                      {!fingerprintTodayScanned && (
                        <button onClick={handleFingerprintScan} className="action-button">
                          <FaFingerprint /> Scan Fingerprint
                        </button>
                      )}
                    </div>
                    
                    <div className="data-table-container">
                      {filteredLogs.length === 0 ? (
                        <div className="no-data-message">
                          <p>No fingerprint logs found matching your search criteria.</p>
                        </div>
                      ) : (
                        <table className="data-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Time</th>
                              <th>Location</th>
                              <th>Course</th>
                              <th>Code</th>
                              <th>Result</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredLogs.map((log, index) => {
                              const matchedCourse =
                                timetable.find(
                                  (t) =>
                                    t.courseCode === log.courseCode &&
                                    t.day === new Date(log.date).toLocaleDateString("en-US", { weekday: "long" }),
                                ) || {}
                              return (
                                <tr key={index}>
                                  <td>{log.date}</td>
                                  <td>{log.time}</td>
                                  <td>{log.location}</td>
                                  <td>{matchedCourse.course || "N/A"}</td>
                                  <td>{log.courseCode || "N/A"}</td>
                                  <td>
                                    <span className={`status-badge ${log.result === "Success" ? "success" : "error"}`}>
                                      {log.result}
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "schedule" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Weekly Schedule</h1>
                      <p className="subtitle">View your class schedule for the week</p>
                    </div>
                    
                    <div className="schedule-calendar">
                      <div className="day-selector">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                          <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`day-btn ${activeDay === day ? "active" : ""}`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>

                      <div className="schedule-content">
                        {(() => {
                          const daySessions = timetable.filter((session) => session.day === activeDay)
                          daySessions.sort((a, b) => {
                            const parseTime = (time) => {
                              const [timeStr, modifier] = time.split(" ")
                              let [hours, minutes] = timeStr.split(":").map(Number)
                              if (modifier === "PM" && hours !== 12) hours += 12
                              if (modifier === "AM" && hours === 12) hours = 0
                              return hours * 60 + minutes
                            }
                            return parseTime(a.time.split(" - ")[0]) - parseTime(b.time.split(" - ")[0])
                          })
                          
                          if (daySessions.length === 0) {
                            return (
                              <div className="no-classes">
                                <div className="no-classes-icon">🎉</div>
                                <h3>No Classes Scheduled</h3>
                                <p>You have no classes scheduled for {activeDay}.</p>
                              </div>
                            )
                          }
                          
                          return (
                            <div className="timeline">
                              {daySessions.map((session, index) => (
                                <div key={index} className="timeline-item">
                                  <div className="timeline-time">
                                    <span>{session.time.split(' - ')[0]}</span>
                                    <span className="timeline-duration">{session.time.split(' - ')[1]}</span>
                                  </div>
                                  <div className="timeline-content">
                                    <div className="timeline-card">
                                      <h3>{session.course}</h3>
                                      <div className="timeline-details">
                                        <span><strong>Code:</strong> {session.courseCode}</span>
                                        <span><strong>Instructor:</strong> {session.instructor || 'TBD'}</span>
                                        <span><strong>Location:</strong> {session.location || 'Main Campus'}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Notifications</h1>
                      <p className="subtitle">Stay updated with important announcements</p>
                    </div>
                    
                    <div className="notifications-container">
                      <div className="notifications-header">
                        <div className="notifications-count">
                          {notifications.filter(n => !n.isRead).length} unread notifications
                        </div>
                        <button className="mark-all-read">Mark all as read</button>
                      </div>
                      
                      {notifications.length === 0 ? (
                        <div className="no-data-message">
                          <p>No notifications at the moment.</p>
                        </div>
                      ) : (
                        <div className="notifications-list">
                          {notifications.map((note, index) => (
                            <div key={index} className={`notification-card ${!note.isRead ? 'unread' : ''}`}>
                              <div className="notification-indicator"></div>
                              <div className="notification-content">
                                <p className="notification-message">{note.message}</p>
                                <span className="notification-date">{note.date}</span>
                              </div>
                              <div className="notification-actions">
                                <button className="notification-action mark-read">
                                  {note.isRead ? 'Mark as unread' : 'Mark as read'}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "courseAttendance" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Course Attendance</h1>
                      <p className="subtitle">Monitor your attendance for each course</p>
                    </div>
                    
                    <div className="data-filters">
                      <div className="filter-group">
                        <select className="filter-select">
                          <option value="all">All Courses</option>
                          <option value="low">Low Attendance</option>
                          <option value="good">Good Attendance</option>
                        </select>
                      </div>
                      
                      <button className="action-button">
                        <FaChartBar /> Generate Report
                      </button>
                    </div>
                    
                    <div className="data-table-container">
                      {filteredCourses.length === 0 ? (
                        <div className="no-data-message">
                          <p>No courses found matching your search criteria.</p>
                        </div>
                      ) : (
                        <div className="course-cards">
                          {filteredCourses.map((course, index) => {
                            const logsForCourse = fingerprintLogs.filter(log => log.courseCode === course.courseCode);
                            const successLogs = logsForCourse.filter(log => log.result === "Success").length;
                            const totalSessions = logsForCourse.length || 1; // avoid /0
                            const attendancePercent = Math.round((successLogs / totalSessions) * 100);
                            const status = attendancePercent >= 75 ? "good" : "low";

                            return (
                              <div key={index} className={`course-card ${status}`}>
                                <div className="course-header">
                                  <h3>{course.name}</h3>
                                  <span className={`course-status ${status}`}>
                                    {status === "good" ? "Good Standing" : "Low Attendance"}
                                  </span>
                                </div>
                                
                                <div className="course-details">
                                  <div className="course-info">
                                    <div className="course-info-item">
                                      <label>Course Code</label>
                                      <p>{course.courseCode}</p>
                                    </div>
                                    <div className="course-info-item">
                                      <label>Instructor</label>
                                      <p>{course.instructor || "TBD"}</p>
                                    </div>
                                    <div className="course-info-item">
                                      <label>Credit Hours</label>
                                      <p>{course.credit}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="attendance-chart">
                                    <div className="attendance-percent">
                                      <svg viewBox="0 0 36 36" className="circular-chart">
                                        <path className="circle-bg"
                                          d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path className="circle"
                                          strokeDasharray={`${attendancePercent}, 100`}
                                          d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <text x="18" y="20.35" className="percentage">{attendancePercent}%</text>
                                      </svg>
                                    </div>
                                    <div className="attendance-details">
                                      <p><strong>{successLogs}</strong> of <strong>{totalSessions}</strong> sessions attended</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="section-layout">
                    <div className="section-header">
                      <h1>Settings</h1>
                      <p className="subtitle">Manage your account preferences</p>
                    </div>
                    
                    <div className="settings-container">
                      <div className="settings-section">
                        <h3>Account Settings</h3>
                        
                        <div className="settings-group">
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Profile Information</h4>
                              <p>Update your personal information</p>
                            </div>
                            <button className="settings-btn">Edit</button>
                          </div>
                          
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Change Password</h4>
                              <p>Update your password regularly for security</p>
                            </div>
                            <button className="settings-btn">Change</button>
                          </div>
                          
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Two-Factor Authentication</h4>
                              <p>Add an extra layer of security to your account</p>
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="twoFactor" />
                              <label htmlFor="twoFactor"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="settings-section">
                        <h3>Appearance</h3>
                        
                        <div className="settings-group">
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Dark Mode</h4>
                              <p>Switch between light and dark themes</p>
                            </div>
                            <div className="toggle-switch">
                              <input 
                                type="checkbox" 
                                id="darkMode" 
                                checked={darkMode} 
                                onChange={toggleDarkMode} 
                              />
                              <label htmlFor="darkMode"></label>
                            </div>
                          </div>
                          
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Language</h4>
                              <p>Choose your preferred language</p>
                            </div>
                            <select className="settings-select" value={language} onChange={toggleLanguage}>
                              <option value="english">English</option>
                              <option value="arabic">العربية</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      
                      <div className="settings-section">
                        <h3>Notifications</h3>
                        
                        <div className="settings-group">
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Email Notifications</h4>
                              <p>Receive notifications via email</p>
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="emailNotif" defaultChecked />
                              <label htmlFor="emailNotif"></label>
                            </div>
                          </div>
                          
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>SMS Notifications</h4>
                              <p>Receive notifications via SMS</p>
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="smsNotif" />
                              <label htmlFor="smsNotif"></label>
                            </div>
                          </div>
                          
                          <div className="settings-item">
                            <div className="settings-item-info">
                              <h4>Browser Notifications</h4>
                              <p>Receive notifications in your browser</p>
                            </div>
                            <div className="toggle-switch">
                              <input type="checkbox" id="browserNotif" defaultChecked />
                              <label htmlFor="browserNotif"></label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
