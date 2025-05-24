// CourseManagement.js
import React, { useState, useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import "../dashboard.css"

function CourseManagement() {
  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({
    name: "",
    code: "",
    creditHours: "",
    semester: "",
    year: "",
    doctorEmail: ""
  })
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    const savedDoctors = JSON.parse(localStorage.getItem("doctors")) || []
    setDoctors(savedDoctors)

    const savedCourses = JSON.parse(localStorage.getItem("courses")) || []
    setCourses(savedCourses)
  }, [])

  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses))
  }, [courses])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    if (!form.name || !form.code) return alert("Course name and code are required")
    setCourses([...courses, form])
    setForm({ name: "", code: "", creditHours: "", semester: "", year: "", doctorEmail: "" })
  }

  return (
    <div className="section-layout">
      <div className="section-header">
        <h1>Manage Courses</h1>
        <p className="subtitle">Add and assign courses to doctors</p>
      </div>

      <div className="form-grid">
        <input name="name" placeholder="Course Name" value={form.name} onChange={handleChange} />
        <input name="code" placeholder="Course Code" value={form.code} onChange={handleChange} />
        <input name="creditHours" placeholder="Credit Hours" value={form.creditHours} onChange={handleChange} />

        <select name="year" value={form.year} onChange={handleChange}>
          <option value="" disabled hidden>Select Year</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <select name="semester" value={form.semester} onChange={handleChange}>
          <option value="" disabled hidden>Select Semester</option>
          <option value="Semester 1">Semester 1</option>
          <option value="Semester 2">Semester 2</option>
        </select>

        <select name="doctorEmail" value={form.doctorEmail} onChange={handleChange}>
          <option value="" disabled hidden>Assign Doctor</option>
          {doctors.map((doc, index) => (
            <option key={index} value={doc.email}>
              {doc.name} - {doc.department}
            </option>
          ))}
        </select>

        <button className="action-button" onClick={handleAdd}>
          <FaPlus /> Add Course
        </button>
      </div>

      <div className="data-table-container">
        {courses.length === 0 ? (
          <p className="no-data-message">No courses added yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Credit Hours</th>
                <th>Year</th>
                <th>Semester</th>
                <th>Assigned Doctor</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.name}</td>
                  <td>{course.code}</td>
                  <td>{course.creditHours}</td>
                  <td>{course.year}</td>
                  <td>{course.semester}</td>
                  <td>{doctors.find(d => d.email === course.doctorEmail)?.name || "Not Assigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default CourseManagement