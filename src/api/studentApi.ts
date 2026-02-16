import axios from "axios"
import type { StudentRead } from "../types/StudentRead"
import type { StudentUpsert } from "../types/StudentUpsertDto"

const BASE = "https://localhost:7234/api/Student"

export const getStudents = () =>
  axios.get<StudentRead[]>(`${BASE}/get`)

export const getStudentById = (id: number) =>
  axios.get<StudentRead>(`${BASE}/${id}`)

export const upsertStudent = (data: StudentUpsert) =>
  axios.post(`${BASE}/upsert`, data)

export const deleteStudent = (id: number) =>
  axios.delete(`${BASE}/${id}`)   // ✅ EXACT SWAGGER MATCH

export const getInactiveStudents = () =>
  axios.get(`${BASE}/inactive`)

export const restoreStudent = (id: number) =>
  axios.put(`${BASE}/restore/${id}`)