"use client";

import { useEffect, useState } from "react";
// import { getDoctorRev } from "./actions/getDoctorRevenue";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import SummaryCard from "../payment-report/components/SummaryCard";
import { getDoctorRev } from "./actions/getDoctorRevenue";
import DoctorRevenueFilter from "./components/DoctorRevenueFilter";
import DoctorRevenueTable from "./components/DoctorRevenueTable";

export default function DoctorRevenuePage({ searchParams }: any) {
	const page = searchParams.page ?? 0;
	const doctorId = searchParams.doctor;
	const startDate = searchParams.startDate;
	const endDate = searchParams.endDate;
	// One key for every filter in the URL, so the table refetches whenever a search
	// box or dropdown changes it -- the same behaviour as the Appointment page. The
	// Search button stays as an explicit refresh.
	const queryKey = JSON.stringify(searchParams);

	const [revenueData, setRevenueData] = useState<any>([]);
	const [pagination, setPagination] = useState<any>(null);
	const [stats, setStats] = useState<any>({
		totalAppointments: "1",
		totalFees: 1000,
	});
	const [loading, setLoading] = useState<any>(null);
	const fetchDoctorRevenueData = async () => {
		setLoading(true);
		try {
			const res: any = await getDoctorRev(page, startDate, endDate, doctorId);
			console.log(res);
			if (res?.success) {
				setRevenueData(res.data.stats);
				setPagination(res.data.pagination);
				// console.log(res.data.totalStats);
				setStats(res.data.totalStats);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchDoctorRevenueData();
	}, [queryKey]);
	return (
		<ContentWrapper>
			<DoctorRevenueFilter
				page={page}
				startDate={startDate}
				endDate={endDate}
				doctor={doctorId}
				fetchData={fetchDoctorRevenueData}
			/>
			<div>
				<h1 className="text-xl text-center font-bold mt-4 mb-2">Financial Summary</h1>
				<SummaryCard data={stats} />
			</div>
			<DoctorRevenueTable
				data={revenueData}
				pagination={pagination}
				url={`/doctor-revenue?${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}${
					doctorId ? `&doctorId=${doctorId}` : ""
				}`}
			/>
		</ContentWrapper>
	);
}
