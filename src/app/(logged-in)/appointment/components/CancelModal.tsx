"use client";
import cancelAppointment from "@/app/(logged-in)/appointment/actions/CancelAction";
import { Input, message, Modal, Select } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import DoctorDebounceSearch from "./DoctorDebounceSearch";

const { Option } = Select;

interface Props {
	setShowModal: (value: boolean) => void;
	appointmentId: number;
	fetchData: () => void;
}

const CancelModal = ({ setShowModal, appointmentId, fetchData }: Props) => {
	const [reason, setReason] = useState("");
	const [otherReason, setOtherReason] = useState("");
	const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
	const [isModalVisible, setIsModalVisible] = useState(true);
	const router = useRouter();
	const reasons = [
		{ value: "Mistakenly Done", label: "Mistakenly Done" },
		{ value: "Wanted to book another doctor", label: "Wanted to book another doctor" },
		{ value: "Will not be available at that time", label: "Will not be available at that time" },
		{ value: "Other", label: "Other" },
	];

	const handleConfirm = async () => {
		const res: any = await cancelAppointment(appointmentId, {
			reason: reason === "Other" ? otherReason : reason,
			cancelNote:
				reason === "Wanted to book another doctor" && selectedDoctor
					? `Referred to another Doctor - ${selectedDoctor.value}`
					: "",
		});
		if (res?.success) {
			message.success(res?.message);
			setIsModalVisible(false);
			setShowModal(false);
			fetchData();
			handleCancel();
		}
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		setShowModal(false);
	};

	return (
		<Modal
			title="Appointment Cancellation"
			open={isModalVisible}
			onOk={handleConfirm}
			onCancel={handleCancel}
			okText="Confirm"
			cancelText="Cancel"
		>
			<div>
				<Select
					placeholder="Select a reason"
					value={reason}
					onChange={(value) => setReason(value)}
					style={{ width: "100%", marginBottom: 16 }}
				>
					<Option value="">Select a reason</Option>
					{reasons.map((r) => (
						<Select.Option key={r.value} value={r.value}>
							{r.label}
						</Select.Option>
					))}
					{/*<Option value="Other">OTHERS</Option>*/}
				</Select>
				{reason === "Other" && (
					<Input
						placeholder="Please specify"
						value={otherReason}
						onChange={(e) => setOtherReason(e.target.value)}
						required
					/>
				)}
				{reason === "Wanted to book another doctor" && (
					<DoctorDebounceSearch selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
				)}
			</div>
		</Modal>
	);
};

export default CancelModal;
