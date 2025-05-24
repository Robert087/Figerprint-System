// StudentManagement.js
import React, { useState } from 'react'

function StudentManagement() {
  const [students, setStudents] = useState([
    { name: "David Rezaik", email: "student@example.com", year: "4" },
    { name: "Amin Youssef", email: "amin@uni.edu", year: "3" }
  ])
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [studentYear, setStudentYear] = useState("")

  const addStudent = () => {
    if (studentName && studentEmail && studentYear) {
      setStudents([
        ...students,
        {
          name: studentName,
          email: studentEmail,
          year: studentYear
        }
      ])
      setStudentName("")
      setStudentEmail("")
      setStudentYear("")
    }
  }

  return (
    <div className="dashboard-card">
      <div className="card-header">
        <h3>Student Management</h3>
      </div>

      <div
        className="form-row"
        style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" }}
      >
        <input
          className="course-input"
          placeholder="Student Name"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
        />
        <input
          className="course-input"
          placeholder="Student Email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
        />
        <select
          className="course-input"
          value={studentYear}
          onChange={(e) => setStudentYear(e.target.value)}
        >
          <option value="">Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>
        <button
          className="action-button"
          onClick={addStudent}
          disabled={!studentName || !studentEmail || !studentYear}
        >
          Add Student
        </button>
      </div>

      <div className="data-table-container">
        <table
          className="data-table"
          style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}
        >
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ccc" }}>
                Name
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ccc" }}>
                Email
              </th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #ccc" }}>
                Year
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={index}>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.name}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.email}</td>
                <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>{s.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default StudentManagement
