"use client";

import InputLabel from "@/app/components/formInputs/InputLabel";
import { toDhakaWallClock } from "@/helper/DhakaTime";
import { isCashMethod } from "@/helper/paymentMethod";
import { Input, InputNumber, message, Modal, Select, Spin, Tooltip } from "antd";
import { MdEdit } from "react-icons/md";
import { useState } from "react";
import PaymentDateField, {
	confirmUnusualTime,
	isUnusualPaymentTime,
} from "../../../components/formInputs/PaymentDateField";

import { getPaymentDetails } from "../actions/getPaymentDetails";
import { updatePaymentAction } from "../actions/updatePaymentAction";

const { TextArea } = Input;
const { Option } = Select;

export default function UpdatePaymentActionButton({ paymentId, fetchData, options }: any) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fetching, setFetching] = useState(false);
	const [duplicateWarning, setDuplicateWarning] = useState<string>("");
	const [noteError, setNoteError] = useState<string>("");
	// The stored time is only sent back when the staff actually changed it.
	const [dateEdited, setDateEdited] = useState(false);

	const [form, setForm] = useState<any>({
		amount: null,
		paymentMethod: "",
		transactionId: "",
		payerMobile: "",
		note: "",
		paymentDate: null,
	});

	// 🔹 Fetch + Open
	const handleOpen = async () => {
		try {
			setFetching(true);
			setOpen(true);
			setDateEdited(false);

			const res = await getPaymentDetails(paymentId);
			console.log(res);

			if (res?.success) {
				const payment = res.data.payment;
				console.log(payment);

				setForm({
					amount: payment.amount,
					paymentMethod: payment.paymentMethod ?? "",
					transactionId: payment.transactionId ?? "",
					payerMobile: payment.payerMobile ?? "",
					note: payment.note ?? payment.appointmentPaymentDetails?.note ?? "",
					// Dhaka wall-clock, so every viewer sees and edits the same digits.
					paymentDate: toDhakaWallClock(payment.actualPaymentDate) || null,
				});
			} else {
				message.error(res?.message || "Failed to load payment details");
				setOpen(false);
			}
		} catch (err) {
			message.error("Failed to load payment details");
			setOpen(false);
		} finally {
			setFetching(false);
		}
	};

	const isCash = isCashMethod(form.paymentMethod || "");

	const handleChange = (field: string, value: any) => {
		setForm((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	// Cash methods carry no transaction id: fill it in for the staff and lock it, and
	// clear it back out on the way to a method that does need one.
	const handlePaymentMethodChange = (value: string) => {
		const nowCash = isCashMethod(value);
		handleChange("paymentMethod", value);
		if (nowCash) {
			handleChange("transactionId", "Cash");
		} else if (isCash && form.transactionId === "Cash") {
			handleChange("transactionId", "");
		}
	};

	const handleSubmit = async (confirmDuplicateTransaction: boolean = false, timeConfirmed: boolean = false) => {
		if (confirmDuplicateTransaction && !form.note?.trim()) {
			setNoteError("Please explain why this Transaction ID is being reused.");
			return;
		}
		setNoteError("");

		if (
			!confirmDuplicateTransaction &&
			!timeConfirmed &&
			dateEdited &&
			form.paymentDate &&
			isUnusualPaymentTime(form.paymentDate).unusual
		) {
			confirmUnusualTime("Payment time", form.paymentDate, () => handleSubmit(confirmDuplicateTransaction, true));
			return;
		}

		const payload = {
			amount: form.amount,
			paymentMethod: form.paymentMethod,
			transactionId: form.transactionId,
			payerMobile: form.payerMobile,
			note: form.note,
			// Untouched means untouched: an unedited form does not rewrite the stored time.
			...(dateEdited ? { paymentDate: form.paymentDate } : {}),
			confirmDuplicateTransaction,
		};

		try {
			setLoading(true);

			const res = await updatePaymentAction(paymentId, payload);

			console.log(res);

			if (res?.success) {
				setDuplicateWarning("");
				message.success(res.message || "Payment updated");
				fetchData?.();
				handleClose();
			} else if (res?.statusCode === 409) {
				setDuplicateWarning(res.message);
			} else {
				setDuplicateWarning("");
				message.error(res?.message || "Update failed");
			}
		} catch (err) {
			message.error("Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const handleClose = () => {
		setOpen(false);
		setDuplicateWarning("");
		setNoteError("");
		setDateEdited(false);
		setForm({
			amount: null,
			paymentMethod: "",
			transactionId: "",
			payerMobile: "",
			note: "",
			paymentDate: null,
		});
	};

	return (
		<>
			{/* 🔘 Button */}
			<Tooltip title="Update Payment">
				<div
					className="bg-blue-500 hover:bg-blue-600 text-white p-1 rounded-md cursor-pointer flex items-center justify-center"
					onClick={handleOpen}
				>
					<MdEdit size={16} />
				</div>
			</Tooltip>

			{/* 🪟 Modal */}
			<Modal
				title="Update Payment"
				open={open}
				onOk={() => handleSubmit(false)}
				onCancel={handleClose}
				okText="Update"
				cancelText="Cancel"
				confirmLoading={loading}
				destroyOnClose
			>
				{fetching ? (
					<div className="flex justify-center py-10">
						<Spin />
					</div>
				) : (
					<>
						<div className="mb-3">
							<label>Amount</label>
							<InputNumber
								size="large"
								style={{ width: "100%" }}
								value={form.amount}
								onChange={(value) => handleChange("amount", value)}
								min={0}
							/>
						</div>

						<div className="mb-3">
							<label>Payment Method</label>
							<Select
								size="large"
								style={{ width: "100%" }}
								value={form.paymentMethod}
								onChange={handlePaymentMethodChange}
							>
								{options.paymentMethod
									.filter((method: any) => method.isActive)
									.map(({ value, label }: any) => (
										<Option key={value} value={value}>
											{label}
										</Option>
									))}
							</Select>
						</div>

						<div className="mb-3">
							<InputLabel labelText="Transaction ID" isRequired />
							<Input
								size="large"
								value={form.transactionId}
								onChange={(e) => handleChange("transactionId", e.target.value)}
								disabled={isCash}
							/>
						</div>

						<div className="mb-3">
							<label>Payer Mobile</label>
							<Input
								size="large"
								value={form.payerMobile}
								onChange={(e) => handleChange("payerMobile", e.target.value)}
							/>
						</div>

						<div className="mb-3">
							<PaymentDateField
								value={form.paymentDate}
								onChange={(value) => {
									handleChange("paymentDate", value);
									setDateEdited(true);
								}}
							/>
						</div>

						<div className="mb-3">
							<label>Note</label>
							<TextArea rows={3} value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
						</div>
					</>
				)}
			</Modal>

			{/* 🪟 Duplicate Transaction ID confirm */}
			<Modal
				title="Duplicate Transaction ID"
				open={!!duplicateWarning}
				onOk={() => handleSubmit(true)}
				onCancel={() => setDuplicateWarning("")}
				okText="Confirm & Continue"
				cancelText="Cancel"
				confirmLoading={loading}
				zIndex={1050}
			>
				<p className="mb-3">{duplicateWarning}</p>
				<label>Note (required to reuse this Transaction ID)</label>
				<TextArea rows={3} value={form.note} onChange={(e) => handleChange("note", e.target.value)} />
				{noteError && <p className="text-red-500 text-xs mt-1">{noteError}</p>}
			</Modal>
		</>
	);
}
