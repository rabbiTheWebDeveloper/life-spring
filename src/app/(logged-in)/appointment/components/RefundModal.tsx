import DateInputField from "@/app/components/formInputs/DateInputField";
import { Checkbox, Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { applyRefund } from "../actions/refundApply";
import PaymentDateField, {
	confirmUnusualTime,
	isUnusualPaymentTime,
} from "../../../components/formInputs/PaymentDateField";

const { TextArea } = Input;
const { Option } = Select;

const RefundModal = ({ setShowModal, appointment, showModal, setAppointmentDetails, fetchData }: any) => {
	console.log(appointment);
	const [loading, setLoading] = useState<any>(false);
	// null = the server stamps the save moment; non-null only after an explicit Edit.
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [cancelAppointment, setCancelAppointment] = useState<boolean>(false);
	const [paymentDetails, setPaymentDetails] = useState<any>({
		referenceId: appointment?.id,
		refundAmount: 0,
		note: "",
	});

	useEffect(() => {
		setPaymentDetails((prev: any) => ({
			...prev,
			refundAmount: appointment?.paymentSummary?.balance ?? appointment?.paymentSummary?.paidAmount,
			referenceId: appointment?.id,
		}));
	}, [appointment]);

	const handleChange = (field: string, value: any) => {
		setPaymentDetails((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	// What the patient has paid and kept; only a refund of all of it may cancel.
	const held = Number(appointment?.paymentSummary?.balance ?? appointment?.paymentSummary?.paidAmount ?? 0);
	const isFullRefund = held > 0 && Number(paymentDetails.refundAmount ?? 0) >= held - 0.01;
	const cancelChecked = isFullRefund && cancelAppointment;

	const handleSubmit = async (
		e: React.FormEvent | null,
		timeConfirmed: boolean = false,
		cancelConfirmed: boolean = false,
	) => {
		e?.preventDefault();

		if (!timeConfirmed && selectedDate && isUnusualPaymentTime(selectedDate).unusual) {
			confirmUnusualTime("Refund time", selectedDate, () => handleSubmit(null, true, cancelConfirmed));
			return;
		}

		if (cancelChecked && !cancelConfirmed) {
			Modal.confirm({
				title: "Cancel this appointment?",
				content: "The appointment will be cancelled and its slot released. It stays in the list as Cancelled.",
				okText: "Yes, cancel it",
				okButtonProps: { danger: true },
				cancelText: "No",
				onOk: () => handleSubmit(null, true, true),
			});
			return;
		}

		setLoading(true);

		const payload = {
			referenceId: appointment?.id,
			refundAmount: paymentDetails?.refundAmount,
			note: paymentDetails?.note,
			...(cancelChecked ? { cancelAppointment: true } : {}),
			// Left out entirely unless the staff edited it, so the server stamps the time.
			...(selectedDate ? { refundDate: selectedDate } : {}),
		};

		// console.log("Submitting payment:", payload);

		const res = await applyRefund(payload);

		console.log(res);

		if (res?.success) {
			handleCancel();
			fetchData();
			message.success(res.message);
			setShowModal(false);
		} else {
			console.error(res);
		}
		setLoading(false);
	};

	const handleCancel = () => {
		setShowModal(false);
		setCancelAppointment(false);
		setPaymentDetails({
			referenceId: null,
			refundAmount: null,
			note: "",
		});
		setAppointmentDetails(null);
	};

	return (
		<Modal
			title="Refund"
			open={showModal}
			onOk={handleSubmit}
			onCancel={handleCancel}
			okText="Confirm"
			cancelText="Cancel"
			confirmLoading={loading}
			destroyOnClose={true}
		>
			<form onSubmit={handleSubmit}>
				<div className="mb-3">
					<label className="mb-1">Refund</label>
					<InputNumber
						size="large"
						style={{ width: "100%" }}
						value={paymentDetails.refundAmount}
						onChange={(value) => handleChange("refundAmount", value)}
						min={0}
					/>
				</div>
				<div className="mb-2">
					<PaymentDateField label="Refund time" value={selectedDate} onChange={setSelectedDate} />
				</div>
				<div className="mb-3">
					<label className="mb-1">Remarks</label>
					<TextArea
						name="note"
						rows={3}
						value={paymentDetails.note}
						onChange={(e) => handleChange("note", e.target.value)}
					/>
				</div>
				{isFullRefund && (
					<div className="mb-3">
						<Checkbox checked={cancelAppointment} onChange={(e) => setCancelAppointment(e.target.checked)}>
							Also cancel the appointment
						</Checkbox>
					</div>
				)}
			</form>
		</Modal>
	);
};

export default RefundModal;
