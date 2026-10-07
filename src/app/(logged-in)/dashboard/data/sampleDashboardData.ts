export interface ExecutiveData {
	id: string;
	name: string;
	email: string;
	initial: string;
	count: number;
	sharePercentage: number;
	admissionFee: number;
	monthlyFee: number;
	totalAmount: number;
	color: string;
	bgLight: string;
	stats: {
		pending: number;
		confirmed: number;
		completed: number;
		cancelled: number;
	};
}

export interface DailyApplicationData {
	date: string;
	dayName: string;
	applications: number;
	confirmed: number;
	completed: number;
	revenue: number;
}

export interface DashboardAnalyticsData {
	summary: {
		totalAssigned: number;
		assignedLabel: string;
		registrationFee: number;
		registrationLabel: string;
		expectedMonthly: number;
		monthlyLabel: string;
		totalBilling: number;
		totalBillingLabel: string;
		currency: string;
	};
	executives: ExecutiveData[];
	dailyApplications: DailyApplicationData[];
}

export const emptyDashboardAnalyticsData: DashboardAnalyticsData = {
	summary: {
		totalAssigned: 0,
		assignedLabel: "Assigned to CRM In-charge",
		registrationFee: 0,
		registrationLabel: "Total Consultation / Registration",
		expectedMonthly: 0,
		monthlyLabel: "VAT & Service Billings",
		totalBilling: 0,
		totalBillingLabel: "Total BDT Billing Payable",
		currency: "BDT",
	},
	executives: [],
	dailyApplications: [],
};

export const sampleDashboardData: DashboardAnalyticsData = emptyDashboardAnalyticsData;

