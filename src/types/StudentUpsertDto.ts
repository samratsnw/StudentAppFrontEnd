export interface StudentUpsert {
  studentID?: number;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  isActive: boolean;
  departmentId: number;
}
