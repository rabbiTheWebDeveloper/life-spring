import { Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { updateVat } from "../actions/updateVat";

const { TextArea } = Input;
const { Option } = Select;

const VatUpdateModal = ({ setShowModal, appointment, showModal, setAppointmentDetails, fetchData }: any) => {
	console.log(appointment);
	const [loading, setLoading] = useState<any>(false);
	const [paymentDetails, setPaymentDetails] = useState<any>({
		referenceId: appointment?.id,
		vatPercentage: 0,
	});

	useEffect(() => {
		setPaymentDetails((prev: any) => ({
			...prev,
			vatPercentage: appointment?.paymentSummary?.vatPercentage,
			referenceId: appointment?.id,
		}));
	}, [appointment]);

	const handleChange = (field: string, value: any) => {
		setPaymentDetails((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		const payload = {
			vatPercentage: Number(paymentDetails?.vatPercentage),
		};

		// console.log("Submitting payment:", payload);

		const res = await updateVat(payload, appointment?.id);

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
		setPaymentDetails({
			referenceId: null,
			vatPercentage: null,
		});
		setAppointmentDetails(null);
	};

	return (
		<Modal
			title="Update VAT"
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
					<label className="mb-1">Vat Percentage</label>
					<InputNumber
						size="large"
						style={{ width: "100%" }}
						value={paymentDetails.vatPercentage}
						onChange={(value) => handleChange("vatPercentage", value)}
						min={0}
					/>
				</div>
				{/* <div className="mb-3">
					<label className="mb-1">Remarks</label>
					<TextArea
						name="note"
						rows={3}
						value={paymentDetails.note}
						onChange={(e) => handleChange("note", e.target.value)}
					/>
				</div> */}
			</form>
		</Modal>
	);
};

export default VatUpdateModal;
