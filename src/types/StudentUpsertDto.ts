export interface StudentUpsert {
  studentID?: number;
  name: string;
  dob: string;
  gender: string;
  isActive: boolean;
  departmentId: number;
}
