import { DashboardAnalyticsData, ExecutiveData, DailyApplicationData } from "./sampleDashboardData";

const EXECUTIVE_PALETTES = [
	{ color: "#2563EB", bgLight: "#EFF6FF" }, // Blue
	{ color: "#8B5CF6", bgLight: "#F5F3FF" }, // Purple
	{ color: "#059669", bgLight: "#ECFDF5" }, // Emerald
	{ color: "#F59E0B", bgLight: "#FFFBEB" }, // Amber
	{ color: "#EC4899", bgLight: "#FDF2F8" }, // Pink
	{ color: "#06B6D4", bgLight: "#ECFEFF" }, // Cyan
	{ color: "#6366F1", bgLight: "#EEF2FF" }, // Indigo
	{ color: "#14B8A6", bgLight: "#F0FDFA" }, // Teal
	{ color: "#D97706", bgLight: "#FEF3C7" }, // Amber dark
	{ color: "#E11D48", bgLight: "#FFE4E6" }, // Rose
];

export interface TransformedAnalytics extends DashboardAnalyticsData {
	doctorStats: { name: string; count: number; fee: number }[];
	channelStats: { name: string; count: number }[];
	typeStats: { name: string; count: number }[];
	statusSummary: { pending: number; confirmed: number; completed: number; cancelled: number };
	financials: {
		totalFee: number;
		totalPayable: number;
		totalPaid: number;
		totalRefund: number;
		totalVat: number;
	};
}

