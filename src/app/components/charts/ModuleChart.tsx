"use client";

import * as echarts from "echarts";
import { useEffect, useRef } from "react";

const ModuleChart = ({ data = {}, module }: { data: Record<string, number>; module: string }) => {
	const chartRef = useRef<HTMLDivElement>(null);

	// Calculate the total count
	const totalCount = Object.values(data).reduce((sum, value) => sum + (typeof value === "number" ? value : 0), 0);

	useEffect(() => {
		if (chartRef.current && Object.keys(data).length > 0) {
			const chart = echarts.init(chartRef.current);

			// Extract dates and counts from data
			const dates = Object.keys(data);
			const counts = Object.values(data);

			const option = {
				tooltip: {
					trigger: "axis",
					axisPointer: {
						type: "shadow",
					},
				},
				xAxis: {
					type: "category",
					data: dates, // Use the dates for the x-axis
				},
				yAxis: {
					type: "value",
					name: "Count",
				},
				series: [
					{
						name: `${module} Count`,
						type: "bar",
						data: counts, // Use the counts for the series data
						label: {
							show: true,
							position: "top",
							formatter: "{c}",
						},
						itemStyle: {
							color: "#9B468A",
						},
					},
				],
			};

			chart.setOption(option);

			return () => {
				chart.dispose(); // Clean up the chart instance when the component unmounts
			};
		}
	}, [data, module]);

	const dates = Object.keys(data);
	const firstDate = dates[0];
	const lastDate = dates[dates.length - 1];

	return (
		<div className="w-full mb-2 mt-2">
			{/* Display total count */}
			<div className="text-lg font-semibold text-gray-800 text-center">
				Total {module} Count: <span className="text-primary">{totalCount}</span>
				<span className="text-sm">
					<br /> [from <span className="text-[#e283cf]">{firstDate} </span>
					to <span className="text-[#e283cf]">{lastDate}</span>]
				</span>
			</div>
			<div ref={chartRef} style={{ height: "400px" }} />
		</div>
	);
};

export default ModuleChart;
