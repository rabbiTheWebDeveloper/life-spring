"use client";

import { Modal, DatePicker, Button, message, Tooltip } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { deleteDoctorSchedule } from "../actions/deleteDoctorSchedule";
import { MdSystemUpdateAlt } from "react-icons/md";
import { GrSchedule } from "react-icons/gr";
import DropdownWithSearch from "../../../components/formInputs/DropdownWithSearch";

const { RangePicker } = DatePicker;

export default function DoctorDateRangeModal({ doctor, doctorId, fetchData, fetchDoctorData, selectedDoctor }: any) {
	const [open, setOpen] = useState(false);
	const [dates, setDates] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [branchId, setBranchId] = useState("");

	const handleOpen = async () => {
		await fetchDoctorData(doctorId, false);
		if (!doctorId) {
			message.error("Doctor not found");
			return;
		}
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
		setDates(null);
		setBranchId("");
	};

	const handleSubmit = async () => {
		if (!dates || dates.length !== 2) {
			message.error("Start date and end date are required");
			return;
		}
		if (!branchId) {
			message.error("Selecting a branch required");
			return;
		}

		const payload = {
			startDate: dayjs(dates[0]).format("YYYY-MM-DD"),
			endDate: dayjs(dates[1]).format("YYYY-MM-DD"),
			branchId: branchId,
		};

		try {
			setLoading(true);

			const res = await deleteDoctorSchedule(doctorId, payload);

			if (!res?.success) {
				message.error(res?.message || "Failed to delete schedule");
				return;
			}

			message.success(res.message || "Schedule deleted successfully");
			// fetchData?.();
			handleClose();
		} catch (err) {
			console.error(err);
			message.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			{/* 🔥 BUTTON INSIDE */}
			<Tooltip title="Delete Doctor Schedule">
				<Button danger size="small" icon={<GrSchedule size={16} className="" />} onClick={handleOpen} />
			</Tooltip>

			{/* MODAL */}
			<Modal title="Delete Doctor Schedule" open={open} onCancel={handleClose} footer={null} destroyOnHidden>
				{/* {JSON.stringify(selectedDoctor)} */}
				{/* Doctor Info */}
				<div className="mb-4">
					<h3 className="font-semibold">{doctor?.name}</h3>
					<p className="text-sm text-gray-500">{doctor?.mobile}</p>
				</div>

				{/* Date Range */}
				<div className="mb-4">
					<label className="block mb-1 font-medium">
						Start Date - End Date <span className="text-red-500">*</span>
					</label>
					<RangePicker
						className="w-full"
						value={dates}
						onChange={setDates}
						disabledDate={(current) => current && current < dayjs().startOf("day")}
						size="large"
					/>
				</div>
				<div>
					<label className="block mb-1 font-medium">
						Branch <span className="text-red-500">*</span>
					</label>
					<DropdownWithSearch
						labelText=""
						selectionValue={branchId}
						onSelectChange={setBranchId}
						selectionOptions={[
							{ value: "", label: "Select a branch" },
							...(selectedDoctor?.branches?.map((item: any) => ({
								value: item?.id,
								label: item?.name,
							})) || []),
						]}
						inputPlaceholder="Select a branch"
						isRequired={false}
					/>
				</div>

				{/* Actions */}
				<div className="flex justify-end gap-2 mt-4">
					<Button onClick={handleClose}>Cancel</Button>
					<Button danger type="primary" loading={loading} onClick={handleSubmit}>
						Delete Schedule
					</Button>
				</div>
			</Modal>
		</>
	);
}
