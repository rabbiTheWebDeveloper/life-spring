"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as echarts from "echarts";
import { DailyApplicationData } from "../data/sampleDashboardData";
import { FaChartLine, FaCheckCircle, FaFire, FaMoneyBillWave, FaCalendarDay } from "react-icons/fa";

interface Props {
	data: DailyApplicationData[];
}

export default function DailyApplicationGraph({ data }: Props) {
	const chartRef = useRef<HTMLDivElement>(null);
	const chartInstance = useRef<echarts.ECharts | null>(null);
	const [timeRange, setTimeRange] = useState<"all" | "14d" | "7d">("all");

	const filteredData = useMemo(() => {
		if (timeRange === "7d") {
			return data.slice(-7);
		}
		if (timeRange === "14d") {
			return data.slice(-14);
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
		if (!chartRef.current || filteredData.length === 0) return;

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
				backgroundColor: "rgba(255, 255, 255, 0.98)",
				borderColor: "#e2e8f0",
				borderWidth: 1,
				extraCssText: "box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12); border-radius: 12px;",
			},
			legend: {
				data: ["Total Applications", "Confirmed", "Daily Revenue (BDT)"],
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
				data: dates,
				boundaryGap: false,
				axisLine: { lineStyle: { color: "#e2e8f0" } },
				axisLabel: { color: "#475569", fontSize: 11, fontWeight: 600 },
			},
			yAxis: [
				{
					type: "value",
					name: "Applications",
					nameTextStyle: { color: "#64748b", fontSize: 11, fontWeight: 600 },
					splitLine: { lineStyle: { type: "dashed", color: "#f1f5f9" } },
					axisLabel: { color: "#94a3b8" },
				},
				{
					type: "value",
					name: "Revenue (BDT)",
					nameTextStyle: { color: "#64748b", fontSize: 11, fontWeight: 600 },
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
					symbolSize: 7,
					itemStyle: { color: "#134014" },
					lineStyle: { width: 3, color: "#134014" },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "rgba(19, 64, 20, 0.22)" },
							{ offset: 1, color: "rgba(19, 64, 20, 0.0)" },
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
					itemStyle: { color: "#059669" },
					lineStyle: { width: 2.5, color: "#059669" },
					areaStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "rgba(5, 150, 105, 0.18)" },
							{ offset: 1, color: "rgba(5, 150, 105, 0.0)" },
						]),
					},
					data: confValues,
				},
				{
					name: "Daily Revenue (BDT)",
					type: "bar",
					yAxisIndex: 1,
					barWidth: 14,
					itemStyle: {
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: "rgba(13, 148, 136, 0.75)" },
							{ offset: 1, color: "rgba(13, 148, 136, 0.2)" },
						]),
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
		<div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_10px_30px_-10px_rgba(19,64,20,0.04)] flex flex-col gap-5 hover:shadow-[0_15px_35px_-5px_rgba(19,64,20,0.08)] transition-all duration-200">
			{/* Header with Title & Range Filter */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
				<div>
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-[#134014]">
							<FaChartLine className="text-sm" />
						</div>
						<h3 className="text-base font-extrabold text-slate-800">
							Daily Intake & Revenue Trends
						</h3>
					</div>
					<p className="text-xs font-medium text-slate-400 mt-1 pl-10">
						Tracking day-over-day application submissions, confirmation rates, and payments
					</p>
				</div>

				<div className="flex items-center bg-slate-100/90 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60">
					<button
						type="button"
						onClick={() => setTimeRange("all")}
						className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							timeRange === "all"
								? "bg-[#134014] text-white shadow-xs"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						Period View
					</button>
					<button
						type="button"
						onClick={() => setTimeRange("14d")}
						className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							timeRange === "14d"
								? "bg-[#134014] text-white shadow-xs"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						14 Days
					</button>
					<button
						type="button"
						onClick={() => setTimeRange("7d")}
						className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
							timeRange === "7d"
								? "bg-[#134014] text-white shadow-xs"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						7 Days
					</button>
				</div>
			</div>

			{/* Mini Stats Bar */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-200/60">
				<div className="flex flex-col">
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						Applications
					</span>
					<span className="text-xl font-black text-[#134014]">{totalApps}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						Confirmed
					</span>
					<span className="text-xl font-black text-emerald-600">{totalConfirmed}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						Avg / Day
					</span>
					<span className="text-xl font-black text-slate-800">{avgDaily}</span>
				</div>
				<div className="flex flex-col">
					<span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
						Period Revenue
					</span>
					<span className="text-xl font-black text-teal-700">
						৳{totalRevenue.toLocaleString()}
					</span>
				</div>
			</div>

			{/* Main Trend Line/Bar Chart */}
			{filteredData.length === 0 ? (
				<div className="w-full h-[320px] flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-2">
					<FaChartLine className="text-4xl text-slate-300 mb-2" />
					<p className="text-sm font-bold text-slate-700">No Daily Trend Records</p>
					<p className="text-xs text-slate-400 mt-1">
						No appointments found within this date range.
					</p>
				</div>
			) : (
				<div ref={chartRef} className="w-full h-[320px]" />
			)}
		</div>
	);
}