export function transformAppointmentsToAnalytics(
	appointments: any[] = [],
	apiSummary?: any,
	datePreference: "createdAt" | "scheduleStart" = "createdAt"
): TransformedAnalytics {
	const list = Array.isArray(appointments) ? appointments : [];

	const totalAssigned = list.length;
	let totalBaseFee = 0;
	let totalPayable = 0;
	let totalPaid = 0;
	let totalRefund = 0;
	let totalVat = 0;

	// Executive grouping map
	const execMap = new Map<
		string | number,
		{
			id: string;
			name: string;
			email: string;
			initial: string;
			count: number;
			admissionFee: number;
			monthlyFee: number;
			totalAmount: number;
			pending: number;
			confirmed: number;
			completed: number;
			cancelled: number;
		}
	>();

	// Daily grouping map
	const dailyMap = new Map<
		string,
		{
			date: string;
			dayName: string;
			applications: number;
			confirmed: number;
			completed: number;
			revenue: number;
		}
	>();

	// Doctor and Type stats
	const doctorMap = new Map<string, { name: string; count: number; fee: number }>();
	const channelMap = new Map<string, number>();
	const typeMap = new Map<string, number>();
	const statusSummary = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

	const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

	list.forEach((item) => {
		const fee = Number(item.paymentDetails?.fee ?? item.paymentSummary?.fee ?? 0);
		const payable = Number(item.paymentDetails?.payable ?? item.paymentSummary?.payable ?? 0);
		const paid = Number(item.paymentSummary?.paidAmount ?? item.paymentDetails?.amount ?? 0);
		const refund = Number(item.paymentSummary?.refundAmount ?? item.paymentDetails?.refundAmount ?? 0);
		const vat = Number(item.paymentDetails?.vatOnAcutalReceive ?? item.paymentDetails?.vatPercentage ?? 0);

		totalBaseFee += fee;
		totalPayable += payable;
		totalPaid += paid;
		totalRefund += refund;
		totalVat += vat;

		// Status count
		const status = String(item.status || "Pending").toLowerCase();
		if (status.includes("pending")) statusSummary.pending++;
		else if (status.includes("confirm")) statusSummary.confirmed++;
		else if (status.includes("complete") || status.includes("visited")) statusSummary.completed++;
		else if (status.includes("cancel")) statusSummary.cancelled++;
		else statusSummary.pending++;

		// Executive grouping
		const createdById = item.createdBy?.id ?? item.createdById ?? 0;
		const createdByName = (
			item.createdBy?.fullName ||
			item.createdBy?.name ||
			(createdById ? `Staff #${createdById}` : "Self / Online")
		).trim();
		const execKey = createdById ? `id-${createdById}` : createdByName;

		// Initial letters
		const nameParts = createdByName.split(/\s+/).filter(Boolean);
		const initial =
			nameParts.length > 1
				? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
				: (nameParts[0]?.[0] || "U").toUpperCase();

		const creatorEmail =
			item.createdBy?.email ||
			(createdById ? `staff${createdById}@lifespringint.com` : "online@lifespringint.com");

		if (!execMap.has(execKey)) {
			execMap.set(execKey, {
				id: `exec-${createdById || execKey}`,
				name: createdByName,
				email: creatorEmail,
				initial,
				count: 0,
				admissionFee: 0,
				monthlyFee: 0,
				totalAmount: 0,
				pending: 0,
				confirmed: 0,
				completed: 0,
				cancelled: 0,
			});
		}

		const exec = execMap.get(execKey)!;
		exec.count++;
		exec.admissionFee += fee;
		exec.totalAmount += payable;
		if (item.packageId || item.packageName) {
			exec.monthlyFee += payable;
		} else {
			exec.monthlyFee += Math.max(0, payable - fee);
		}

		if (status.includes("pending")) exec.pending++;
		else if (status.includes("confirm")) exec.confirmed++;
		else if (status.includes("complete") || status.includes("visited")) exec.completed++;
		else if (status.includes("cancel")) exec.cancelled++;

		// Daily grouping based on preference (createdAt vs scheduleStart)
		const rawDate =
			datePreference === "createdAt"
				? item.createdAt || item.scheduleStart || item.appointment_date || ""
				: item.scheduleStart || item.createdAt || item.appointment_date || "";
		const dateStr = rawDate ? String(rawDate).slice(0, 10) : "";
		if (dateStr && dateStr.length === 10) {
			const dObj = new Date(dateStr);
			const dayName = isNaN(dObj.getTime()) ? "Day" : days[dObj.getDay()];

			if (!dailyMap.has(dateStr)) {
				dailyMap.set(dateStr, {
					date: dateStr,
					dayName,
					applications: 0,
					confirmed: 0,
					completed: 0,
					revenue: 0,
				});
			}

			const daily = dailyMap.get(dateStr)!;
			daily.applications++;
			daily.revenue += payable;
			if (status.includes("confirm")) daily.confirmed++;
			if (status.includes("complete") || status.includes("visited")) daily.completed++;
		}

		// Doctor stats
		const doctorName = item.doctor?.name || "Unassigned Doctor";
		if (!doctorMap.has(doctorName)) {
			doctorMap.set(doctorName, { name: doctorName, count: 0, fee: 0 });
		}
		const doc = doctorMap.get(doctorName)!;
		doc.count++;
		doc.fee += payable;

		// Channel & Type stats
		const channel = item.channel || "Web Portal";
		channelMap.set(channel, (channelMap.get(channel) || 0) + 1);

		const aptType = item.appointmentType || "Face-to-face";
		typeMap.set(aptType, (typeMap.get(aptType) || 0) + 1);
	});

	// Build Executives Array
	const executives: ExecutiveData[] = Array.from(execMap.values())
		.map((ex, index) => {
			const palette = EXECUTIVE_PALETTES[index % EXECUTIVE_PALETTES.length];
			const share = totalAssigned > 0 ? Number(((ex.count / totalAssigned) * 100).toFixed(1)) : 0;
			return {
				id: ex.id,
				name: ex.name,
				email: ex.email,
				initial: ex.initial,
				count: ex.count,
				sharePercentage: share,
				admissionFee: ex.admissionFee,
				monthlyFee: ex.monthlyFee,
				totalAmount: ex.totalAmount,
				color: palette.color,
				bgLight: palette.bgLight,
				stats: {
					pending: ex.pending,
					confirmed: ex.confirmed,
					completed: ex.completed,
					cancelled: ex.cancelled,
				},
			};
		})
		.sort((a, b) => b.count - a.count);

	// Sort daily applications chronologically
	const dailyApplications: DailyApplicationData[] = Array.from(dailyMap.values()).sort((a, b) =>
		a.date.localeCompare(b.date)
	);

	const doctorStats = Array.from(doctorMap.values()).sort((a, b) => b.count - a.count);
	const channelStats = Array.from(channelMap.entries()).map(([name, count]) => ({ name, count }));
	const typeStats = Array.from(typeMap.entries()).map(([name, count]) => ({ name, count }));

	// Use API summary values if provided, else calculated totals
	const finalRegistrationFee = apiSummary?.totalFee != null ? Number(apiSummary.totalFee) : totalBaseFee;
	const finalTotalBilling =
		apiSummary?.totalPaidAmount != null && apiSummary?.totalDueAmount != null
			? Number(apiSummary.totalPaidAmount) + Number(apiSummary.totalDueAmount)
			: totalPayable;
	const finalExpectedMonthly =
		apiSummary?.totalVatAmount != null
			? Number(apiSummary.totalVatAmount)
			: Math.max(0, finalTotalBilling - finalRegistrationFee);

	return {
		summary: {
			totalAssigned,
			assignedLabel: "Assigned Appointments / In-charge",
			registrationFee: finalRegistrationFee,
			registrationLabel: "Total Consultation / Registration",
			expectedMonthly: finalExpectedMonthly,
			monthlyLabel: "VAT & Service Billings",
			totalBilling: finalTotalBilling,
			totalBillingLabel: "Total BDT Billing Payable",
			currency: "BDT",
		},
		executives,
		dailyApplications,
		doctorStats,
		channelStats,
		typeStats,
		statusSummary,
		financials: {
			totalFee: finalRegistrationFee,
			totalPayable: finalTotalBilling,
			totalPaid: apiSummary?.totalPaidAmount != null ? Number(apiSummary.totalPaidAmount) : totalPaid,
			totalRefund: apiSummary?.totalRefundAmount != null ? Number(apiSummary.totalRefundAmount) : totalRefund,
			totalVat: apiSummary?.totalVatAmount != null ? Number(apiSummary.totalVatAmount) : totalVat,
		},
	};
}
