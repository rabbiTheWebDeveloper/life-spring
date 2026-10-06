"use client";

import { getOptions } from "@/app/actions/getOptions";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { emptyOptions, Options } from "@/app/types/Options";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getPaymentReport } from "./actions/getPaymentReport";
import PaymentReportTable from "./components/PaymentReportTable";
import PaymentTableFilter from "./components/PaymentTableFilter";
import SummaryCard from "./components/SummaryCard";

export default function PaymentReportPage({ searchParams }: any) {
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
	const transactionId = searchParams.transactionId ?? "";
	const paymentMethod = searchParams.paymentMethod ?? "";
	const orderBy = searchParams.orderBy ?? "";
	const sortBy = searchParams.sortBy ?? "";
	const isMigrated = searchParams.isMigrated ?? "";
	const paymentFrom = searchParams.paymentFrom;
	const paymentTo = searchParams.paymentTo;
	// One key for every filter in the URL, so the table refetches whenever a search
	// box or dropdown changes it -- the same behaviour as the Appointment page. The
	// Search button stays as an explicit refresh.
	const queryKey = JSON.stringify(searchParams);

	// Every filter has to survive a page change. DataPagination navigates to
	// `${paginationUrl}&page=N`, so anything missing from this URL is dropped the
	// moment the user clicks page 2 -- which is why choosing a Payment Method and
	// then paginating reset it. Keep this list in step with the params
	// PaymentTableFilter writes to the URL.
	const paginationUrl = `/payment-report?${Object.entries({
		search,
		status,
		paymentStatus,
		appointmentType,
		branch,
		doctor,
		criteria,
		appointmentId,
		phoneNumber,
		createdByType,
		executive,
		transactionId,
		paymentMethod,
		isMigrated,
		startDate,
		endDate,
		paymentFrom,
		paymentTo,
		sortBy,
		orderBy,
	})
		.filter(([, value]) => value !== undefined && value !== null && value !== "")
		.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
		.join("&")}`;

	const [paymentData, setPaymentData] = useState<any>([]);
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
			const res: any = await getPaymentReport(
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
				executive,
				transactionId,
				paymentMethod,
				isMigrated,
				paymentFrom,
				paymentTo
			);
			console.log("REFUND REPORT", res);
			console.log(res);
			if (res?.success) {
				setPaymentData(res.data.payments);
				setPagination(res.data.pagination);
				console.log("Payment Summary", res.data.totalPaymentSummary);
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
			<PaymentTableFilter
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
				transactionId={transactionId}
				paymentMethod={paymentMethod}
				isMigrated={isMigrated}
				paymentFrom={paymentFrom}
				paymentTo={paymentTo}
				options={options}
			/>
			 <div className="mt-2">
				<SummaryCard data={stats} loading={loading} />
			</div>
			<PaymentReportTable
				fetchData={fetchRefundReport}
				data={paymentData}
				pagination={pagination}
				loading={loading}
				url={paginationUrl}
				options={options}
			/>
		</ContentWrapper>
	);
}
