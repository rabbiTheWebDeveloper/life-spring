"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { DashboardAnalyticsData, ExecutiveData } from "../data/sampleDashboardData";
import { HiOutlineUsers } from "react-icons/hi2";
import { FaUserCheck, FaCoins, FaReceipt, FaFileInvoiceDollar } from "react-icons/fa";

interface Props {
	data: DashboardAnalyticsData;
}

export default function ExecutiveDistributionCard({ data }: Props) {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<echarts.ECharts | null>(null);
	const [activeCategory, setActiveCategory] = useState<string>("Appointments");

	const { summary, executives } = data;
	const totalCount = executives.reduce((sum, item) => sum + item.count, 0);

	useEffect(() => {
		if (!chartRef.current) return;

		if (!chartInstance.current) {
			chartInstance.current = echarts.init(chartRef.current, undefined, {
				renderer: "svg",
			});
		}

		const chartData =
			executives.length > 0
				? executives.map((exec) => ({
						value: exec.count,
						name: exec.name,
						itemStyle: {
							color: exec.color,
						},
				  }))
				: [{ value: 1, name: "No Data", itemStyle: { color: "#e2e8f0" } }];

		const option: echarts.EChartsOption = {
			tooltip: {
				trigger: "item",
				formatter: (params: any) => {
					const exec = executives.find((e) => e.name === params.name);
					const percent = params.percent || 0;
					const countLabel = params.value === 1 ? "Appointment" : "Appointments";
					return `
						<div style="font-family: inherit; padding: 8px 12px; font-size: 13px;">
							<div style="font-weight: 800; color: #0f172a; margin-bottom: 4px; font-size: 14px;">${params.name}</div>
							<div style="color: #64748b; font-size: 12px; font-weight: 600;">${params.value} ${countLabel} (${percent}%)</div>
							${
								exec
									? `<div style="color: #059669; font-weight: 800; margin-top: 6px; font-size: 13px;">৳${exec.totalAmount.toLocaleString()} BDT</div>`
									: ""
							}
						</div>
					`;
				},
				backgroundColor: "rgba(255, 255, 255, 0.98)",
				borderColor: "#e2e8f0",
				borderWidth: 1,
				extraCssText: "box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12); border-radius: 12px;",
			},
			series: [
				{
					name: "Staff Distribution",
					type: "pie",
					radius: ["60%", "86%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 4,
						borderColor: "#ffffff",
						borderWidth: 3,
					},
					label: {
						show: false,
					},
					emphasis: {
						scale: true,
						scaleSize: 6,
						itemStyle: {
							shadowBlur: 14,
							shadowColor: "rgba(0, 0, 0, 0.15)",
						},
					},
					data: chartData,
				},
			],
		};

		chartInstance.current.setOption(option, true);

		const handleResize = () => {
			chartInstance.current?.resize();
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [executives, activeCategory]);

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Top Metric Summary Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
				{/* 1. Assigned to CRM In-charge */}
				<div className="relative bg-gradient-to-br from-blue-50/60 via-white to-white rounded-2xl p-5 sm:p-6 border border-blue-100/90 shadow-[0_4px_16px_-4px_rgba(37,99,235,0.06)] hover:shadow-[0_10px_25px_-5px_rgba(37,99,235,0.12)] hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between overflow-hidden">
					<div className="flex justify-between items-start mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-full">
							CRM Workload
						</span>
						<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
							<FaUserCheck className="text-base" />
						</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
							{summary.totalAssigned}
						</div>
						<div className="text-xs font-semibold text-slate-400 mt-2">
							{summary.assignedLabel}
						</div>
					</div>
				</div>

				{/* 2. One-time registration */}
				<div className="relative bg-gradient-to-br from-emerald-50/60 via-white to-white rounded-2xl p-5 sm:p-6 border border-emerald-100/90 shadow-[0_4px_16px_-4px_rgba(5,150,105,0.06)] hover:shadow-[0_10px_25px_-5px_rgba(5,150,105,0.12)] hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between overflow-hidden">
					<div className="flex justify-between items-start mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-full">
							Base Intake
						</span>
						<div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
							<FaCoins className="text-base" />
						</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
							৳{summary.registrationFee.toLocaleString()}{" "}
							<span className="text-sm font-bold text-slate-500">{summary.currency}</span>
						</div>
						<div className="text-xs font-semibold text-slate-400 mt-2">
							{summary.registrationLabel}
						</div>
					</div>
				</div>

				{/* 3. Expected monthly billing */}
				<div className="relative bg-gradient-to-br from-purple-50/60 via-white to-white rounded-2xl p-5 sm:p-6 border border-purple-100/90 shadow-[0_4px_16px_-4px_rgba(147,51,234,0.06)] hover:shadow-[0_10px_25px_-5px_rgba(147,51,234,0.12)] hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between overflow-hidden">
					<div className="flex justify-between items-start mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100/70 px-2.5 py-1 rounded-full">
							VAT & Billings
						</span>
						<div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
							<FaReceipt className="text-base" />
						</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
							৳{summary.expectedMonthly.toLocaleString()}{" "}
							<span className="text-sm font-bold text-slate-500">{summary.currency}</span>
						</div>
						<div className="text-xs font-semibold text-slate-400 mt-2">
							{summary.monthlyLabel}
						</div>
					</div>
				</div>

				{/* 4. Total Admission + Monthly */}
				<div className="relative bg-gradient-to-br from-indigo-50/60 via-white to-white rounded-2xl p-5 sm:p-6 border border-indigo-100/90 shadow-[0_4px_16px_-4px_rgba(79,70,229,0.06)] hover:shadow-[0_10px_25px_-5px_rgba(79,70,229,0.12)] hover:-translate-y-1 transition-all duration-200 group flex flex-col justify-between overflow-hidden">
					<div className="flex justify-between items-start mb-3">
						<span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-full">
							Total Payable
						</span>
						<div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
							<FaFileInvoiceDollar className="text-base" />
						</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
							৳{summary.totalBilling.toLocaleString()}{" "}
							<span className="text-sm font-bold text-slate-500">{summary.currency}</span>
						</div>
						<div className="text-xs font-semibold text-slate-400 mt-2">
							{summary.totalBillingLabel}
						</div>
					</div>
				</div>
			</div>

			{/* Main Donut & List Section */}
			<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
					{/* Left: Donut Chart with Center Label */}
					<div className="flex flex-col items-center justify-center relative w-full lg:w-[38%] min-w-[280px]">
						<div className="relative w-[280px] h-[280px] flex items-center justify-center">
							<div ref={chartRef} className="w-full h-full" />
							{/* Center Overlay Text */}
							<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
								<span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
									TOTAL INTAKE
								</span>
								<span className="text-[28px] font-black text-slate-900 tracking-tight leading-none mt-1">
									{totalCount}
								</span>
								<span className="text-[11px] font-bold text-slate-500 mt-0.5">
									{totalCount === 1 ? "Appointment" : "Appointments"}
								</span>
								<span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full mt-2 border border-blue-200">
									{executives.length} {executives.length === 1 ? "Staff" : "Staff Members"}
								</span>
							</div>
						</div>

						{/* Subtitle directly below donut */}
						<p className="text-xs font-medium text-slate-400 mt-4 tracking-normal text-center">
							Distribution of workload among{" "}
							<span className="text-slate-800 font-bold">CRM Executives & In-Charge</span>
						</p>
					</div>

					{/* Right: Detailed Executive List */}
					<div className="flex-1 w-full flex flex-col gap-3">
						{executives.length === 0 ? (
							<div className="flex flex-col items-center justify-center p-10 bg-slate-50/70 rounded-2xl border border-slate-200/60 text-center">
								<HiOutlineUsers className="text-4xl text-slate-300 mb-2" />
								<p className="text-sm font-bold text-slate-700">No staff assignment found</p>
								<p className="text-xs text-slate-400 mt-1">
									Appointments in this period do not have executive records.
								</p>
							</div>
						) : (
							executives.map((exec) => (
								<div
									key={exec.id}
									className="group flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 rounded-2xl border border-slate-100 hover:border-slate-300/80 bg-white hover:bg-slate-50/80 transition-all duration-200 gap-4 shadow-sm hover:shadow-md hover:-translate-y-0.5"
								>
									{/* Left: Color Dot, Avatar, Name & Email */}
									<div className="flex items-center gap-3.5 min-w-[220px]">
										{/* Color dot */}
										<span
											className="w-2.5 h-2.5 rounded-full flex-shrink-0"
											style={{ backgroundColor: exec.color }}
										/>

										{/* Avatar initial badge */}
										<div
											className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-sm ring-2 ring-white"
											style={{
												backgroundColor: exec.bgLight,
												color: exec.color,
											}}
										>
											{exec.initial}
										</div>

										{/* Name and Email */}
										<div className="flex flex-col min-w-0">
											<span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
												{exec.name}
											</span>
											<span className="text-xs text-slate-400 truncate">
												{exec.email}
											</span>
											{/* Share Progress Bar */}
											<div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5 max-w-[140px]">
												<div
													className="h-full rounded-full transition-all duration-500"
													style={{
														width: `${Math.min(100, exec.sharePercentage)}%`,
														backgroundColor: exec.color,
													}}
												/>
											</div>
										</div>
									</div>

									{/* Middle: Count & Share Percentage */}
									<div className="flex flex-col sm:items-start pl-6 sm:pl-0 min-w-[140px]">
										<div className="flex items-center gap-1.5 text-slate-800 font-bold text-sm">
											<HiOutlineUsers className="text-slate-500 text-sm" />
											<span>
												{exec.count} {exec.count === 1 ? "Appt" : "Appts"}
											</span>
										</div>
										<span className="text-xs text-slate-400 font-semibold mt-0.5">
											{exec.sharePercentage}% total share
										</span>
									</div>

									{/* Right: Amount & Breakdown */}
									<div className="flex flex-col sm:items-end pl-6 sm:pl-0 min-w-[170px]">
										<span className="text-base font-black text-slate-900">
											৳{exec.totalAmount.toLocaleString()}{" "}
											<span className="text-xs font-bold text-slate-500">BDT</span>
										</span>
										<div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mt-0.5">
											<span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded border border-emerald-200">
												Adm: ৳{exec.admissionFee.toLocaleString()}
											</span>
											<span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
												Mo: ৳{exec.monthlyFee.toLocaleString()}
											</span>
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
