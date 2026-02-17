import { useEffect, useState } from "react"
import {
  deleteStudent,
  getInactiveStudents,
  getStudents
} from "../api/studentApi"
import "../styles/students.css"
import type { StudentRead } from "../types/StudentRead"
import StudentForm from "./StudentForm"

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return `${String(d.getDate()).padStart(2, "0")}-${String(
    d.getMonth() + 1
  ).padStart(2, "0")}-${d.getFullYear()}`
}

export default function StudentList() {
  const [students, setStudents] = useState<StudentRead[]>([])
  const [allStudents, setAllStudents] = useState<StudentRead[]>([])
  const [search, setSearch] = useState("")
  const [showInactive, setShowInactive] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | undefined>()

  const load = async () => {
    const res = showInactive
      ? await getInactiveStudents()
      : await getStudents()

    setStudents(res.data)
    setAllStudents(res.data)
  }

  useEffect(() => {
    load()
  }, [showInactive])   // important dependency

  const handleDelete = async (id: number) => {
    if (!confirm("Deactivate this student?")) return

    try {
      await deleteStudent(id)
      await load()
      alert("Deleted successfully")
    } catch (e: any) {
      console.error("Delete error:", e.response?.data || e.message)
      alert("Delete failed — see console")
    }
  }

  const handleCreate = () => {
    setEditId(undefined)
    setShowForm(true)
  }

  const handleEdit = (s: StudentRead) => {
    setEditId(s.studentID)
    setShowForm(true)
  }

  const handleSearch = () => {
  const searchValue = search.toLowerCase().trim()

  const filtered = allStudents.filter(s =>
    s.firstName.toLowerCase().includes(searchValue) ||
    s.lastName.toLowerCase().includes(searchValue)
  )

  setStudents(filtered)
}

   const handleReset = () => {
    setStudents(allStudents)
    setSearch("")
  }

  return (
    <div>
      <h2>Students</h2>

      <div className="top-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="search by name"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleReset}>Reset</button>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => setShowInactive(!showInactive)}
          >
            {showInactive ? "Show Active" : "Show Inactive"}
          </button>

          <button
            className="top-create-btn"
            onClick={handleCreate}
          >
            + New Student
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Birth Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map(s => (
            <tr key={s.studentID}>
              <td>{s.studentID}</td>
              <td>{s.firstName}</td>
              <td>{s.lastName}</td>
              <td>{s.departmentName}</td>
              <td>{s.gender}</td>
              <td>{s.dob ? formatDate(s.dob) : ""}</td>
              <td>{s.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button onClick={() => handleEdit(s)}>Edit</button>
                <button onClick={() => handleDelete(s.studentID)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <StudentForm
          id={editId}
          onClose={() => setShowForm(false)}
          onSaved={load}
        />
      )}
    </div>
  )
}