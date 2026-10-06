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

export const sampleDashboardData: DashboardAnalyticsData = {
	summary: {
		totalAssigned: 9,
		assignedLabel: "Assigned to CRM In-charge",
		registrationFee: 27000,
		registrationLabel: "One-time registration",
		expectedMonthly: 52000,
		monthlyLabel: "Expected monthly billing",
		totalBilling: 79000,
		totalBillingLabel: "Admission + Monthly",
		currency: "BDT",
	},
	executives: [
		{
			id: "exec-1",
			name: "Ramisa",
			email: "ramisabinti884@gmail.com",
			initial: "R",
			count: 4,
			sharePercentage: 44.4,
			admissionFee: 15000,
			monthlyFee: 26000,
			totalAmount: 41000,
			color: "#2563EB", // Blue
			bgLight: "#EFF6FF",
			stats: {
				pending: 1,
				confirmed: 2,
				completed: 1,
				cancelled: 0,
			},
		},
		{
			id: "exec-2",
			name: "Azam Shahedi",
			email: "azamshahedi.fajracademy@gmail.com",
			initial: "A",
			count: 4,
			sharePercentage: 44.4,
			admissionFee: 9000,
			monthlyFee: 22000,
			totalAmount: 31000,
			color: "#8B5CF6", // Purple
			bgLight: "#F5F3FF",
			stats: {
				pending: 0,
				confirmed: 3,
				completed: 1,
				cancelled: 0,
			},
		},
		{
			id: "exec-3",
			name: "Ishrat",
			email: "israt.fajracademy@gmail.com",
			initial: "I",
			count: 1,
			sharePercentage: 11.1,
			admissionFee: 3000,
			monthlyFee: 4000,
			totalAmount: 7000,
			color: "#059669", // Emerald Green
			bgLight: "#ECFDF5",
			stats: {
				pending: 0,
				confirmed: 1,
				completed: 0,
				cancelled: 0,
			},
		},
	],
	dailyApplications: [
		{ date: "2026-09-24", dayName: "Thu", applications: 18, confirmed: 14, completed: 11, revenue: 32000 },
		{ date: "2026-09-25", dayName: "Fri", applications: 25, confirmed: 20, completed: 16, revenue: 48000 },
		{ date: "2026-09-26", dayName: "Sat", applications: 32, confirmed: 28, completed: 22, revenue: 64000 },
		{ date: "2026-09-27", dayName: "Sun", applications: 22, confirmed: 19, completed: 15, revenue: 41000 },
		{ date: "2026-09-28", dayName: "Mon", applications: 29, confirmed: 24, completed: 20, revenue: 55000 },
		{ date: "2026-09-29", dayName: "Tue", applications: 35, confirmed: 30, completed: 26, revenue: 72000 },
		{ date: "2026-09-30", dayName: "Wed", applications: 40, confirmed: 36, completed: 31, revenue: 88000 },
		{ date: "2026-10-01", dayName: "Thu", applications: 28, confirmed: 23, completed: 19, revenue: 53000 },
		{ date: "2026-10-02", dayName: "Fri", applications: 34, confirmed: 29, completed: 25, revenue: 67000 },
		{ date: "2026-10-03", dayName: "Sat", applications: 45, confirmed: 39, completed: 35, revenue: 95000 },
		{ date: "2026-10-04", dayName: "Sun", applications: 38, confirmed: 32, completed: 28, revenue: 76000 },
		{ date: "2026-10-05", dayName: "Mon", applications: 42, confirmed: 37, completed: 33, revenue: 84000 },
		{ date: "2026-10-06", dayName: "Tue", applications: 48, confirmed: 41, completed: 36, revenue: 99000 },
		{ date: "2026-10-07", dayName: "Wed", applications: 52, confirmed: 46, completed: 40, revenue: 108000 },
	],
};
