"use client";

import ModuleChart from "@/app/components/charts/ModuleChart";
import { Checkbox, DatePicker } from "antd";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const { RangePicker } = DatePicker;

const AppointmentChart = ({ appointments }: { appointments: any }) => {
	const [filterStatus, setFilterStatus] = useState<string>("");
	const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>("");
	const [selectedChannel, setSelectedChannel] = useState<string>("");
	const [selectedAppointmentType, setSelectedAppointmentType] = useState<string>("");
	const [selectedFromEmergencyRequest, setSelectedFromEmergencyRequest] = useState<string>("");
	const [selectedHasPackage, setSelectedHasPackage] = useState<string>("");

	const searchParams = useSearchParams();
	const urlParams = Object.fromEntries(searchParams);

	const today = new Date();
	const previous30Days = new Date(today);
	previous30Days.setDate(today.getDate() - 30);
	const from = previous30Days.toISOString().split("T")[0];
	const to = new Date().toISOString().split("T")[0];

	const date: any = urlParams.date || "";
	const router = useRouter();
	const status = urlParams.statusCount;
	const [dateRange, setDateRange] = useState<any | null>(
		date ? [dayjs(date.split(",")[0]), dayjs(date.split(",")[1])] : [dayjs(from), dayjs(to)]
	);

	const appointmentType = urlParams.appointmentType;
	const channel = urlParams.channel;
	const paymentStatus = urlParams.paymentStatusCount;
	const fromEmergencyRequest = urlParams.fromEmergencyRequest;
	const hasPackage = urlParams.hasPackage;

	useEffect(() => {
		const fetchFilteredData = async () => {
			const fromDate = dateRange[0].format("YYYY-MM-DD");
			const toDate = dateRange[1].format("YYYY-MM-DD");
			let url = `/appointment?size=10&page=0`;
			if (filterStatus) url += `&statusCount=${filterStatus}`;
			if (fromDate) url += `&fromCount=${fromDate}`;
			if (toDate) url += `&toCount=${toDate}`;
			if (selectedAppointmentType) url += `&appointmentType=${selectedAppointmentType}`;
			if (selectedChannel) url += `&channel=${selectedChannel}`;
			if (selectedPaymentStatus) url += `&paymentStatusCount=${selectedPaymentStatus}`;
			if (selectedFromEmergencyRequest) url += `&fromEmergencyRequest=${selectedFromEmergencyRequest}`;
			if (selectedHasPackage) url += `&hasPackage=${selectedHasPackage}`;

			console.log("url test", url);

			router.push(url);
		};
		fetchFilteredData();
	}, [
		dateRange,
		router,
		filterStatus,
		selectedHasPackage,
		selectedChannel,
		selectedPaymentStatus,
		selectedAppointmentType,
		selectedFromEmergencyRequest,
	]);

	const handleDateRangeChange = (dates: any | null) => {
		if (dates && dates[0] && dates[1]) {
			setDateRange(dates);
		} else {
			handleClearFilters();
		}
	};

	// const handleStatusChange = (e: any) => {
	// 	setFilterStatus(e.target.value);
	// };

	const handleClearFilters = () => {
		setDateRange([dayjs(from), dayjs(to)]);
		setFilterStatus("");
		setSelectedPaymentStatus("");
		setSelectedChannel("");
		setSelectedAppointmentType("");
		setSelectedFromEmergencyRequest("");
		setSelectedHasPackage("");

		router.push(`/appointment?size=10&page=0`);
	};
	return (
		<div className="py-8 border bg-white rounded-lg">
			<div className="px-8 grid grid-cols-8 gap-4 mb-4">
				<div>
					<select
						value={selectedChannel}
						onChange={(e) => setSelectedChannel(e.target.value)}
						className="border border-primary rounded-md text-sm p-2 w-full focu:outline-none"
					>
						<option value="">Select Channel</option>
						<option value="patientWeb">Patient Web</option>
						<option value="patientApp">Patient App</option>
						<option value="doctorApp">Doctor App</option>
						<option value="doctorWeb">Doctor Web</option>
						<option value="adminWeb">Admin Web</option>
					</select>
				</div>
				<div>
					<select
						value={selectedAppointmentType}
						onChange={(e) => setSelectedAppointmentType(e.target.value)}
						className="border border-primary rounded-md text-sm p-2 w-full focu:outline-none"
					>
						<option value="">Select Appointment Type</option>
						<option value="online">Online</option>
						<option value="offline">Offline</option>
					</select>
				</div>
				<div>
					<select
						value={filterStatus}
						onChange={(e) => setFilterStatus(e.target.value)}
						// onClick={(e: any) => {
						// 	const url = `/doctor?size=10&page=0${e?.target?.value ? `&status=${e.target.value}` : ""}`;
						// 	router.push(url);
						// }}
						className="border border-primary rounded-md text-sm p-2 w-full focu:outline-none"
					>
						<option value="">Select Status</option>
						<option value="Pending">Pending</option>
						<option value="Upcoming">Upcoming</option>
						<option value="Completed">Completed</option>
						<option value="Cancelled">Cancelled</option>
					</select>
				</div>
				<div>
					<select
						value={selectedPaymentStatus}
						onChange={(e) => setSelectedPaymentStatus(e.target.value)}
						className="border border-primary rounded-md text-sm p-2 w-full focu:outline-none"
					>
						<option value="">Payment Status</option>
						<option value="Paid">Paid</option>
						<option value="Unpaid">Unpaid</option>
					</select>
				</div>
				<div>
					<div className="flex items-center gap-3">
						<p className="text-sm">Emergency Request?</p>
						<Checkbox
							checked={selectedFromEmergencyRequest === "true"}
							onChange={(e) => setSelectedFromEmergencyRequest(e.target.checked ? "true" : "")}
						/>
					</div>
				</div>
				<div>
					<div className="flex items-center gap-2">
						<p className="text-sm">Package Used ?</p>
						<Checkbox
							checked={selectedHasPackage === "true"}
							onChange={(e) => setSelectedHasPackage(e.target.checked ? "true" : "")}
						/>
					</div>
				</div>
				<div>
					<RangePicker
						className="h-10 rounded-md border border-primary "
						placeholder={["From Date", "To Date"]}
						onChange={handleDateRangeChange}
						format="YYYY-MM-DD"
						value={dateRange}
					/>
				</div>
				<div>
					<button className="px-2 py-2 text-sm rounded-md bg-red-500 text-white" onClick={handleClearFilters}>
						Clear Filters
					</button>
				</div>
			</div>
			<ModuleChart data={appointments} module="Appointment" />
		</div>
	);
};

export default AppointmentChart;
