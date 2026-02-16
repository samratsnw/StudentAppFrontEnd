import { Route, Routes } from "react-router-dom"
import StudentList from "./pages/StudentList"

function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentList />} />
    </Routes>
  )
}

export default App
