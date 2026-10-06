export interface Doctors {
	pagination: Paginator
	doctors: Doctor[]
}

export interface Paginator {
	totalItems: number
	page: number
	size: number
	hasNext: boolean
}


export interface WorkingHours {
	end: string
	start: string
}

export interface Rating {
	count: number
	rating: number
	total: number
}

export interface CategoryName {
	en: string;
	bn: string;
}

export interface Speciality {
	id: number;
	name: CategoryName;
	value: string;
	icon: string;
}

export interface Doctor {
	id: number
	name: string
	userName: string
	experience: number
	workingHours: WorkingHours
	workDays: string[]
	fee: number
	bmdcCode: string
	bmdcExpiryDate: Date
	is_self_registration: any
	is_approved: any
	commission: number
	biography?: string
	degrees?: string
	email: string;
	mobile: string;
	profilePic: any
	rating?: Rating
	patientChecked?: number
	createdAt: string
	updatedAt: string
	password: string;
	isActive: boolean;
	deletedAt: any
	specialty: Speciality
	bankDetails: BankDetails
	isCoach: boolean
	schedules?: any
	working_at?: string
	organization?: any
	isEmergency?: boolean,
	organizationId?: any,
	timePeriod?:any,
	fileManagements?:[],
	signatureUrl?:any,
	signature?:any,
	isInHouse?:any,
	common_sl?: number,
	department_sl?: number,
}

export function buildDoctorId(id: number) {
	return 9000000 + id;
}

export enum AccountType {
	BANK = "Bank",
	MFS = "MFS",
	// CARD = "Card",
}

export enum MFSType {
	BKASH = "Bkash",
	NAGAD = "Nagad",
	UPAY = 'Upay',
	ROCKET = 'Rocket',
}

// export enum BankName  {
// 	STANDARD_CHARTERED_BANK = "Standard Chartered Bank.",
// 	CITY_BANK = "City Bank Ltd.",
// 	EASTERN_BANK = "Eastern Bank Ltd.",
// 	BRAC_BANK = "Brac Bank",
// 	DUTCH_BANGLA_BANK = "Dutch-Bangla Bank",
// 	MUTUAL_TRUST_BANK = "Mutual Trust Bank",
// 	UNITED_COMMERCIAL_BANK = "United Commercial Bank PLC",
// 	LANKABANGLA_FINANCE = "LankaBangla Finance",
// 	SOUTHEAST_BANK = "Southeast Bank",
// 	TRUST_BANK = "Trust Bank",
// 	PRIME_BANK = "Prime Bank",
// 	BANK_ASIA = "Bank Asia",
// 	MEGHNA_BANK = "Meghna Bank",
// 	STANDARD_BANK = "Standard Bank Limited",
// 	NCC_BANK = "NCC Bank",
// 	NRB_BANK = "NRB Bank",
// 	JAMUNA_BANK = "Jamuna Bank",
// 	MIDLAND_BANK = "Midland Bank",
// 	DHAKA_BANK = "Dhaka Bank",
// 	SBAC_BANK = "SBAC Bank",
// 	NRBC_BANK = "NRBC Bank",
// 	SHAHJALAL_ISLAMI_BANK = "Shahjalal Islami Bank",
// 	EXIM_BANK = "Exim Bank",
// 	AL_ARAFAH_ISLAMI_BANK = "Al-Arafah Islami Bank Limited",
// 	COMMUNITY_BANK = "Community Bank",
// 	ONE_BANK = "ONE Bank",
// 	MERCANTILE_BANK = "Mercantile Bank Limited",
// 	PREMIER_BANK = "Premier Bank",
// 	AB_BANK = "AB Bank",
// }

// Create an array of enum values
export const BankName = [
	"Standard Chartered Bank.",
	"City Bank Ltd.",
	"Eastern Bank Ltd.",
	"Brac Bank",
	"Dutch-Bangla Bank",
	"Mutual Trust Bank",
	"United Commercial Bank PLC",
	"LankaBangla Finance",
	"Southeast Bank",
	"Trust Bank",
	"Prime Bank",
	"Bank Asia",
	"Meghna Bank",
	"Standard Bank Limited",
	"NCC Bank",
	"NRB Bank",
	"Jamuna Bank",
	"Midland Bank",
	"Dhaka Bank",
	"SBAC Bank",
	"NRBC Bank",
	"Shahjalal Islami Bank",
	"Exim Bank",
	"Al-Arafah Islami Bank Limited",
	"Community Bank",
	"ONE Bank",
	"Mercantile Bank Limited",
	"Premier Bank",
	"AB Bank"
];


export interface BankDetails {
	accountType: AccountType;
	mfsType: MFSType;
	accountNo: string;
	bankName: string;
	branchName: string;
	accountName: string;
	routingNumber: string;
}

