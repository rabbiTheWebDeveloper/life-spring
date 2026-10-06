export interface Appointments {
	pagination: Pagination;
	appointments: Appointment[];
}

export interface Pagination {
	totalItems: number;
	page: number;
	size: number;
	hasNext?: boolean;
}

export interface Appointment {
	id: number;
	createdAt: string;
	createdByType: string;
	createdById: number;
	updatedAt: string;
	deletedAt: string;
	deletedBy: string;
	attatchments: any[];
	scheduleStart: string;
	scheduleEnd: string;
	patientDetails: PatientDetails;
	channel: string;
	paymentStatus: string;
	status: string;
	fee: number;
	discount: number;
	prescriptionLink: string;
	doctor: Doctor;
	patient: Patient;
	refund: Refund
	appointmentType:any
}

export interface PatientDetails {
	age: string;
	gender: string;
	fullName: string;
	problems: string;
	mobile: string;
	weight: string;
}

export interface Doctor {
	id: number;
	name: string;
	email: string;
	mobile: string;
	degrees: string;
	bmdcCode: string;
	bmdcExpiryDate: string;
	experience: number;
	workingHours: WorkingHours;
	fee: number;
	profilePic: string;
	biography:string;
	commission: number;
	patientChecked: number;
	isActive: boolean;
	workDays: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Refund{
	id: number;
	status: string;
	appointmentId: number;
	remark: string;
	createdById: number;
	createdAt: string;
	deletedAt: any;
	sslCommerzResponse: any
}

export interface WorkingHours {
	end: string;
	start: string;
}

export interface Patient {
	id: number;
	name: string;
	mobile: string;
	gender: string;
	profilePic?: string;
	dob: string;
	height: string;
	weight: string;
	isActive: boolean;
	diseases: string;
	email: string;
	createdAt: string;
	updatedAt: string;
}


export enum AppointmentStatus {
	SCHEDULED = "Scheduled",
	CONFIRMED = "Confirmed",
	COMPLETED = "Completed",
	CANCELLED = "Cancelled",
	PENDING = "Pending"
}

export enum PaymentStatus{
	PAID = "Paid",
	PARTIALLY_PAID = "PartiallyPaid",
	UNPAID = "Unpaid",
	FULL_DISCOUNT = "FullDiscount",
	DISCOUNT = "Discount",
	REFUNDED = "Refunded",
	REFUND_PENDING = "RefundPending",
	REFUND_PROCESSING = "RefundProcessing",
	INITIATED = "Initiated",
	PENDING = "Pending",
	FAILED = "Failed",
	CANCELLED = "Cancelled"
}

export enum CancelReason {
  MISTAKENLY_DONE = "Mistakenly Done",
  WANTED_TO_BOOK_ANOTHER_DOCTOR = "Wanted to book another doctor",
  WILL_NOT_BE_AVAILABLE_AT_THAT_TIME = "Will not be available at that time",
}
