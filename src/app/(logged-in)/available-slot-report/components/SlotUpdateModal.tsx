import { Button, Input, InputNumber, message, Modal, Select, Switch, TimePicker } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { slotUpdate } from "../actions/slotUpdate";

const { TextArea } = Input;

export default function SlotUpdateModal({
	slotInfo,
	showModal,
	onCloseModal,
	onUpdate,
	fetchAppointmentTimeSlot,
	fetchParams,
	options,
}: any) {
	console.log(slotInfo);
	// Parse minimum fee from slotInfo
	const minFee = slotInfo?.doctorFee ? parseFloat(slotInfo.doctorFee) : 0;

	const [slotData, setSlotData] = useState<any>({
		startTime: "09:30",
		endTime: "10:00",
		doctorFee: minFee || 1000,
		isActive: true,
		notes: "",
		duration: 30,
		slotType: undefined,
	});

	console.log("slot info", slotInfo);

	// Calculate difference in minutes between start and end
	const diffMinutes = (start: string, end: string) => {
		const startMins = dayjs(start, "HH:mm").hour() * 60 + dayjs(start, "HH:mm").minute();
		const endMins = dayjs(end, "HH:mm").hour() * 60 + dayjs(end, "HH:mm").minute();
		let diff = endMins - startMins;
		if (diff < 0) diff += 24 * 60; // handle overnight slots
		return diff;
	};

	// Add minutes to time string "HH:mm"
	const addMinutes = (time: string, minsToAdd: number) => {
		return dayjs(time, "HH:mm").add(minsToAdd, "minute").format("HH:mm");
	};

	useEffect(() => {
		if (slotInfo) {
			const start = slotInfo.slotStart || "09:30";
			const end = slotInfo.slotEnd || "10:00";
			const durationMins = diffMinutes(start, end);
			const fee = parseFloat(slotInfo.doctorFee) || 1000;
			setSlotData({
				startTime: start,
				endTime: end,
				doctorFee: fee < minFee ? minFee : fee,
				isActive: slotInfo.isActive ?? true,
				notes: "",
				duration: durationMins,
				slotType: slotInfo?.slotInfo?.slotType,
			});
		}
	}, [slotInfo, minFee]);

	const onStartTimeChange = (time: any) => {
		const newStart = time?.format("HH:mm") || "";
		const newEnd = addMinutes(newStart, slotData.duration);
		setSlotData((prev: any) => ({
			...prev,
			startTime: newStart,
			endTime: newEnd,
		}));
	};

	const onEndTimeChange = (time: any) => {
		const newEnd = time?.format("HH:mm") || "";
		const newDuration = diffMinutes(slotData.startTime, newEnd);
		setSlotData((prev: any) => ({
			...prev,
			endTime: newEnd,
			duration: newDuration,
		}));
	};

	const onDurationChange = (value: number | null) => {
		if (value === null || value < 1) return; // minimum 1 minute
		const newEnd = addMinutes(slotData.startTime, value);
		setSlotData((prev: any) => ({
			...prev,
			duration: value,
			endTime: newEnd,
		}));
	};

	const onDoctorFeeChange = (value: number | null) => {
		setSlotData((prev: any) => ({
			...prev,
			doctorFee: value,
		}));
	};

	const onSelectChange = (field: string, value: any) => {
		setSlotData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleUpdate = async () => {
		if (!slotData.slotType) {
			message.error("Please select a slot type");
			return;
		}

		const payload: any = {
			startTime: dayjs(slotData.startTime, "HH:mm").format("HH:mm"),
			endTime: dayjs(slotData.endTime, "HH:mm").format("HH:mm"),
			doctorFee: Number(slotData.doctorFee),
			isActive: Boolean(slotData.isActive),
			slotType: slotData.slotType,
		};

		if (!slotData.isActive && slotData.notes?.trim()) {
			payload.notes = slotData.notes.trim();
		}
		console.log("Payload:", payload);
		onUpdate?.(payload);

		const res = await slotUpdate(slotInfo?.appointmentSlotId, payload);
		console.log(res);
		if (res?.success) {
			fetchAppointmentTimeSlot(fetchParams.doctorId, fetchParams.branchId, fetchParams.startDate, fetchParams.endDate);
			message.success(res.message);
			onCloseModal();
		} else {
			message.error(res.message);
		}
	};

	return (
		<Modal title="Update Slot" open={showModal} onCancel={onCloseModal} footer={null} width={500}>
			<div className="space-y-4">
				<div>
					<label className="block mb-1">Start Time</label>
					<TimePicker
						use12Hours
						format="hh:mm A"
						value={dayjs(slotData.startTime, "HH:mm")}
						onChange={onStartTimeChange}
						style={{ width: "100%" }}
					/>
				</div>

				<div>
					<label className="block mb-1">End Time</label>
					<TimePicker
						use12Hours
						format="hh:mm A"
						value={dayjs(slotData.endTime, "HH:mm")}
						onChange={onEndTimeChange}
						style={{ width: "100%" }}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<p className="text-sm">
						Slot Type <span className="text-red-600">*</span>
					</p>
					<Select
						size="large"
						placeholder="Select Slot Type"
						className="min-w-[200px]"
						value={slotData.slotType}
						onChange={(value: any) => onSelectChange("slotType", value)}
					>
						{options.appointmentType.map((type: any) => (
							<Select.Option value={type.value} disabled={type.disabled}>
								{type.label}
							</Select.Option>
						))}
					</Select>
				</div>

				<div>
					<label className="block mb-1">Duration (minutes)</label>
					<InputNumber min={1} value={slotData.duration} onChange={onDurationChange} style={{ width: "100%" }} />
				</div>

				<div>
					<label className="block mb-1">Doctor Fee (৳)</label>
					<InputNumber value={slotData.doctorFee} style={{ width: "100%" }} onChange={onDoctorFeeChange} />
				</div>

				<div>
					<label className="block mb-1">Is Active</label>
					<Switch
						checked={slotData.isActive}
						onChange={(checked: any) =>
							setSlotData((prev: any) => ({
								...prev,
								isActive: checked,
								notes: "",
							}))
						}
						checkedChildren="Active"
						unCheckedChildren="Inactive"
					/>
				</div>

				{!slotData.isActive && (
					<div>
						<label className="block mb-1">Notes</label>
						<TextArea
							value={slotData.notes}
							onChange={(e: any) =>
								setSlotData((prev: any) => ({
									...prev,
									notes: e.target.value,
								}))
							}
							rows={3}
							placeholder="Provide reason for inactivation..."
						/>
					</div>
				)}

				<div className="mt-6 flex justify-end">
					<Button type="primary" onClick={handleUpdate}>
						Update
					</Button>
					<Button onClick={onCloseModal} style={{ marginLeft: 8 }}>
						Cancel
					</Button>
				</div>
			</div>
		</Modal>
	);
}
