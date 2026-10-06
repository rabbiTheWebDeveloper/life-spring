export interface Patients {
	totalItems: number;
	data: Patient[];
	page: number;
	size: number;
}

export interface Patient {
	id: number;
	name: string;
	mobile: string;
	gender?: string;
	profilePic?: string;
	dob?: string;
	age?: string;
	height?: number;
	weight?: number;
	diseases?: string;
	email: string;
	isActive: boolean;
	createdAt: string;
	updatedAt?: string;
	deletedAt?: string;
	appointmentType?: string;
	createdByType?: string;
}

export function buildPatientId(patient: Patient) {
	return 120240627 + patient.id;
}
