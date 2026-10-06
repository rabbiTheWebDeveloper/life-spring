import { TableSelector } from "./Types";

export const TableOptions = {
	isPatient: (option: string) => option === TableSelector.PATIENTS,
	isDoctor: (option: string) => option ===  TableSelector.DOCTORS,
	isAppointment: (option: string) => option ===  TableSelector.APPOINTMENTS,
};
