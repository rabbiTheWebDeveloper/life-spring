"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { DashboardAnalyticsData, ExecutiveData } from "../data/sampleDashboardData";
import { HiOutlineUsers } from "react-icons/hi2";

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

		const chartData = executives.map((exec) => ({
			value: exec.count,
			name: exec.name,
			itemStyle: {
				color: exec.color,
			},
		}));

		const option: echarts.EChartsOption = {
			tooltip: {
				trigger: "item",
				formatter: (params: any) => {
					const exec = executives.find((e) => e.name === params.name);
					const percent = params.percent || 0;
					const countLabel = params.value === 1 ? "Appointment" : "Appointments";
					return `
						<div style="font-family: inherit; padding: 6px 10px; font-size: 13px;">
							<div style="font-weight: 700; color: #1e293b; margin-bottom: 4px;">${params.name}</div>
							<div style="color: #64748b; font-size: 12px;">${params.value} ${countLabel} (${percent}%)</div>
							${
								exec
									? `<div style="color: #0f766e; font-weight: 700; margin-top: 6px; font-size: 13px;">৳${exec.totalAmount.toLocaleString()} BDT</div>`
									: ""
							}
						</div>
					`;
				},
				backgroundColor: "rgba(255, 255, 255, 0.98)",
				borderColor: "#e2e8f0",
				borderWidth: 1,
				extraCssText: "box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); border-radius: 10px;",
			},
			series: [
				{
					name: "Staff Distribution",
					type: "pie",
					radius: ["58%", "84%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 0,
						borderColor: "#ffffff",
						borderWidth: 4,
					},
					label: {
						show: false,
					},
					emphasis: {
						scale: true,
						scaleSize: 5,
						itemStyle: {
							shadowBlur: 10,
							shadowColor: "rgba(0, 0, 0, 0.15)",
						},
					},
					data: chartData,
				},
			],
		};

		chartInstance.current.setOption(option);

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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{/* 1. Assigned to CRM In-charge */}
				<div className="bg-white rounded-2xl p-6 border border-slate-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
					<div className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
						{summary.totalAssigned}
					</div>
					<div className="text-sm font-normal text-slate-400 mt-3">
						{summary.assignedLabel}
					</div>
				</div>

				{/* 2. One-time registration */}
				<div className="bg-white rounded-2xl p-6 border border-emerald-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
					<div className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
						৳{summary.registrationFee.toLocaleString()}{" "}
						<span className="text-base font-bold text-slate-600">{summary.currency}</span>
					</div>
					<div className="text-sm font-normal text-slate-400 mt-3">
						{summary.registrationLabel}
					</div>
				</div>

				{/* 3. Expected monthly billing */}
				<div className="bg-white rounded-2xl p-6 border border-purple-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
					<div className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
						৳{summary.expectedMonthly.toLocaleString()}{" "}
						<span className="text-base font-bold text-slate-600">{summary.currency}</span>
					</div>
					<div className="text-sm font-normal text-slate-400 mt-3">
						{summary.monthlyLabel}
					</div>
				</div>

				{/* 4. Total Admission + Monthly */}
				<div className="bg-white rounded-2xl p-6 border border-purple-200/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
					<div className="text-3xl lg:text-4xl font-extrabold text-slate-800 tracking-tight">
						৳{summary.totalBilling.toLocaleString()}{" "}
						<span className="text-base font-bold text-slate-600">{summary.currency}</span>
					</div>
					<div className="text-sm font-normal text-slate-400 mt-3">
						{summary.totalBillingLabel}
					</div>
				</div>
			</div>

			{/* Main Donut & List Section */}
			<div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-sm">
				<div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
					{/* Left: Donut Chart with Center Label */}
					<div className="flex flex-col items-center justify-center relative w-full lg:w-[38%] min-w-[280px]">
						<div className="relative w-[280px] h-[280px] flex items-center justify-center">
							<div ref={chartRef} className="w-full h-full" />
							{/* Center Overlay Text */}
							<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none text-center">
								<span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
									TOTAL COUNT
								</span>
								<span className="text-[26px] font-extrabold text-slate-800 tracking-tight leading-tight mt-0.5">
									{totalCount} {totalCount === 1 ? "Appointment" : "Appointments"}
								</span>
								<span className="text-xs font-semibold text-blue-600 mt-0.5">
									{executives.length} {executives.length === 1 ? "Executive" : "Executives"}
								</span>
							</div>
						</div>

						{/* Subtitle directly below donut */}
						<p className="text-xs font-normal text-slate-400 mt-4 tracking-normal text-center">
							Showing distribution by{" "}
							<span className="text-slate-700 font-semibold">Appointments In Charge</span>
						</p>
					</div>

					{/* Right: Detailed Executive List */}
					<div className="flex-1 w-full flex flex-col gap-3">
						{executives.map((exec) => (
							<div
								key={exec.id}
								className="group flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 rounded-xl border border-slate-100 hover:border-slate-200/80 bg-white hover:bg-slate-50/60 transition-all duration-150 gap-4"
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
										className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
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
									</div>
								</div>

								{/* Middle: Count & Share Percentage */}
								<div className="flex flex-col sm:items-start pl-6 sm:pl-0 min-w-[140px]">
									<div className="flex items-center gap-1.5 text-slate-700 font-semibold text-sm">
										<HiOutlineUsers className="text-slate-500 text-sm" />
										<span>{exec.count} {exec.count === 1 ? "Appointment" : "Appointments"}</span>
									</div>
									<span className="text-xs text-slate-400 font-normal mt-0.5">
										({exec.sharePercentage}% share)
									</span>
								</div>

								{/* Right: Amount & Breakdown */}
								<div className="flex flex-col sm:items-end pl-6 sm:pl-0 min-w-[170px]">
									<span className="text-base font-extrabold text-slate-800">
										৳{exec.totalAmount.toLocaleString()}{" "}
										<span className="text-xs font-bold text-slate-600">BDT</span>
									</span>
									<span className="text-xs text-slate-400 font-normal mt-0.5">
										<span className="text-slate-400">Adm:</span>{" "}
										<span className="text-emerald-600 font-semibold">
											৳{exec.admissionFee.toLocaleString()} BDT
										</span>
										{" • "}
										<span className="text-slate-400">Mo:</span>{" "}
										<span className="text-blue-600 font-semibold">
											৳{exec.monthlyFee.toLocaleString()} BDT
										</span>
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
