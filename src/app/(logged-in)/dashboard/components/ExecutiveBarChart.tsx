"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import { ExecutiveData } from "../data/sampleDashboardData";
import { FaChartBar, FaMoneyBillWave, FaUserTie } from "react-icons/fa";

interface Props {
	executives: ExecutiveData[];
}

export default function ExecutiveBarChart({ executives }: Props) {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<echarts.ECharts | null>(null);
	const [viewMode, setViewMode] = useState<"count" | "revenue">("count");

	useEffect(() => {
		if (!chartRef.current || executives.length === 0) return;

		if (!chartInstance.current) {
			chartInstance.current = echarts.init(chartRef.current);
		}

		const names = executives.map((e) => e.name);

		let option: echarts.EChartsOption;

		if (viewMode === "count") {
			const confirmedData = executives.map((e) => e.stats.confirmed);
			const pendingData = executives.map((e) => e.stats.pending);
			const completedData = executives.map((e) => e.stats.completed);

			option = {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
					backgroundColor: "rgba(255, 255, 255, 0.98)",
					borderColor: "#e2e8f0",
					borderWidth: 1,
					textStyle: {
						color: "#1e293b",
					},
					extraCssText: "box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12); border-radius: 12px;",
				},
				legend: {
					data: ["Confirmed", "Completed", "Pending"],
					bottom: 0,
					textStyle: {
						color: "#64748b",
						fontSize: 12,
						fontWeight: 600,
					},
					icon: "circle",
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "12%",
					top: "10%",
					containLabel: true,
				},
				xAxis: {
					type: "category",
					data: names,
					axisLine: { lineStyle: { color: "#e2e8f0" } },
					axisTick: { show: false },
					axisLabel: {
						color: "#334155",
						fontSize: 12,
						fontWeight: 700,
					},
				},
				yAxis: {
					type: "value",
					axisLine: { show: false },
					axisTick: { show: false },
					splitLine: {
						lineStyle: {
							color: "#f1f5f9",
							type: "dashed",
						},
					},
					axisLabel: {
						color: "#94a3b8",
						fontSize: 11,
					},
				},
				series: [
					{
						name: "Confirmed",
						type: "bar",
						stack: "total",
						data: confirmedData,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: "#10b981" },
								{ offset: 1, color: "#059669" },
							]),
							borderRadius: [0, 0, 0, 0],
						},
						barWidth: 28,
					},
					{
						name: "Completed",
						type: "bar",
						stack: "total",
						data: completedData,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: "#3b82f6" },
								{ offset: 1, color: "#1d4ed8" },
							]),
							borderRadius: [0, 0, 0, 0],
						},
						barWidth: 28,
					},
					{
						name: "Pending",
						type: "bar",
						stack: "total",
						data: pendingData,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: "#fbbf24" },
								{ offset: 1, color: "#d97706" },
							]),
							borderRadius: [6, 6, 0, 0],
						},
						barWidth: 28,
					},
				],
			};
		} else {
			const revenueData = executives.map((e) => e.totalAmount);
			const admissionData = executives.map((e) => e.admissionFee);

			option = {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
					formatter: (params: any) => {
						const param = params[0];
						const exec = executives[param.dataIndex];
						return `
							<div style="font-family: inherit; padding: 6px 10px; font-size: 13px;">
								<div style="font-weight: 800; color: #0f172a; margin-bottom: 4px; font-size: 14px;">${exec.name}</div>
								<div style="color: #059669; font-weight: 800; font-size: 13px;">Total Revenue: ৳${exec.totalAmount.toLocaleString()} BDT</div>
								<div style="color: #64748b; font-size: 11px; margin-top: 4px;">Admission: ৳${exec.admissionFee.toLocaleString()}</div>
								<div style="color: #64748b; font-size: 11px;">Monthly Fees: ৳${exec.monthlyFee.toLocaleString()}</div>
							</div>
						`;
					},
					backgroundColor: "rgba(255, 255, 255, 0.98)",
					borderColor: "#e2e8f0",
					borderWidth: 1,
					extraCssText: "box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12); border-radius: 12px;",
				},
				legend: {
					data: ["Admission Fee", "Total Revenue"],
					bottom: 0,
					textStyle: {
						color: "#64748b",
						fontSize: 12,
						fontWeight: 600,
					},
					icon: "circle",
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "12%",
					top: "10%",
					containLabel: true,
				},
				xAxis: {
					type: "category",
					data: names,
					axisLine: { lineStyle: { color: "#e2e8f0" } },
					axisTick: { show: false },
					axisLabel: {
						color: "#334155",
						fontSize: 12,
						fontWeight: 700,
					},
				},
				yAxis: {
					type: "value",
					axisLine: { show: false },
					axisTick: { show: false },
					splitLine: {
						lineStyle: {
							color: "#f1f5f9",
							type: "dashed",
						},
					},
					axisLabel: {
						formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`,
						color: "#94a3b8",
						fontSize: 11,
					},
				},
				series: [
					{
						name: "Admission Fee",
						type: "bar",
						data: admissionData,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: "#a855f7" },
								{ offset: 1, color: "#7e22ce" },
							]),
							borderRadius: [6, 6, 0, 0],
						},
						barWidth: 24,
					},
					{
						name: "Total Revenue",
						type: "bar",
						data: revenueData,
						itemStyle: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{ offset: 0, color: "#10b981" },
								{ offset: 1, color: "#047857" },
							]),
							borderRadius: [6, 6, 0, 0],
						},
						barWidth: 24,
					},
				],
			};
		}

		chartInstance.current.setOption(option, true);

		const handleResize = () => chartInstance.current?.resize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [executives, viewMode]);

	return (
		<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.08)] transition-all duration-200">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 border-b border-slate-100 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
							<FaUserTie className="text-sm" />
						</div>
						<h3 className="text-base font-extrabold text-slate-800">
							Executive Caseload & Revenue
						</h3>
					</div>
					<p className="text-xs font-medium text-slate-400 mt-1 pl-10">
						Compare individual staff intake volume and billing generation
					</p>
				</div>

				{/* Toggle Switch */}
				<div className="flex items-center bg-slate-100/80 p-1 rounded-xl self-start sm:self-auto border border-slate-200/50">
					<button
						type="button"
						onClick={() => setViewMode("count")}
						className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							viewMode === "count"
								? "bg-white text-blue-600 shadow-sm"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						<FaChartBar className="text-xs" />
						Appt Status
					</button>
					<button
						type="button"
						onClick={() => setViewMode("revenue")}
						className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							viewMode === "revenue"
								? "bg-white text-emerald-600 shadow-sm"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						<FaMoneyBillWave className="text-xs" />
						Revenue (BDT)
					</button>
				</div>
			</div>

			{executives.length === 0 ? (
				<div className="w-full h-[280px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
					<FaChartBar className="text-4xl text-slate-300 mb-2" />
					<p className="text-sm font-bold text-slate-700">No Executive Activity</p>
					<p className="text-xs text-slate-400 mt-1">
						No appointments assigned to executives for the chosen period.
					</p>
				</div>
			) : (
				<div ref={chartRef} className="w-full h-[290px]" />
			)}
		</div>
	);
}
