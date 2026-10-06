export interface Invoice {
	invoice: Data;
	link: string;
}

export interface Data {
	id: number;
	requestedAt: string;
	disbursedAt: string;
	paymentMethod: string;
	refNo: string;
	attachment: any;
	amount: number;
	createdAt: string;
	updatedAt: string;
	doctor: Doctor;
	appointmentDetails: AppointmentDetail[];
}

export interface Doctor {
	id: number;
	name: string;
	email: string;
	mobile: string;
	degrees: string;
	experience: number;
	bmdcCode: string;
	bmdcExpiryDate: string;
	workingHours: WorkingHours;
	workDays: string[];
	fee: number;
	biography: string;
	profilePic: string;
	commission: number;
	rating: any;
	patientChecked: number;
	createdAt: string;
	updatedAt: string;
	deletedAt: any;
	isActive: boolean;
	bankDetails: BankDetails;
}

export interface WorkingHours {
	end: string;
	start: string;
}

export interface BankDetails {
	id: number;
	accountType: string;
	mfsType: string;
	accountNo: string;
	bankName: string;
	branchName: string;
	accountName: string;
}

export interface Appointment {
	id: number;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface AppointmentDetail {
	id: number;
	fee: number;
	discount: any;
	payable: number;
	amount: string;
	shukheeCommission: string;
	doctorPayable: string;
	shukheeCommissionAmount: string;
	vatPercentage: number;
	vatOnAcutalReceive: string;
	vatOnCommision: string;
	netRevenue: string;
	calltime: any;
	gatewayRate: number;
	gatewayCharge: string;
	status: string;
	createdAt: string;
	updatedAt: string;
	appointment?: Appointment;
}

export enum DoctorPaymentType {
	BANK = "Bank",
	MFS = "MFS",
	CARD = "Card",
	CASH = "Cash",
}
