// DefineDoctorTab.jsx
import React, { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"
import "../dashboard.css"


const DefineDoctorTab = () => {
  const [doctors, setDoctors] = useState([])
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    facultyId: "",
  })
  const [editingIndex, setEditingIndex] = useState(null)

  useEffect(() => {
    // Load from localStorage to mock backend persistence
    const storedDoctors = JSON.parse(localStorage.getItem("doctors")) || []
    setDoctors(storedDoctors)
  }, [])

  useEffect(() => {
    localStorage.setItem("doctors", JSON.stringify(doctors))
  }, [doctors])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    if (!form.name || !form.email) return alert("Name and Email are required")
    setDoctors([...doctors, form])
    setForm({ name: "", email: "", phone: "", department: "", facultyId: "" })
  }

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      const newDoctors = [...doctors]
      newDoctors.splice(index, 1)
      setDoctors(newDoctors)
    }
  }

  const handleEdit = (index) => {
    setForm(doctors[index])
    setEditingIndex(index)
  }

  const handleSave = () => {
    const updated = [...doctors]
    updated[editingIndex] = form
    setDoctors(updated)
    setEditingIndex(null)
    setForm({ name: "", email: "", phone: "", department: "", facultyId: "" })
  }

  return (
    <div className="section-layout">
      <div className="section-header">
        <h1>Define Doctor</h1>
        <p className="subtitle">Add, edit, and manage doctors for assignment</p>
      </div>

      <div className="form-grid">
        <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <input name="facultyId" placeholder="Faculty ID" value={form.facultyId} onChange={handleChange} />

        {editingIndex !== null ? (
          <button className="action-button" onClick={handleSave}>
            <FaSave /> Save
          </button>
        ) : (
          <button className="action-button" onClick={handleAdd}>
            <FaPlus /> Add Doctor
          </button>
        )}
      </div>

      <div className="data-table-container">
        {doctors.length === 0 ? (
          <p className="no-data-message">No doctors added yet.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Faculty ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doc, index) => (
                <tr key={index}>
                  <td>{doc.name}</td>
                  <td>{doc.email}</td>
                  <td>{doc.phone}</td>
                  <td>{doc.department}</td>
                  <td>{doc.facultyId}</td>
                  <td>
                    <button className="table-action-btn" onClick={() => handleEdit(index)}>
                      <FaEdit />
                    </button>
                    <button className="table-action-btn" onClick={() => handleDelete(index)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default DefineDoctorTab