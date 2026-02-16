import { useEffect, useState } from "react"
import { getDepartments } from "../api/DepartmentApi"
import { getStudentById, upsertStudent } from "../api/studentApi"
import "../styles/studentForm.css"
import type { Department } from "../types/Department"
import type { StudentUpsert } from "../types/StudentUpsertDto"

type Props = {
  id?: number
  onClose: () => void
  onSaved: () => void
}

export default function StudentForm({ id, onClose, onSaved }: Props) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState<StudentUpsert>({
    name: "",
    dob: "",
    gender: "",
    isActive: true,
    departmentId: 0,
  })

  // Load departments
  useEffect(() => {
    let mounted = true
    getDepartments().then(r => mounted && setDepartments(r.data))
    return () => {
      mounted = false
    }
  }, [])

  // Load student for edit
  useEffect(() => {
    if (!id) return
    let mounted = true

    getStudentById(id).then(r => {
      if (!mounted) return
      const s = r.data
      setForm({
        studentID: s.studentID,
        name: s.name,
        dob: s.dob.substring(0, 10),
        gender: s.gender,
        isActive: s.isActive,
        departmentId: s.departmentId,
      })
    })

    return () => {
      mounted = false
    }
  }, [id])

  // Unified change handler + clear field error
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    let newValue: string | number | boolean = value

    if (e.target instanceof HTMLInputElement && e.target.type === "checkbox") {
      newValue = e.target.checked
    } else if (name === "departmentId") {
      newValue = Number(value)
    }

    setForm(prev => ({ ...prev, [name]: newValue }))

    // clear error on change
    setErrors(prev => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) newErrors.name = "Name is required"
    if (!form.dob) newErrors.dob = "Date of birth is required"
    if (!form.gender) newErrors.gender = "Gender is required"
    if (form.departmentId === 0)
      newErrors.departmentId = "Department is required"

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    try {
      await upsertStudent(form)
      onSaved()
      onClose()
    } catch (err) {
      console.error(err)
      alert("Save failed")
    }
  }

  return (
    <div className="student-modal-overlay">
      <div className="student-modal-box">
        <div className="student-modal-header">
          <h3>{id ? "Edit Student" : "Add Student"}</h3>
          <button type="button" className="student-close-btn" onClick={onClose}>
            X
          </button>
        </div>

        {/* IMPORTANT: noValidate disables browser tooltip */}
        <form className="student-form" onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <label>
            Name <span className="req">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <div className="field-error">{errors.name}</div>}

          {/* DOB */}
          <label>
            Date of Birth <span className="req">*</span>
          </label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />
          {errors.dob && <div className="field-error">{errors.dob}</div>}

          {/* Gender */}
          <label>
            Gender <span className="req">*</span>
          </label>
          <div className="radio-group">
            <label className="radio-item">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={handleChange}
              />
              <span>Male</span>
            </label>

            <label className="radio-item">
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={handleChange}
              />
              <span>Female</span>
            </label>
          </div>
          {errors.gender && <div className="field-error">{errors.gender}</div>}

          {/* Active */}
          <label className="check-item">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            <span>Active</span>
          </label>

          {/* Department */}
          <label>
            Department <span className="req">*</span>
          </label>
          <select
            name="departmentId"
            value={form.departmentId}
            onChange={handleChange}
          >
            <option value={0}>Select Department</option>
            {departments.map(d => (
              <option key={d.departmentId} value={d.departmentId}>
                {d.departmentName}
              </option>
            ))}
          </select>
          {errors.departmentId && (
            <div className="field-error">{errors.departmentId}</div>
          )}

          <button className="student-save-btn" type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}