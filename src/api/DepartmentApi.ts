import axios from "axios"
import type { Department } from "../types/Department"

const BASE_URL = "https://localhost:7234/api/Department"

export const getDepartments = () =>
  axios.get<Department[]>(BASE_URL)
