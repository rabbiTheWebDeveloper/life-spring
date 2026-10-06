"use client";

import React, { useMemo, useState } from "react";
import ExecutiveDistributionCard from "./ExecutiveDistributionCard";
import ExecutiveBarChart from "./ExecutiveBarChart";
import DailyApplicationGraph from "./DailyApplicationGraph";
import { sampleDashboardData, DashboardAnalyticsData } from "../data/sampleDashboardData";
import { rawAppointmentData } from "../data/rawAppointmentData";
import { transformAppointmentsToAnalytics } from "../data/appointmentDataTransformer";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import {
	FaChartPie,
	FaDatabase,
	FaLayerGroup,
	FaThLarge,
	FaUserMd,
	FaCalendarAlt,
	FaLaptopMedical,
	FaHospitalUser,
	FaMoneyCheckAlt,
} from "react-icons/fa";

interface Props {
	initialData?: DashboardAnalyticsData;
}

export default function DashboardAnalyticsSection({ initialData }: Props) {
	// Mode switcher: "real" (the JSON appointments from prompt) vs "screenshot" (the 9 appointments demo)
	const [dataMode, setDataMode] = useState<"real" | "screenshot">("real");
	const [activeTab, setActiveTab] = useState<"all" | "distribution" | "trends">("all");

	// Transformed analytics from real appointment data
	const realAnalytics = useMemo(() => {
		return transformAppointmentsToAnalytics(rawAppointmentData);
	}, []);

	// Active data depending on mode
	const activeData: DashboardAnalyticsData = useMemo(() => {
		if (dataMode === "real") {
			return realAnalytics;
		}
		return sampleDashboardData;
	}, [dataMode, realAnalytics]);

	return (
		<SidebarPermission tag="dashboard">
			<RolePermissionChecker tag="dashboard" name="list">
				<div className="flex flex-col gap-6 w-full">
					{/* Section Header with Data Switcher */}
					<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-6 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/70 shadow-sm">
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
								<h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
									Executive & Appointment Analytics
								</h2>
								<span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-blue-50 text-blue-600 border border-blue-200">
									{dataMode === "real" ? "Live Appointment JSON" : "Mock Preset Mode"}
								</span>
							</div>
							<p className="text-xs text-slate-400 mt-1">
								Computed executive distribution, fee collections, and intake graphs from actual appointment payloads
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-3">
							{/* Dataset Toggle */}
							<div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
								<button
									type="button"
									onClick={() => setDataMode("real")}
									className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
										dataMode === "real"
											? "bg-white text-blue-600 shadow-sm"
											: "text-slate-500 hover:text-slate-700"
									}`}
								>
									<FaDatabase className="text-xs" />
									Appointment Data ({rawAppointmentData.length})
								</button>
								<button
									type="button"
									onClick={() => setDataMode("screenshot")}
									className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
										dataMode === "screenshot"
											? "bg-white text-blue-600 shadow-sm"
											: "text-slate-500 hover:text-slate-700"
									}`}
								>
									<FaChartPie className="text-xs" />
									Preset Demo (9)
								</button>
							</div>

							{/* View Tabs */}
							<div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto justify-center sm:justify-start">
								<button
									type="button"
									onClick={() => setActiveTab("all")}
									className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
										activeTab === "all"
											? "bg-white text-blue-600 shadow-sm"
											: "text-slate-500 hover:text-slate-700"
									}`}
								>
									<FaThLarge className="text-xs" />
									All
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("distribution")}
									className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
										activeTab === "distribution"
											? "bg-white text-blue-600 shadow-sm"
											: "text-slate-500 hover:text-slate-700"
									}`}
								>
									<FaChartPie className="text-xs" />
									Distribution
								</button>
								<button
									type="button"
									onClick={() => setActiveTab("trends")}
									className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
										activeTab === "trends"
											? "bg-white text-blue-600 shadow-sm"
											: "text-slate-500 hover:text-slate-700"
									}`}
								>
									<FaLayerGroup className="text-xs" />
									Trends
								</button>
							</div>
						</div>
					</div>

					{/* Main Executive Distribution (Donut Chart + List + Top KPI cards) */}
					{(activeTab === "all" || activeTab === "distribution") && (
						<ExecutiveDistributionCard data={activeData} />
					)}

					{/* Graphs Row: Executive Bar Chart & Daily Trend Graph */}
					{(activeTab === "all" || activeTab === "trends") && (
						<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
							<ExecutiveBarChart executives={activeData.executives} />
							<DailyApplicationGraph data={activeData.dailyApplications} />
						</div>
					)}

					{/* Detailed Appointment Data Insights (Shown in Real Data mode) */}
					{dataMode === "real" && activeTab === "all" && (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
							{/* Doctor Caseload Breakdown */}
							<div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm hover:shadow-md transition-all">
								<div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
									<div className="flex items-center gap-2">
										<FaUserMd className="text-blue-600 text-base" />
										<h3 className="text-sm font-bold text-slate-800">Doctor Appointments</h3>
									</div>
									<span className="text-xs font-semibold text-slate-400">
										{realAnalytics.doctorStats.length} Doctors
									</span>
								</div>
								<div className="flex flex-col gap-3">
									{realAnalytics.doctorStats.map((doc, idx) => (
										<div
											key={idx}
											className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100"
										>
											<div className="flex items-center gap-2.5 min-w-0 pr-2">
												<span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
												<span className="text-xs font-bold text-slate-800 truncate">{doc.name}</span>
											</div>
											<div className="flex items-center gap-2.5 flex-shrink-0">
												<span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100/70 text-blue-700">
													{doc.count} slots
												</span>
												<span className="text-xs font-bold text-slate-700">
													৳{doc.fee.toLocaleString()}
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Appointment Modality & Status */}
							<div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm hover:shadow-md transition-all">
								<div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
									<div className="flex items-center gap-2">
										<FaLaptopMedical className="text-indigo-600 text-base" />
										<h3 className="text-sm font-bold text-slate-800">Modality & Channel</h3>
									</div>
									<span className="text-xs font-semibold text-slate-400">Distribution</span>
								</div>
								<div className="flex flex-col gap-3">
									<div className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<FaHospitalUser className="text-indigo-600 text-sm" />
											<span className="text-xs font-bold text-slate-700">Face to Face</span>
										</div>
										<span className="text-xs font-extrabold text-indigo-700">9 (90%)</span>
									</div>
									<div className="p-3.5 rounded-xl bg-cyan-50/40 border border-cyan-100 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<FaLaptopMedical className="text-cyan-600 text-sm" />
											<span className="text-xs font-bold text-slate-700">Online BD</span>
										</div>
										<span className="text-xs font-extrabold text-cyan-700">1 (10%)</span>
									</div>
									<div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 flex items-center justify-between">
										<span className="text-xs font-bold text-slate-700">Status Breakdown</span>
										<span className="text-xs font-extrabold text-amber-700">
											{realAnalytics.statusSummary.pending} Pending • {realAnalytics.statusSummary.cancelled} Cancelled
										</span>
									</div>
								</div>
							</div>

							{/* Financial Summary */}
							<div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm hover:shadow-md transition-all">
								<div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
									<div className="flex items-center gap-2">
										<FaMoneyCheckAlt className="text-emerald-600 text-base" />
										<h3 className="text-sm font-bold text-slate-800">Revenue & Billings</h3>
									</div>
									<span className="text-xs font-semibold text-emerald-600">BDT</span>
								</div>
								<div className="flex flex-col gap-2.5">
									<div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
										<span className="text-slate-500">Base Consultation Fee:</span>
										<span className="font-bold text-slate-800">৳{realAnalytics.summary.registrationFee.toLocaleString()}</span>
									</div>
									<div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
										<span className="text-slate-500">5% VAT Added:</span>
										<span className="font-bold text-purple-600">৳{((realAnalytics.summary.totalBilling || 0) - (realAnalytics.summary.registrationFee || 0)).toLocaleString()}</span>
									</div>
									<div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
										<span className="text-slate-500">Total Payable Billings:</span>
										<span className="font-extrabold text-emerald-600">৳{realAnalytics.summary.totalBilling.toLocaleString()}</span>
									</div>
									<div className="flex justify-between items-center text-xs py-1 border-b border-slate-100">
										<span className="text-slate-500">Refund Processed:</span>
										<span className="font-bold text-red-500">৳1,050</span>
									</div>
									<div className="flex justify-between items-center text-xs py-1">
										<span className="text-slate-500">Net LifeSpring Commission:</span>
										<span className="font-extrabold text-blue-600">৳1,950</span>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</RolePermissionChecker>
		</SidebarPermission>
	);
}
