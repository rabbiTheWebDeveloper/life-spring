"use client";
import { getOptions } from "@/app/actions/getOptions";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { emptyOptions, Options } from "@/app/types/Options";
import { message } from "antd";
import { useEffect, useState } from "react";

import { getAppointmentList } from "./actions/GetAppointmentList";
import AppointmentTableFilter, { dailyPatientDefaultStatus } from "./components/AppointmentTableFilter";
import DailyPatientDataTable from "./components/DailyPatientDataTable";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const DailyPatients = ({ searchParams }: Props) => {
	const page = searchParams.page ?? 0;
	// No explicit status filter selected -> default to Confirmed + Pending (exclude Cancelled).
	const status = searchParams.status ?? dailyPatientDefaultStatus;
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
	// Every filter and the search text live in the URL, so the whole query string is the
	// fetch key. Keying on `page` alone left a new search or filter unfetched until
	// something else on the page changed.
	const queryKey = JSON.stringify(searchParams);

	const [loading, setLoading] = useState<boolean>(false);
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
				null,
				null
			);
			console.log(res?.data);
			setSummary(res?.data?.totalPaymentSummary);
			console.log(res?.data?.appointments);
			setAppointmentList(res?.data?.appointments);
			setPagination(res?.data?.pagination);
		} catch (error: any) {
			message.error("Failed to Fetch Appointment List");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [queryKey]);

	useEffect(() => {
		getOptions().then(setOptions);
	}, []);

	return (
		<ContentWrapper permissionTag="appointment">
			<div className="flex flex-col gap-4 justify-between">
				<AppointmentTableFilter
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
					fetchData={fetchData}
					isReporting={true}
					url={"daily-patients"}
					options={options}
				/>
			</div>

			<DailyPatientDataTable
				tableData={appointmentList}
				paginationUrl={`daily-patients?${search ? `&search=${search}` : ""}${status ? `&status=${status}` : ""}${
					appointmentType ? `&appointmentType=${appointmentType}` : ""
				}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ""}${startDate ? `&startDate=${startDate}` : ""}${
					endDate ? `&endDate=${endDate}` : ""
				}`}
				paginationData={pagination}
				fetchData={fetchData}
				isReporting={true}
				loading={loading}
			/>
		</ContentWrapper>
	);
};

export default DailyPatients;
