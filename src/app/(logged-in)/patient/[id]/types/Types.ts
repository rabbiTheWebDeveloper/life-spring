export interface PatientAppointment {
  id: number
  name: string
  mobile: string
  gender: string
  profilePic?: string
  dob: string
  height: number
  weight: number
  diseases: string
  email: string
  isActive: boolean
  createdAt: string
  appointment: number
  complete: number
}
