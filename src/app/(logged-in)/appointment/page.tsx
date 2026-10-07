"use client";
import AppointmentDataTable from "@/app/(logged-in)/appointment/components/AppointmentDataTable";
import { getOptions } from "@/app/actions/getOptions";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { emptyOptions, Options } from "@/app/types/Options";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAppointmentList, getPaymentSummary } from "./actions/GetAppointmentList";
import AppointmentTableFilter from "./components/AppointmentTableFilter";
import SummaryCard from "./components/SummaryCard";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const AppointmentPage = ({ searchParams }: Props) => {
	// const today = dayjs().format("YYYY-MM-DD");
	// const thirtyDaysAgo = dayjs().subtract(30, "days").format("YYYY-MM-DD");
	// USE ROUTER
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
	const isMigrated = searchParams.isMigrated ?? "";
	const createdFrom = searchParams.createdFrom ?? "";
	const createdTo = searchParams.createdTo ?? "";
	const notes = searchParams.notes ?? "";
	const packageId = searchParams.packageId ?? "";
	// Every filter and the search text live in the URL, so the whole query string is the
	// fetch key. Keying on `page` alone left a new search or filter unfetched until
	// something else on the page changed.
	const queryKey = JSON.stringify(searchParams);

	const [loading, setLoading] = useState<boolean>(false);
	const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
	const [options, setOptions] = useState<Options>(emptyOptions);
	// STATE FOR LIST AND PAGINATION
	const [appointmentList, setAppointmentList] = useState<any>(null);
	const [pagination, setPagination] = useState<any>(null);
	const [summary, setSummary] = useState<any>({
		totalFee: 0,
		totalVatAmount: 0,
		totalDiscount: 0,
		totalDueAmount: 0,
		totalPaidAmount: 0,
		totalRefundAmount: 0,
		totalBalance: 0,
	});

	const fetchData = async () => {
		setLoading(true);
		try {
			const res: any = await getAppointmentList(
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
				sortBy,
				orderBy,
				createdFrom,
				createdTo,
				isMigrated,
				notes,
				packageId,
			);
			console.log("DATAAA Rabbi", res?.data);
			// setSummary(res?.data?.totalPaymentSummary);
			// console.log(res?.data?.appointments);
			setAppointmentList(res?.data?.appointments);
			// console.log(res?.data?.pagination);
			setPagination(res?.data?.pagination);
			setLoading(false);
		} catch (error: any) {
			message.error("Failed to Fetch Appointment List");
		}
	};

	const fetchPaymentData = async () => {
		setSummaryLoading(true);
		try {
			const res: any = await getPaymentSummary(
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
				sortBy,
				orderBy,
				createdFrom,
				createdTo,
				isMigrated,
				notes,
				packageId,
			);
			console.log("DATAAA", res?.data);
			setSummary(res?.data);
			setSummaryLoading(false);
		} catch (error: any) {
			message.error("Failed to Fetch Appointment List");
		}
	};

	useEffect(() => {
		fetchPaymentData();
		fetchData();
	}, [queryKey]);

	useEffect(() => {
		getOptions().then(setOptions);
	}, []);
	console.log(appointmentList, "AppointmentList");
	return (
		<ContentWrapper permissionTag="appointment">
			<div className="flex flex-col gap-2 justify-between">
				{/* Filter */}
				<AppointmentTableFilter
					router={router}
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
					orderBy={orderBy}
					sortBy={sortBy}
					fetchData={() => {
						fetchData();
						fetchPaymentData();
					}}
					createdFrom={createdFrom}
					createdTo={createdTo}
					isMigrated={isMigrated}
					notes={notes}
					packageId={packageId}
					options={options}
				/>
			</div>

			<SummaryCard summary={summary} loading={summaryLoading} />
			<AppointmentDataTable
				tableData={appointmentList}
				paginationUrl={`/appointment?${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${
					appointmentType ? `&appointmentType=${appointmentType}` : ""
				}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ""}${startDate ? `&startDate=${startDate}` : ""}${
					endDate ? `&endDate=${endDate}` : ""
				}${branch ? `&branch=${branch}` : ""}${doctor ? `&doctor=${doctor}` : ""}${
					criteria ? `&criteria=${criteria}` : ""
				}${appointmentId ? `&appointmentId=${appointmentId}` : ""}${
					phoneNumber ? `&phoneNumber=${phoneNumber}` : ""
				}${createdByType ? `&createdByType=${createdByType}` : ""}${executive ? `&executive=${executive}` : ""}${
					orderBy ? `&orderBy=${orderBy}` : ""
				}${sortBy ? `&sortBy=${sortBy}` : ""}${isMigrated ? `&isMigrated=${isMigrated}` : ""}${
					createdFrom ? `&createdFrom=${createdFrom}` : ""
				}${createdTo ? `&createdTo=${createdTo}` : ""}${notes ? `&notes=${notes}` : ""}${packageId ? `&packageId=${packageId}` : ""}`}
				paginationData={pagination}
				fetchData={() => {
					fetchData();
					fetchPaymentData();
				}}
				loading={loading}
				options={options}
			/>
		</ContentWrapper>
	);
};

export default AppointmentPage;
