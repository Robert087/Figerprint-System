"use client"

import { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import * as Components from "./Components"
import StudentDashboard from "./StudentDashboard"
import DoctorDashboard from "./DoctorDashboard"
import AdminDashboard from "./components/AdminDashboard" // ✅ Add this import
import { FaUserGraduate, FaChalkboardTeacher, FaLock } from "react-icons/fa"
import "./styles.css"

function App() {
  const [signIn, toggle] = useState(true)

  // ✅ Add admin credentials
  const doctorCredentials = { email: "doctor@example.com", password: "doctor123" }
  const studentCredentials = { email: "student@example.com", password: "student123" }
  const adminCredentials = { email: "admin@example.com", password: "admin123" }

  const theme = {
    background: "#f6f5f7",
    text: "#333",
    container: "#fff",
    form: "#ffffff",
    title: "#1b2a49",
    inputBackground: "#f8f9fa",
    inputFocusBackground: "#fff",
    inputFocusBorder: "#3498db",
    button: "#1b2a49",
    buttonHover: "#2c3e50",
    buttonActive: "#0f1a29",
    buttonText: "#fff",
    link: "#3498db",
    linkHover: "#2980b9",
    ghostButton: "#fff",
    ghostButtonHover: "rgba(255, 255, 255, 0.2)",
    error: "#e74c3c",
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <LoginForm
                signIn={signIn}
                toggle={toggle}
                doctorCredentials={doctorCredentials}
                studentCredentials={studentCredentials}
                adminCredentials={adminCredentials} // ✅ Pass admin credentials
              />
            }
          />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* ✅ NEW Route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

// LoginForm with Admin logic
function LoginForm({ signIn, toggle, doctorCredentials, studentCredentials, adminCredentials }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      let isValid = false
      let role = ""

      if (email === adminCredentials.email && password === adminCredentials.password) {
        isValid = true
        role = "admin"
      } else if (signIn && email === studentCredentials.email && password === studentCredentials.password) {
        isValid = true
        role = "student"
      } else if (!signIn && email === doctorCredentials.email && password === doctorCredentials.password) {
        isValid = true
        role = "doctor"
      }

      if (isValid) {
        switch (role) {
          case "admin":
            navigate("/admin-dashboard")
            break
          case "doctor":
            navigate("/doctor-dashboard")
            break
          case "student":
          default:
            navigate("/dashboard")
            break
        }
      } else {
        setError("Invalid credentials. Please try again.")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="login-page">
      <Components.GlobalStyle />
      <div className="university-logo">
        <h1>Akhbar El-Youm Academy</h1>
      </div>

      <Components.Container>
        {/* Doctor Login Form */}
        <Components.SignUpContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Doctor Login</Components.Title>
            <div className="form-icon">
              <FaChalkboardTeacher size={40} color="#1b2a49" />
            </div>
            <Components.InputGroup>
              <Components.InputIcon><FaChalkboardTeacher /></Components.InputIcon>
              <Components.Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Components.InputGroup>
            <Components.InputGroup>
              <Components.InputIcon><FaLock /></Components.InputIcon>
              <Components.Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Components.InputGroup>
            {error && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
            <Components.ForgotPassword>Forgot your password?</Components.ForgotPassword>
            <Components.Button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* Student Login Form */}
        <Components.SignInContainer signinIn={signIn}>
          <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Student Login</Components.Title>
            <div className="form-icon">
              <FaUserGraduate size={40} color="#1b2a49" />
            </div>
            <Components.InputGroup>
              <Components.InputIcon><FaUserGraduate /></Components.InputIcon>
              <Components.Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Components.InputGroup>
            <Components.InputGroup>
              <Components.InputIcon><FaLock /></Components.InputIcon>
              <Components.Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Components.InputGroup>
            {error && <Components.ErrorMessage>{error}</Components.ErrorMessage>}
            <Components.ForgotPassword>Forgot your password?</Components.ForgotPassword>
            <Components.Button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        {/* Overlay Panel */}
        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title inOverlay>Welcome Doctor!</Components.Title>
              <Components.Paragraph>For Students, Sign In below</Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(true)}>Student Login</Components.GhostButton>
            </Components.LeftOverlayPanel>

            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title inOverlay>Welcome Students!</Components.Title>
              <Components.Paragraph>For Instructors, Sign In below</Components.Paragraph>
              <Components.GhostButton onClick={() => toggle(false)}>Instructor Login</Components.GhostButton>
            </Components.RightOverlayPanel>
          </Components.Overlay>
        </Components.OverlayContainer>
      </Components.Container>

      <div className="login-footer">
        <p>© {new Date().getFullYear()} Akhbar El-Youm Academy. All rights reserved.</p>
      </div>
    </div>
  )
}

export default App
