"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";
import { DailyApplicationData } from "../data/sampleDashboardData";
import { FaCalendarCheck, FaChartLine, FaCheckCircle, FaFire, FaMoneyBillWave } from "react-icons/fa";

interface Props {
	data: DailyApplicationData[];
}

export default function DailyApplicationGraph({ data }: Props) {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<echarts.ECharts | null>(null);
	const [timeRange, setTimeRange] = useState<"7d" | "14d">("14d");
	const [activeMetric, setActiveMetric] = useState<"applications" | "confirmed" | "revenue">("applications");

	const filteredData = useMemo(() => {
		if (timeRange === "7d") {
			return data.slice(-7);
		}
		return data;
	}, [data, timeRange]);

	const totalApps = useMemo(() => filteredData.reduce((acc, d) => acc + d.applications, 0), [filteredData]);
	const totalConfirmed = useMemo(() => filteredData.reduce((acc, d) => acc + d.confirmed, 0), [filteredData]);
	const totalRevenue = useMemo(() => filteredData.reduce((acc, d) => acc + d.revenue, 0), [filteredData]);
	const avgDaily = useMemo(() => (totalApps / (filteredData.length || 1)).toFixed(1), [totalApps, filteredData]);
	const peakDay = useMemo(() => {
		if (!filteredData.length) return null;
		return [...filteredData].sort((a, b) => b.applications - a.applications)[0];
	}, [filteredData]);

	useEffect(() => {
		if (!chartRef.current) return;

		if (!chartInstance.current) {
			chartInstance.current = echarts.init(chartRef.current);
		}

		const dates = filteredData.map((d) => `${d.dayName} ${d.date.slice(5)}`);
		const appValues = filteredData.map((d) => d.applications);
		const confValues = filteredData.map((d) => d.confirmed);
		const revValues = filteredData.map((d) => d.revenue);

		const option: echarts.EChartsOption = {
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "cross",
					crossStyle: { color: "#94a3b8" },
				},
				backgroundColor: "rgba(255, 255, 255, 0.96)",
				borderColor: "#e2e8f0",
				borderWidth: 1,
				extraCssText: "box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border-radius: 8px;",
			},
			legend: {
				data: ["Total Applications", "Confirmed", "Daily Revenue (BDT)"],
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
				data: dates,
				boundaryGap: false,
				axisLine: { lineStyle: { color: "#cbd5e1" } },
				axisLabel: { color: "#64748b", fontSize: 11 },
			},
			yAxis: [
				{
					type: "value",
					name: "Applications",
					nameTextStyle: { color: "#64748b", fontSize: 11 },
					splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
					axisLabel: { color: "#94a3b8" },
				},
				{
					type: "value",
					name: "Revenue",
					nameTextStyle: { color: "#64748b", fontSize: 11 },
					splitLine: { show: false },
					axisLabel: {
						formatter: (val: number) => `৳${(val / 1000).toFixed(0)}k`,
						color: "#94a3b8",
					},
				},
			],
			series: [
				{
					name: "Total Applications",
					type: "line",
					smooth: true,
					showSymbol: true,
					symbolSize: 6,
					itemStyle: { color: "#3B82F6" },
					lineStyle: { width: 3, color: "#3B82F6" },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "rgba(59, 130, 246, 0.35)" },
							{ offset: 1, color: "rgba(59, 130, 246, 0.0)" },
						]),
					},
					data: appValues,
				},
				{
					name: "Confirmed",
					type: "line",
					smooth: true,
					showSymbol: true,
					symbolSize: 6,
					itemStyle: { color: "#10B981" },
					lineStyle: { width: 2.5, color: "#10B981" },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "rgba(16, 185, 129, 0.25)" },
							{ offset: 1, color: "rgba(16, 185, 129, 0.0)" },
						]),
					},
					data: confValues,
				},
				{
					name: "Daily Revenue (BDT)",
					type: "bar",
					yAxisIndex: 1,
					barWidth: 12,
					itemStyle: {
						color: "rgba(139, 92, 246, 0.4)",
						borderRadius: [4, 4, 0, 0],
					},
					data: revValues,
				},
			],
		};

		chartInstance.current.setOption(option);

		const handleResize = () => chartInstance.current?.resize();
		window.addEventListener("resize", handleResize);

		return () => window.removeEventListener("resize", handleResize);
	}, [filteredData]);

	return (
		<div className="bg-white rounded-2xl border border-slate-200/70 p-6 sm:p-8 shadow-sm flex flex-col gap-5 hover:shadow-md transition-all duration-200">
			{/* Header with Title & Range Filter */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<FaChartLine className="text-blue-600 text-base" />
						<h3 className="text-base font-bold text-slate-800">
							Daily Applications & Revenue Trends
						</h3>
					</div>
					<p className="text-xs text-slate-400 mt-1">
						Real-time intake tracking with confirmation and revenue volume
					</p>
				</div>

				{/* Range Switcher */}
				<div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
					<button
						type="button"
						onClick={() => setTimeRange("7d")}
						className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							timeRange === "7d"
								? "bg-white text-blue-600 shadow-sm"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						Last 7 Days
					</button>
					<button
						type="button"
						onClick={() => setTimeRange("14d")}
						className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							timeRange === "14d"
								? "bg-white text-blue-600 shadow-sm"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						Last 14 Days
					</button>
				</div>
			</div>

			{/* Mini Stats Bar */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
				<div className="flex flex-col">
					<span className="text-[11px] font-semibold text-slate-400">Total Applications</span>
					<span className="text-lg font-bold text-blue-600">{totalApps}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-semibold text-slate-400">Total Confirmed</span>
					<span className="text-lg font-bold text-emerald-600">{totalConfirmed}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-semibold text-slate-400">Daily Average</span>
					<span className="text-lg font-bold text-slate-700">{avgDaily} / day</span>
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-semibold text-slate-400">Period Revenue</span>
					<span className="text-lg font-bold text-purple-600">৳{totalRevenue.toLocaleString()}</span>
				</div>
			</div>

			{/* Main Trend Line/Bar Chart */}
			<div ref={chartRef} className="w-full h-[320px]" />
		</div>
	);
}
