import { DefaultFormActionResult } from "@/app/components/types/Form"

export interface Invoices {
  pagination: Pagination
  invoices: Invoice[]
}

export interface Pagination {
  totalItems: number
  page: number
  size: number
  hasNext: boolean
}

export interface Invoice {
  id: number
  requestedAt: string
  disbursedAt: any
  paymentMethod: any
  refNo: any
  amount: number
  createdAt: string
  updatedAt: string
  doctor: Doctor
}

export interface Doctor {
  id: number
  name: string
  email: string
  mobile: string
  degrees: string
  experience: number
  bmdcCode: string
  bmdcExpiryDate: string
  workingHours: WorkingHours
  workDays: string[]
  fee: number
  biography: string
  profilePic: string
  commission: number
  rating: any
  patientChecked: number
  createdAt: string
  updatedAt: string
  deletedAt: any
  bankDetails: BankDetails
}

export interface WorkingHours {
  end: string
  start: string
}

export interface BankDetails {
  id: number
  accountType: string
  mfsType: string
  accountNo: string
  bankName: string
  branchName: string
  accountName: string
}


export interface FormValues {
	invoiceId: number;
	refNo: string;
	paymentMethod: string;
	attachment: File | null;
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};

export type CreateDisbursementActionFn = (
	_: DefaultFormActionResult,
	formData: FormData
) => Promise<DefaultFormActionResult>;
