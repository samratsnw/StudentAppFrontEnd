import type { StudentRead } from "../types/StudentRead"

type Props = {
  students: StudentRead[]
  onDelete: (id: number) => void
  onEdit: (id: number) => void
}

export default function StudentTable({ students, onDelete, onEdit }: Props) {
  return (
    <table border={1} cellPadding={8} cellSpacing={0}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>DOB</th>
          <th>Gender</th>
          <th>Department</th>
          <th>Active</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {students.map(s => (
          <tr key={s.studentID}>
            <td>{s.studentID}</td>
            <td>{s.name}</td>
            <td>{new Date(s.dob).toLocaleDateString()}</td>
            <td>{s.gender}</td>
            <td>{s.departmentName}</td>
            <td>{s.isActive ? "Yes" : "No"}</td>
            <td>
              <button onClick={() => onEdit(s.studentID)}>
                Edit
              </button>

              <button onClick={() => onDelete(s.studentID)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
