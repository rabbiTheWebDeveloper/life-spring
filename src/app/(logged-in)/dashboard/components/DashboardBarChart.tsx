
'use client'

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ChartData } from '../types/Types';

interface Props {
	barChartData: ChartData;
}

const DashboardBarChart = ({ barChartData }: any) => {
	const chartRef = useRef<HTMLDivElement>(null);

	const data = barChartData?.data;

	useEffect(() => {
		if (chartRef.current) {
			const chart = echarts.init(chartRef.current);

			const option = {
				title: {
					// text: 'Patients, Doctors, and Appointments by Month',
					left: 'center',
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'shadow',
					},
				},
				legend: {
					data: ['Patients', 'Doctors', 'Appointments'],
					align: 'left',
				},
				yAxis: {
					type: 'value',
					// name: 'Total',
				},
				xAxis: {
					type: 'category',
					data: data?.months,
				},
				series: [
					{
						name: 'Patients',
						type: 'bar',
						label: {
							show: true,
							position: 'top',
							formatter: '{c}',
						},
						emphasis: {
							focus: 'series',
						},
						data: data?.patients,
						itemStyle: {
							color: '#32C2DE',
						},
					},
					{
						name: 'Doctors',
						type: 'bar',
						label: {
							show: true,
							position: 'top',
							formatter: '{c}',
						},
						emphasis: {
							focus: 'series',
						},
						data: data?.doctors,
						itemStyle: {
							color: '#4763ED',
						},
					},
					{
						name: 'Appointments',
						type: 'bar',
						label: {
							show: true,
							position: 'top',
							formatter: '{c}',
						},
						emphasis: {
							focus: 'series',
						},
						data: data?.appointments,
						itemStyle: {
							color: '#76CC78',
						},
					},
				],
			};

			chart.setOption(option);
		}
	}, [data]);

	return <div className="w-auto" ref={chartRef} style={{ height: '400px' }} />;
};

export default DashboardBarChart;

