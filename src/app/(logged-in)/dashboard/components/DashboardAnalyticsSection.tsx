"use client";

import React, { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { Tooltip, message, Spin } from "antd";
import ExecutiveDistributionCard from "./ExecutiveDistributionCard";
import ExecutiveBarChart from "./ExecutiveBarChart";
import DailyApplicationGraph from "./DailyApplicationGraph";
import { transformAppointmentsToAnalytics } from "../data/appointmentDataTransformer";
import { getAppointmentList, getPaymentSummary } from "@/app/(logged-in)/appointment/actions/GetAppointmentList";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import {
	FaChartPie,
	FaLayerGroup,
	FaThLarge,
	FaUserMd,
	FaLaptopMedical,
	FaHospitalUser,
	FaMoneyCheckAlt,
	FaRedo,
	FaCalendarAlt,
	FaTimes,
} from "react-icons/fa";

export default function DashboardAnalyticsSection() {
	// Current month boundaries
	const currentMonthStart = dayjs().startOf("month").format("YYYY-MM-DD");
	const currentMonthEnd = dayjs().endOf("month").format("YYYY-MM-DD");

	// Loading & Active Tab
	const [loading, setLoading] = useState<boolean>(true);
	const [activeTab, setActiveTab] = useState<"all" | "distribution" | "trends">("all");

	// Filter state (matches API parameters)
	// By default: created date is set to current month!
	const [page, setPage] = useState<number>(0);
	const [status, setStatus] = useState<string>("");
	const [search, setSearch] = useState<string>("");
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [createdFrom, setCreatedFrom] = useState<string>(currentMonthStart);
	const [createdTo, setCreatedTo] = useState<string>(currentMonthEnd);
	const [paymentStatus, setPaymentStatus] = useState<string>("");
	const [appointmentType, setAppointmentType] = useState<string>("");
	const [branch, setBranch] = useState<string>("");
	const [doctor, setDoctor] = useState<string>("");
	const [appointmentId, setAppointmentId] = useState<string>("");
	const [criteria, setCriteria] = useState<string>("");
	const [createdByType, setCreatedByType] = useState<string>("");
	const [executive, setExecutive] = useState<string>("");
	const [sortBy, setSortBy] = useState<string>("");
	const [orderBy, setOrderBy] = useState<string>("");
	const [isMigrated, setIsMigrated] = useState<string>("");
	const [notes, setNotes] = useState<string>("");
	const [packageId, setPackageId] = useState<string>("");

	// Quick Preset tag
	const [datePreset, setDatePreset] = useState<string>("month-created");
	// Preference for daily trend grouping: "createdAt" | "scheduleStart"
	const [trendGroupBy, setTrendGroupBy] = useState<"createdAt" | "scheduleStart">("createdAt");

	// API Response Data state
	const [appointmentList, setAppointmentList] = useState<any[]>([]);
	const [pagination, setPagination] = useState<any>(null);
	const [summary, setSummary] = useState<any>(null);

	// Main Fetch Function as requested
	const fetchData = async () => {
		setLoading(true);
		try {
			const res: any = await getAppointmentList(
				page,
				status,
				search,
				startDate,
				endDate,
				paymentStatus,
				appointmentType,
				branch,
				doctor,
				appointmentId,
				criteria,
				createdByType,
				executive,
				sortBy,
				orderBy,
				createdFrom,
				createdTo,
				isMigrated,
				notes,
				packageId,
				50, // request up to 50 records for dashboard analytics
			);
			console.log("DATAAA Rabbi", res?.data);
			setAppointmentList(res?.data?.appointments || []);
			setPagination(res?.data?.pagination || null);
			if (res?.data?.totalPaymentSummary) {
				setSummary(res?.data?.totalPaymentSummary);
			}
			setLoading(false);
		} catch (error: any) {
			message.error("Failed to Fetch Appointment List");
			setLoading(false);
		}
	};

	// Payment summary fetcher
	const fetchPaymentData = async () => {
		try {
			const res: any = await getPaymentSummary(
				page,
				status,
				search,
				startDate,
				endDate,
				paymentStatus,
				appointmentType,
				branch,
				doctor,
				appointmentId,
				criteria,
				createdByType,
				executive,
				sortBy,
				orderBy,
				createdFrom,
				createdTo,
				isMigrated,
				notes,
				packageId,
			);
			if (res?.data?.totalPaymentSummary) {
				setSummary(res?.data?.totalPaymentSummary);
			}
		} catch (e) {
			// fallback
		}
	};

	// Trigger API call when any filter or page changes
	useEffect(() => {
		fetchData();
		fetchPaymentData();
	}, [
		page,
		status,
		search,
		startDate,
		endDate,
		paymentStatus,
		appointmentType,
		branch,
		doctor,
		appointmentId,
		criteria,
		createdByType,
		executive,
		sortBy,
		orderBy,
		createdFrom,
		createdTo,
		isMigrated,
		notes,
		packageId,
	]);

	// Transform live API appointments into dynamic analytics
	const analyticsData = useMemo(() => {
		return transformAppointmentsToAnalytics(appointmentList, summary, trendGroupBy);
	}, [appointmentList, summary, trendGroupBy]);

	// Quick Date Presets
	const handleDatePreset = (preset: string) => {
		setDatePreset(preset);
		setPage(0);
		const todayStr = dayjs().format("YYYY-MM-DD");

		if (preset === "month-created") {
			// Created date is current month
			setCreatedFrom(currentMonthStart);
			setCreatedTo(currentMonthEnd);
			setStartDate("");
			setEndDate("");
			setTrendGroupBy("createdAt");
		} else if (preset === "month-schedule") {
			// Schedule date is current month
			setStartDate(currentMonthStart);
			setEndDate(currentMonthEnd);
			setCreatedFrom("");
			setCreatedTo("");
			setTrendGroupBy("scheduleStart");
		} else if (preset === "month-both") {
			// Both created and scheduled in current month
			setCreatedFrom(currentMonthStart);
			setCreatedTo(currentMonthEnd);
			setStartDate(currentMonthStart);
			setEndDate(currentMonthEnd);
			setTrendGroupBy("createdAt");
		} else if (preset === "today") {
			setCreatedFrom(todayStr);
			setCreatedTo(todayStr);
			setStartDate("");
			setEndDate("");
			setTrendGroupBy("createdAt");
		} else if (preset === "7d") {
			setCreatedFrom(dayjs().subtract(6, "days").format("YYYY-MM-DD"));
			setCreatedTo(todayStr);
			setStartDate("");
			setEndDate("");
			setTrendGroupBy("createdAt");
		} else if (preset === "all") {
			setCreatedFrom("");
			setCreatedTo("");
			setStartDate("");
			setEndDate("");
			setTrendGroupBy("createdAt");
		}
	};

	// Reset date filters (resets back to current month create date)
	const resetAllFilters = () => {
		setDatePreset("month-created");
		setCreatedFrom(currentMonthStart);
		setCreatedTo(currentMonthEnd);
		setStartDate("");
		setEndDate("");
		setTrendGroupBy("createdAt");
		setPage(0);
	};

	const hasActiveFilters = datePreset !== "month-created";

	return (
		<SidebarPermission tag="dashboard">
			<RolePermissionChecker tag="dashboard" name="list">
				<div className="flex flex-col gap-6 w-full">
					{/* Header Card with Comprehensive Filter Toolbar */}
					<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(19,64,20,0.04)] flex flex-col gap-5">
						{/* Title & Connection Status */}
						<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
							<div className="flex flex-col">
								<div className="flex items-center gap-2.5">
									<div className="w-3 h-7 bg-gradient-to-b from-[#134014] via-[#1E7023] to-[#4CAF50] rounded-full" />
									<h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
										Executive & Appointment Analytics
									</h2>
									<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
										<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
										Live API Active
									</span>
								</div>
								<p className="text-xs font-medium text-slate-500 mt-1 pl-5">
									Real-time intake, CRM staff assignment, and billings filtered by Current Month creation and appointment schedule dates.
								</p>
							</div>

							<div className="flex items-center gap-2 self-start md:self-auto">
								<Tooltip title="Refresh API Data">
									<button
										type="button"
										onClick={() => {
											fetchData();
											fetchPaymentData();
										}}
										disabled={loading}
										className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100/80 text-[#134014] border border-emerald-200 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
									>
										<FaRedo className={`text-xs ${loading ? "animate-spin text-[#134014]" : ""}`} />
										Refresh
									</button>
								</Tooltip>

								{hasActiveFilters && (
									<button
										type="button"
										onClick={resetAllFilters}
										className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer shadow-xs"
									>
										<FaTimes className="text-xs" />
										Reset Filters
									</button>
								)}
							</div>
						</div>

						{/* Quick Preset Buttons */}
						<div className="flex flex-wrap items-center gap-2">
							<span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5">
								<FaCalendarAlt className="text-[#134014] text-xs" />
								Date Presets:
							</span>
							{[
								{ key: "month-created", label: "Current Month (Created Date)" },
								{ key: "month-schedule", label: "Current Month (Schedule Date)" },
								{ key: "month-both", label: "Current Month (Both)" },
								{ key: "today", label: "Today" },
								{ key: "7d", label: "Last 7 Days" },
								{ key: "all", label: "All Time" },
							].map((p) => (
								<button
									key={p.key}
									type="button"
									onClick={() => handleDatePreset(p.key)}
									className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
										datePreset === p.key
											? "bg-[#134014] text-white shadow-md shadow-[#134014]/25 ring-2 ring-[#134014]/20"
											: "bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-100/80"
									}`}
								>
									{p.label}
								</button>
							))}
						</div>

						{/* Filter Feedback Bar & View Switcher */}
						<div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-slate-100 gap-3">
							<div className="flex flex-wrap items-center gap-2">
								<span className="font-bold text-slate-500">Active Period:</span>
								{createdFrom && createdTo && (
									<span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
										Created: {createdFrom} to {createdTo}
									</span>
								)}
								{startDate && endDate && (
									<span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
										Schedule: {startDate} to {endDate}
									</span>
								)}
								<span className="text-[#134014] font-extrabold bg-[#DEF8DB]/80 px-2.5 py-1 rounded-full border border-emerald-300">
									{pagination?.totalElements ?? appointmentList.length} Appointments Found
								</span>
							</div>

							{/* Navigation View Tabs */}
							<div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
								<button
									type="button"
									onClick={() => setActiveTab("all")}
									className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
										activeTab === "all"
											? "bg-[#134014] text-white shadow-xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<FaThLarge className="text-xs" />
									All Views
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("distribution")}
									className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
										activeTab === "distribution"
											? "bg-[#134014] text-white shadow-xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<FaChartPie className="text-xs" />
									Staff Distribution
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("trends")}
									className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
										activeTab === "trends"
											? "bg-[#134014] text-white shadow-xs"
											: "text-slate-600 hover:text-slate-900"
									}`}
								>
									<FaLayerGroup className="text-xs" />
									Daily Trends
								</button>
							</div>
						</div>
					</div>

					{/* Loading Overlay or Main Content */}
					{loading && appointmentList.length === 0 ? (
						<div className="flex flex-col items-center justify-center p-20 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 shadow-[0_10px_30px_-10px_rgba(19,64,20,0.04)]">
							<Spin size="large" />
							<p className="text-base font-extrabold text-slate-800 mt-5">
								Fetching live appointment records for current period...
							</p>
							<p className="text-xs font-medium text-slate-400 mt-1">
								Computing CRM executive distribution, workload, and revenue metrics
							</p>
						</div>
					) : (
						<>

							{/* Main Executive Distribution (Donut Chart + List + Top KPI cards) */}
							{(activeTab === "all" || activeTab === "distribution") && (
								<ExecutiveDistributionCard data={analyticsData} />
							)}

							{/* Graphs Row: Executive Bar Chart & Daily Trend Graph */}
							{(activeTab === "all" || activeTab === "trends") && (
								<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
									<ExecutiveBarChart executives={analyticsData.executives} />
									<DailyApplicationGraph data={analyticsData.dailyApplications} />
								</div>
							)}

							{/* Detailed Appointment Data Insights */}
							{(activeTab === "all" || activeTab === "distribution") && appointmentList.length > 0 && (
								<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
									{/* Doctor Caseload Breakdown */}
									<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(19,64,20,0.04)] hover:shadow-[0_15px_35px_-5px_rgba(19,64,20,0.08)] transition-all">
										<div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
											<div className="flex items-center gap-2.5">
												<div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#134014]">
													<FaUserMd className="text-sm" />
												</div>
												<h3 className="text-sm font-extrabold text-slate-800">Doctor Caseloads</h3>
											</div>
											<span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
												{analyticsData.doctorStats.length} Doctors
											</span>
										</div>
										<div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
											{analyticsData.doctorStats.length === 0 ? (
												<p className="text-xs text-slate-400 py-6 text-center">No doctor records</p>
											) : (
												analyticsData.doctorStats.slice(0, 8).map((doc, idx) => (
													<div
														key={idx}
														className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all"
													>
														<div className="flex items-center gap-2.5 min-w-0 pr-2">
															<span
																className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0 ${
																	idx === 0
																		? "bg-amber-100 text-amber-800 border border-amber-300"
																		: idx === 1
																		? "bg-slate-200 text-slate-700 border border-slate-300"
																		: "bg-emerald-50 text-emerald-800 border border-emerald-200"
																}`}
															>
																{idx + 1}
															</span>
															<span className="text-xs font-bold text-slate-900 truncate">{doc.name}</span>
														</div>
														<div className="flex items-center gap-2 flex-shrink-0">
															<span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
																{doc.count} slots
															</span>
															<span className="text-xs font-black text-slate-900">
																৳{doc.fee.toLocaleString()}
															</span>
														</div>
													</div>
												))
											)}
										</div>
									</div>

									{/* Appointment Modality & Status */}
									<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(19,64,20,0.04)] hover:shadow-[0_15px_35px_-5px_rgba(19,64,20,0.08)] transition-all">
										<div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
											<div className="flex items-center gap-2.5">
												<div className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-teal-700">
													<FaLaptopMedical className="text-sm" />
												</div>
												<h3 className="text-sm font-extrabold text-slate-800">Modality & Channels</h3>
											</div>
											<span className="text-xs font-bold text-slate-400">Distribution</span>
										</div>
										<div className="flex flex-col gap-3">
											<div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between shadow-xs">
												<div className="flex items-center gap-3">
													<div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-700">
														<FaHospitalUser className="text-base" />
													</div>
													<div className="flex flex-col">
														<span className="text-xs font-bold text-slate-800">Face to Face</span>
														<span className="text-[11px] text-slate-400 font-medium">In-Clinic Consultations</span>
													</div>
												</div>
												<span className="text-base font-black text-emerald-800">
													{analyticsData.typeStats.find((t) => t.name.toLowerCase().includes("face"))?.count || 0}
												</span>
											</div>

											<div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 flex items-center justify-between shadow-xs">
												<div className="flex items-center gap-3">
													<div className="w-9 h-9 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-700">
														<FaLaptopMedical className="text-base" />
													</div>
													<div className="flex flex-col">
														<span className="text-xs font-bold text-slate-800">Online Consultation</span>
														<span className="text-[11px] text-slate-400 font-medium">Remote Video Care</span>
													</div>
												</div>
												<span className="text-base font-black text-teal-800">
													{analyticsData.typeStats.find((t) => t.name.toLowerCase().includes("online"))?.count || 0}
												</span>
											</div>

											<div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex items-center justify-between">
												<span className="text-xs font-bold text-slate-700">Intake Status Pulse</span>
												<span className="text-xs font-black text-amber-800">
													{analyticsData.statusSummary.confirmed} Confirmed • {analyticsData.statusSummary.pending} Pending
												</span>
											</div>
										</div>
									</div>

									{/* Financial Summary */}
									<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(19,64,20,0.04)] hover:shadow-[0_15px_35px_-5px_rgba(19,64,20,0.08)] transition-all">
										<div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
											<div className="flex items-center gap-2.5">
												<div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#134014]">
													<FaMoneyCheckAlt className="text-sm" />
												</div>
												<h3 className="text-sm font-extrabold text-slate-800">Revenue & Billings</h3>
											</div>
											<span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
												BDT Ledger
											</span>
										</div>
										<div className="flex flex-col gap-2.5">
											<div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
												<span className="text-slate-500 font-medium">Total Consultation Fee:</span>
												<span className="font-extrabold text-slate-900">
													৳{analyticsData.summary.registrationFee.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
												<span className="text-slate-500 font-medium">VAT & Additional Charges:</span>
												<span className="font-extrabold text-indigo-700">
													৳{analyticsData.summary.expectedMonthly.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
												<span className="text-slate-500 font-medium">Total Payable Billings:</span>
												<span className="font-black text-[#134014]">
													৳{analyticsData.summary.totalBilling.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between items-center text-xs py-1.5 border-b border-slate-100">
												<span className="text-slate-500 font-medium">Paid Collections:</span>
												<span className="font-extrabold text-emerald-700">
													৳{analyticsData.financials.totalPaid.toLocaleString()}
												</span>
											</div>
											<div className="flex justify-between items-center text-xs py-1">
												<span className="text-slate-500 font-medium">Total Refunds Processed:</span>
												<span className="font-extrabold text-rose-600">
													৳{analyticsData.financials.totalRefund.toLocaleString()}
												</span>
											</div>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</RolePermissionChecker>
		</SidebarPermission>
	);
}
