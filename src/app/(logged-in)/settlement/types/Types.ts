import { DefaultFormActionResult } from "@/app/components/types/Form"

export interface Settlements {
  pagination: Pagination
  appointments: SettlementAppt[]
}

export interface Pagination {
  totalItems: number
  page: number
  size: number
  hasNext: boolean
}

export interface SettlementAppt {
  id: number
  fee: number
  discount: any
  payable: number
  amount: string
  shukheeCommission: string
  doctorPayable: string
  shukheeCommissionAmount: string
  vatPercentage: number
  vatOnAcutalReceive: string
  vatOnCommision: string
  netRevenue: string
  calltime: any
  gatewayRate: number
  gatewayCharge: string
  status: string
  createdAt: string
  updatedAt: string
  appointment: Appt
	payment: Payment
}

export interface Appt {
  callCount: number
  id: number
  createdAt: string
  createdByType: string
  createdById: number
  updatedAt: string
  deletedAt: any
  deletedBy: any
  attachments: any[]
  scheduleStart: string
  scheduleEnd: string
  patientDetails: PatientDetails
  channel: string
  paymentStatus: string
  status: string
  rating: any
  prescriptionLink: any
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
  bmdcExpiryDate: any
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
}

export interface WorkingHours {
  end: string
  start: string
}

export interface PatientDetails {
  age: string
  gender: string
  mobile: string
  weight: string
  fullName: string
  problems: string
}

export interface Payment {
  id: number
  targetType: string
  targetId?: number
  amount?: string
  storeAmount?: string
  payerMobile?: string
  createdAt: string
  updatedAt: string
  transactionId: string
  response: Response
  status: string
}


export interface Response {
  amount: string
  bank_tran_id: string
  base_fair: string
  card_brand: string
  card_issuer: string
  card_issuer_country: string
  card_issuer_country_code: string
  card_no: string
  card_sub_brand: string
  card_type: string
  currency: string
  currency_amount: string
  currency_rate: string
  currency_type: string
  error: string
  risk_level: string
  risk_title: string
  status: string
  store_amount: string
  store_id: string
  tran_date: string
  tran_id: string
  val_id: string
  value_a: string
  value_b: string
  value_c: string
  value_d: string
  verify_sign: string
  verify_sign_sha2: string
  verify_key: string
}


export interface FormValues {
	doctorId: number;
	appointmentIds: number[];
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};

export type CreateInvoiceActionFn = (
	_: DefaultFormActionResult,
	formData: FormData
) => Promise<DefaultFormActionResult>;
