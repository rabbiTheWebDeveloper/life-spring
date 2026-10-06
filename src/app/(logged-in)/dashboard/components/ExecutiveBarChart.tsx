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
		if (!chartRef.current) return;

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
					backgroundColor: "rgba(255, 255, 255, 0.96)",
					borderColor: "#e2e8f0",
					borderWidth: 1,
					textStyle: {
						color: "#1e293b",
					},
				},
				legend: {
					data: ["Confirmed", "Completed", "Pending"],
					bottom: 0,
					textStyle: {
						color: "#64748b",
						fontSize: 12,
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
					axisLine: {
						lineStyle: { color: "#cbd5e1" },
					},
					axisLabel: {
						color: "#475569",
						fontWeight: "bold",
					},
				},
				yAxis: {
					type: "value",
					splitLine: {
						lineStyle: {
							type: "dashed",
							color: "#f1f5f9",
						},
					},
					axisLabel: {
						color: "#94a3b8",
					},
				},
				series: [
					{
						name: "Confirmed",
						type: "bar",
						stack: "total",
						barWidth: 32,
						itemStyle: {
							color: "#2563EB",
						},
						data: confirmedData,
					},
					{
						name: "Completed",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#10B981",
						},
						data: completedData,
					},
					{
						name: "Pending",
						type: "bar",
						stack: "total",
						itemStyle: {
							color: "#F59E0B",
							borderRadius: [6, 6, 0, 0],
						},
						data: pendingData,
					},
				],
			};
		} else {
			const revenueData = executives.map((e) => ({
				value: e.totalAmount,
				itemStyle: {
					color: e.color,
					borderRadius: [6, 6, 0, 0],
				},
			}));

			option = {
				tooltip: {
					trigger: "axis",
					axisPointer: { type: "shadow" },
					formatter: (params: any) => {
						const item = params[0];
						return `
							<div style="padding: 4px 6px;">
								<div style="font-weight: 600; color: #1e293b;">${item.name}</div>
								<div style="color: #059669; font-weight: 700; margin-top: 4px;">৳${item.value.toLocaleString()} BDT</div>
							</div>
						`;
					},
				},
				grid: {
					left: "3%",
					right: "4%",
					bottom: "8%",
					top: "10%",
					containLabel: true,
				},
				xAxis: {
					type: "category",
					data: names,
					axisLine: { lineStyle: { color: "#cbd5e1" } },
					axisLabel: { color: "#475569", fontWeight: "bold" },
				},
				yAxis: {
					type: "value",
					splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
					axisLabel: {
						formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`,
						color: "#94a3b8",
					},
				},
				series: [
					{
						name: "Revenue Generated",
						type: "bar",
						barWidth: 36,
						data: revenueData,
						label: {
							show: true,
							position: "top",
							formatter: (p: any) => `৳${p.value.toLocaleString()}`,
							color: "#334155",
							fontWeight: "bold",
							fontSize: 11,
						},
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
		<div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3 border-b border-slate-100 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<FaUserTie className="text-blue-600 text-base" />
						<h3 className="text-base font-bold text-slate-800">
							Executive Performance Breakdown
						</h3>
					</div>
					<p className="text-xs text-slate-400 mt-1">
						Compare individual executive caseload and generated billing
					</p>
				</div>

				{/* Toggle Switch */}
				<div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
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
						Applications Count
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

			<div ref={chartRef} className="w-full h-[280px]" />
		</div>
	);
}
