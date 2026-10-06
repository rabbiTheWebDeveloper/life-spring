//@ts-ignore
//@ts-nocheck
"use client";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import { getOptions } from "@/app/actions/getOptions";
import { emptyOptions, Options } from "@/app/types/Options";
import { message, Select } from "antd";
import { useEffect, useState } from "react";
import { getBranchList } from "../doctor/schedule/[id]/actions/GetBranchList";
import { getAppointmentWithTimeSlot } from "./actions/getAppointmentTimeSlot";
import DoctorAvailability from "./components/DoctorAvailability";
import DoctorListSearch from "./components/DoctorList";

export default function AvailableSlotReportPage({ searchParams }: any) {
	const [dateRange, setDateRange] = useState<any>({
		startDate: "",
		endDate: "",
		startTime: "",
		endTime: "",
	});
	const doctorsId = searchParams.doctorId ?? "";
	const doctorsName = searchParams.doctorName ?? "";

	const [branchList, setBranchList] = useState<any[]>([]);
	const [branchId, setBranchId] = useState<any>({ id: "Select Branch", name: "Select Branch" });
	const [doctor, setDoctor] = useState<any>("");
	const [doctorAvailablity, setDoctorAvailablity] = useState<any>([]);
	const [loading, setLoading] = useState(false);
	const [options, setOptions] = useState<Options>(emptyOptions);

	useEffect(() => {
		getOptions().then(setOptions);
	}, []);

	useEffect(() => {
		const fetchBranchList = async () => {
			// setLoading(true);
			try {
				const res: any = await getBranchList();
				console.log(res);
				if (res?.success) {
					setBranchList(res?.data);
					console.log(res.data);
				}
			} catch (error) {
				console.error("Error fetching services:", error);
			}
		};
		fetchBranchList();
	}, []);

	useEffect(() => {
		if (doctorsId && doctorsName) {
			setDoctor({
				label: doctorsName,
				value: doctorsId,
			});
		}
	}, [doctorsId, doctorsName]);
	const fetchAppointmentTimeSlot = async (
		doctorId: any = doctor.value,
		branchIdParam: any = branchId?.id,
		startDate: any = dateRange.startDate,
		endDate: any = dateRange.endDate,
		startTime: any = dateRange.startTime,
		endTime: any = dateRange.endTime
	) => {
		if (!startDate || !endDate) {
			message.error("Start date and End date  is required.");
			return;
		}

		const branch = branchIdParam === "Select Branch" ? undefined : branchIdParam;
		setLoading(true);
		try {
			const res: any = await getAppointmentWithTimeSlot(doctorId, branch, startDate, endDate, startTime, endTime);
			// console.log("APPOINTMENT WITH TIME SLOT", res);
			if (res?.success) {
				setDoctorAvailablity(res?.data.availability);
				console.log(res.data);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setDateRange((prev: any) => ({ ...prev, [name]: value }));
	};

	return (
		<ContentWrapper permissionTag="available-appointment-slot">
			<div className="min-h-[800px]">
				<div className="flex items-end gap-4">
					<div className="flex flex-col">
						<label className="text-sm text-gray-700">Start Date</label>
						<input
							type="date"
							name="startDate"
							value={dateRange.startDate}
							onChange={handleDateChange}
							className="border p-2 rounded-md"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-gray-700">End Date</label>
						<input
							type="date"
							name="endDate"
							value={dateRange.endDate}
							onChange={handleDateChange}
							className="border p-2 rounded-md"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-gray-700">From Time</label>
						<input
							type="time"
							name="startTime"
							value={dateRange.startTime}
							onChange={handleDateChange}
							className="border p-2 rounded-md"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-gray-700">To Time</label>
						<input
							type="time"
							name="endTime"
							value={dateRange.endTime}
							onChange={handleDateChange}
							className="border p-2 rounded-md"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-gray-700">Branch</label>
						<Select
							size="large"
							value={JSON.stringify(branchId)}
							onChange={(value) => {
								setBranchId(JSON.parse(value));
								setDoctor("");
							}}
							placeholder="Select Branch"
							showSearch
							filterOption={(input: any, option: any) => option?.children?.toLowerCase().includes(input.toLowerCase())}
						>
							<Select.Option value={JSON.stringify({ id: "Select Branch", name: "Select Branch" })}>
								Select Branch
							</Select.Option>
							{branchList?.map((c) => (
								<Select.Option key={c.id} value={JSON.stringify({ id: c.id, name: c.name })}>
									{c.name}
								</Select.Option>
							))}
						</Select>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-gray-700">Doctor</label>

						<DoctorListSearch
							value={doctor}
							setValue={setDoctor}
							branchId={branchId?.id === "Select Branch" ? undefined : branchId?.id}
						/>
					</div>

					<button className="py-1.5 px-4 bg-green-700 text-white rounded-md" onClick={() => fetchAppointmentTimeSlot()}>
						Search
					</button>
					{/* <button className="py-1.5 px-4 bg-green-700 text-white rounded-md" onClick={() => console.log(doctor)}>
						Test
					</button> */}
					<ResetFilterButton />
				</div>
				<br />
				<DoctorAvailability
					availability={doctorAvailablity}
					doctor={doctor}
					branchId={branchId}
					loading={loading}
					fetchAppointmentTimeSlot={fetchAppointmentTimeSlot}
					fetchParams={{
						doctorId: doctor.value,
						branchId: branchId?.id === "Select Branch" ? undefined : branchId?.id,
						startDate: dateRange.startDate,
						endDate: dateRange.endDate,
						startTime: dateRange.startTime,
						endTime: dateRange.endTime,
					}}
					doctorsId={doctorsId}
					doctorsName={doctorsName}
					options={options}
				/>
				{/* doctorId: any = doctor.value, branchIdParam: any = branchId?.id, startDate: any = dateRange.startDate, endDate:
				any = dateRange.endDate */}
			</div>
		</ContentWrapper>
	);
}
