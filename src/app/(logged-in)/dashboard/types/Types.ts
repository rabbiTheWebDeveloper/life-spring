export interface DashboadStats {
	totalAppointments: number;
	totalCompletedAppointments: number;
	doctorCount: number;
	patientCount: number;
	totalAppointment: number;
  totalCancelled: number;
  totalRescheduled: number

}


export interface ChartData {
  months: string[]
  appointments: number[]
  patients: number[]
  doctors: number[]
}



export enum TableSelector {
	PATIENTS = "Patients",
	DOCTORS = "Doctors",
	APPOINTMENTS = "Appointments",
}
