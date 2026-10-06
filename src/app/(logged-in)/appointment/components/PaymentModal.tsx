import DateInputField from "@/app/components/formInputs/DateInputField";
import { isCashMethod } from "@/helper/paymentMethod";
import { Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { postManualPayment } from "../actions/manualPaymentAction";
import ValidationErrorMessage from "../../../components/formInputs/validationErrorMessage/ValidationErrorMessage";
import InputLabel from "../../../components/formInputs/InputLabel";
import PaymentDateField, {
	confirmUnusualTime,
	isUnusualPaymentTime,
} from "../../../components/formInputs/PaymentDateField";

const { TextArea } = Input;
const { Option } = Select;

const PaymentModal = ({ setShowModal, appointment, showModal, setAppointmentDetails, fetchData, options }: any) => {
	console.log(appointment);
	const [loading, setLoading] = useState<any>(false);
	const [duplicateWarning, setDuplicateWarning] = useState<string>("");
	const [noteError, setNoteError] = useState<string>("");
	const [fieldErrors, setFieldErrors] = useState<any>({});
	// null = the server stamps the save moment; non-null only after an explicit Edit.
	const [paymentDate, setPaymentDate] = useState<string | null>(null);
	const [paymentDetails, setPaymentDetails] = useState<any>({
		referenceId: null,
		targetType: "appointment",
		paymentAmount: null,
		paymentMethod: "",
		remarks: "",
		transactionId: "",
		payerMobile: "",
		note: "",
	});

	useEffect(() => {
		setPaymentDetails((prev: any) => ({
			...prev,
			referenceId: appointment?.id,
			paymentAmount: appointment?.paymentSummary?.dueAmount,
		}));
	}, [appointment]);

	const isCash = isCashMethod(paymentDetails.paymentMethod || "");

	const handleChange = (field: string, value: any) => {
		setPaymentDetails((prev: any) => ({
			...prev,
			[field]: value,
		}));
		setFieldErrors((prev: any) => ({ ...prev, [field]: false }));
	};

	// Cash methods carry no transaction id: fill it in for the staff and lock it, and
	// clear it back out on the way to a method that does need one.
	const handlePaymentMethodChange = (value: string) => {
		const nowCash = isCashMethod(value);
		handleChange("paymentMethod", value);
		if (nowCash) {
			handleChange("transactionId", "Cash");
		} else if (isCash && paymentDetails.transactionId === "Cash") {
			handleChange("transactionId", "");
		}
	};

	const validateFields = () => {
		const errors: any = {
			paymentAmount: !paymentDetails.paymentAmount || paymentDetails.paymentAmount <= 0,
			paymentMethod: !paymentDetails.paymentMethod,
			transactionId: !isCash && !paymentDetails.transactionId?.trim(),
		};
		setFieldErrors(errors);
		return Object.values(errors).every((hasError) => !hasError);
	};

	const submitPayment = async (confirmDuplicateTransaction: boolean = false, timeConfirmed: boolean = false) => {
		if (confirmDuplicateTransaction && !paymentDetails.note?.trim()) {
			setNoteError("Please explain why this Transaction ID is being reused.");
			return;
		}
		setNoteError("");

		if (!confirmDuplicateTransaction && !validateFields()) {
			return;
		}

		if (!confirmDuplicateTransaction && !timeConfirmed && paymentDate && isUnusualPaymentTime(paymentDate).unusual) {
			confirmUnusualTime("Payment time", paymentDate, () => submitPayment(confirmDuplicateTransaction, true));
			return;
		}

		const payload = {
			...paymentDetails,
			referenceId: appointment?.id,
			targetType: "appointment",
			// Left out entirely unless the staff edited it, so the server stamps the time.
			...(paymentDate ? { paymentDate } : {}),
			confirmDuplicateTransaction,
		};

		try {
			setLoading(true);
			const res = await postManualPayment(payload);

			if (res?.success) {
				setDuplicateWarning("");
				handleCancel();
				message.success(res.message);
				fetchData();
				setShowModal(false);
			} else if (res?.statusCode === 409) {
				setDuplicateWarning(res.message);
			} else {
				setDuplicateWarning("");
				message.error(res?.message || "Failed to save payment");
			}
		} catch (err) {
			message.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await submitPayment(false);
	};

	const handleCancel = () => {
		setShowModal(false);
		setDuplicateWarning("");
		setNoteError("");
		setFieldErrors({});
		setPaymentDate(null);
		setPaymentDetails({
			referenceId: null,
			targetType: "appointment",
			paymentAmount: null,
			paymentMethod: "",
			remarks: "",
			transactionId: "",
			payerMobile: "",
			note: "",
		});
		setAppointmentDetails(null);
	};

	return (
		<>
		<Modal
			title="Manual Payment"
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
					<InputLabel labelText="Payment Amount" isRequired />
					<InputNumber
						size="large"
						style={{ width: "100%" }}
						status={fieldErrors.paymentAmount ? "error" : undefined}
						value={paymentDetails.paymentAmount}
						onChange={(value) => handleChange("paymentAmount", value)}
						min={0}
					/>
					{fieldErrors.paymentAmount && (
						<ValidationErrorMessage errorText="Payment amount is required and must be greater than 0." />
					)}
				</div>

				<div className="mb-3">
					<InputLabel labelText="Payment Method" isRequired />
					<Select
						size="large"
						style={{ width: "100%" }}
						status={fieldErrors.paymentMethod ? "error" : undefined}
						value={paymentDetails.paymentMethod || undefined}
						onChange={handlePaymentMethodChange}
						placeholder="Select payment method"
					>
						{options.paymentMethod
							.filter((method: any) => method.isActive)
							.map(({ value, label }: any) => (
								<Option key={value} value={value}>
									{label}
								</Option>
							))}
					</Select>
					{fieldErrors.paymentMethod && <ValidationErrorMessage errorText="Payment method is required." />}
				</div>

				<div className="mb-3">
					<InputLabel labelText="Transaction ID" isRequired />
					<Input
						size="large"
						status={fieldErrors.transactionId ? "error" : undefined}
						value={paymentDetails.transactionId}
						onChange={(e) => handleChange("transactionId", e.target.value)}
						disabled={isCash}
					/>
					{fieldErrors.transactionId && <ValidationErrorMessage errorText="Transaction ID is required." />}
				</div>

				<div className="mb-3">
					<InputLabel labelText="Payer Mobile" />
					<Input
						size="large"
						status={fieldErrors.payerMobile ? "error" : undefined}
						value={paymentDetails.payerMobile}
						onChange={(e) => handleChange("payerMobile", e.target.value)}
					/>
					{fieldErrors.payerMobile && <ValidationErrorMessage errorText="Payer mobile is required." />}
				</div>

				<div className="mb-3">
					<PaymentDateField value={paymentDate} onChange={setPaymentDate} />
				</div>

				<div className="mb-3">
					<InputLabel labelText="Remarks" />
					<TextArea rows={3} value={paymentDetails.remarks} onChange={(e) => handleChange("remarks", e.target.value)} />
					{fieldErrors.remarks && <ValidationErrorMessage errorText="Remarks is required." />}
				</div>
			</form>
		</Modal>

		<Modal
			title="Duplicate Transaction ID"
			open={!!duplicateWarning}
			onOk={() => submitPayment(true)}
			onCancel={() => setDuplicateWarning("")}
			okText="Confirm & Continue"
			cancelText="Cancel"
			confirmLoading={loading}
			zIndex={1050}
		>
			<p className="mb-3">{duplicateWarning}</p>
			<label className="mb-1">Note (required to reuse this Transaction ID)</label>
			<TextArea
				rows={3}
				value={paymentDetails.note}
				onChange={(e) => handleChange("note", e.target.value)}
			/>
			{noteError && <p className="text-red-500 text-xs mt-1">{noteError}</p>}
		</Modal>
		</>
	);
};

export default PaymentModal;
