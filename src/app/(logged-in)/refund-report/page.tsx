"use client";

import { getOptions } from "@/app/actions/getOptions";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { emptyOptions, Options } from "@/app/types/Options";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SummaryCard from "../payment-report/components/SummaryCard";
import { getRefundReport } from "./actions/getRefundReport";
import RefundReportTable from "./components/RefundReportTable";
import RefundTableFilter from "./components/RefundTableFilter";

export default function RefundReportPage({ searchParams }: any) {
	const router = useRouter();
	const page = searchParams.page ?? 0;
	const status = searchParams.status ?? "";
	const search = searchParams.search ?? "";
	const startDate = searchParams.startDate;
	const endDate = searchParams.endDate;
	const paymentStatus = searchParams.paymentStatus ?? "";
	const appointmentType = searchParams.appointmentType ?? "";
	const branch = searchParams.branch ?? "";
	const doctor = searchParams.doctor ?? "";
	const criteria = searchParams.criteria ?? "";
	const appointmentId = searchParams.appointmentId ?? "";
	const phoneNumber = searchParams.phoneNumber ?? "";
	const createdByType = searchParams.createdByType ?? "";
	const executive = searchParams.executive ?? "";
	const orderBy = searchParams.orderBy ?? "";
	const sortBy = searchParams.sortBy ?? "";
	// One key for every filter in the URL, so the table refetches whenever a search
	// box or dropdown changes it -- the same behaviour as the Appointment page. The
	// Search button stays as an explicit refresh.
	const queryKey = JSON.stringify(searchParams);

	const [refundData, setRefundData] = useState<any>([]);
	const [pagination, setPagination] = useState<any>(null);
	const [stats, setStats] = useState<any>({
		totalFee: 0,
		totalVatAmount: 0,
		totalDiscount: 0,
		totalDueAmount: 0,
		totalPaidAmount: 0,
		totalRefundAmount: 0,
		totalBalance: 0,
	});
	const [loading, setLoading] = useState<any>(null);
	const [options, setOptions] = useState<Options>(emptyOptions);
	const fetchRefundReport = async () => {
		setLoading(true);
		try {
			const res: any = await getRefundReport(
				page,
				status,
				search,
				startDate,
				endDate,
				paymentStatus,
				appointmentType,
				branch,
				doctor,
				appointmentId,
				criteria,
				createdByType,
				executive
			);
			console.log("REFUND REPORT", res);
			console.log(res);
			if (res?.success) {
				setRefundData(res.data.appointments);
				setPagination(res.data.pagination);
				setStats(res.data.totalPaymentSummary);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchRefundReport();
	}, [queryKey]);
	useEffect(() => {
		getOptions().then(setOptions);
	}, []);
	return (
		<ContentWrapper>
			<RefundTableFilter
				page={page}
				status={status}
				search={search}
				startDate={startDate}
				endDate={endDate}
				paymentStatus={paymentStatus}
				appointmentType={appointmentType}
				branch={branch}
				doctor={doctor}
				criteria={criteria}
				appointmentId={appointmentId}
				phoneNumber={phoneNumber}
				executive={executive}
				createdByType={createdByType}
				fetchData={fetchRefundReport}
				options={options}
			/>
			<div className="mt-2">
				<SummaryCard data={stats} loading={loading} />
			</div>
			<RefundReportTable
				data={refundData}
				pagination={pagination}
				loading={loading}
				url={`/refund-report?${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}${
					doctor ? `&doctorId=${doctor}` : ""
				}`}
			/>
		</ContentWrapper>
	);
}
