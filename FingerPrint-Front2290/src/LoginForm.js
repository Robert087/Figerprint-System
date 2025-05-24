// src/components/LoginForm.js
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import * as Components from "./Components"
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaLock,
  FaUserShield
} from "react-icons/fa"

const users = [
  { email: "doctor@example.com", password: "doctor123", role: "Doctor" },
  {
    email: "student@example.com",
    password: "student123",
    role: "Student",
    name: "David Rezaik",
    department: "Computer Science",
    year: "4rd Year"
  },
  {
    email: "admin@example.com",
    password: "admin123",
    role: "Admin"
  }
]

function LoginForm() {
  const navigate = useNavigate()
  const [signIn, setSignIn] = useState("student") // student | doctor | admin
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password)
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))

        if (user.role === "Doctor") {
          navigate("/doctor-dashboard")
        } else if (user.role === "Student") {
          navigate("/student-dashboard")
        } else if (user.role === "Admin") {
          navigate("/admin-dashboard")
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
        {/* Doctor Login */}
        <Components.SignUpContainer signinIn={signIn === "doctor"}>
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
            <Components.Button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* Student Login */}
        <Components.SignInContainer signinIn={signIn === "student"}>
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
            <Components.Button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Components.Button>
          </Components.Form>
        </Components.SignInContainer>

        {/* Admin Login */}
        <Components.SignUpContainer signinIn={signIn === "admin"}>
          <Components.Form onSubmit={handleSubmit}>
            <Components.Title>Admin Login</Components.Title>
            <div className="form-icon">
              <FaUserShield size={40} color="#1b2a49" />
            </div>
            <Components.InputGroup>
              <Components.InputIcon><FaUserShield /></Components.InputIcon>
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
            <Components.Button disabled={loading}>{loading ? "Signing In..." : "Sign In"}</Components.Button>
          </Components.Form>
        </Components.SignUpContainer>

        {/* Overlay logic to switch between roles */}
        <Components.OverlayContainer signinIn={signIn}>
          <Components.Overlay signinIn={signIn}>
            <Components.LeftOverlayPanel signinIn={signIn}>
              <Components.Title inOverlay>Welcome to Akhbar El-Youm</Components.Title>
              <Components.Paragraph>Switch to another role</Components.Paragraph>
              <Components.GhostButton onClick={() => setSignIn("student")}>Student</Components.GhostButton>
              <Components.GhostButton onClick={() => setSignIn("doctor")}>Doctor</Components.GhostButton>
              <Components.GhostButton onClick={() => setSignIn("admin")}>Admin</Components.GhostButton>
            </Components.LeftOverlayPanel>
            <Components.RightOverlayPanel signinIn={signIn}>
              <Components.Title inOverlay>Welcome to Akhbar El-Youm</Components.Title>
              <Components.Paragraph>Sign in with your credentials</Components.Paragraph>
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

export default LoginForm
