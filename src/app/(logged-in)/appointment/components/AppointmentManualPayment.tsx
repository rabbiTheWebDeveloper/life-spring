import React, {useEffect, useState} from 'react';
import { Modal, message } from 'antd';
import {appointmentManualPayment} from "@/app/(logged-in)/appointment/actions/GetAppointmentList";

const AppointmentManualPayment = ({ paymentModal, setPaymentModal, selectedDetails, options }: any) => {
	// No default method: the list comes from the API, so any hard-coded value
	// here would not match a real entry and would be submitted as-is.
	const [formData, setFormData] = useState({
		paymentAmount: 0,
		discount: 0,
		paymentMethod: '',
		remarks: '',
		transactionId: '',
		payerMobile: '',
		note: '',
	});
	const [duplicateWarning, setDuplicateWarning] = useState<string>('');
	const [noteError, setNoteError] = useState<string>('');

	useEffect(() => {
		if (paymentModal && selectedDetails?.paymentDetails) {
			const { payable, discount } = selectedDetails.paymentDetails;

			setFormData((prev) => ({
				...prev,
				paymentAmount: payable || 0,
				discount: discount || 0,
			}));
		}
	}, [paymentModal, selectedDetails]);

	const [errors, setErrors] = useState<any>({});

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};




	const submitManualPayment = async (confirmDuplicateTransaction: boolean = false) => {
		try {
			if (!confirmDuplicateTransaction) {
				let newErrors: any = {};

				const paymentAmountNum = Number(formData?.paymentAmount);
				const isPaymentAmountMissing = String(formData?.paymentAmount ?? '') === '' || Number.isNaN(paymentAmountNum);
				const amountDue = Number(selectedDetails?.paymentDetails?.payable ?? selectedDetails?.paymentDetails?.remainingAmount ?? 0);
				if (isPaymentAmountMissing || paymentAmountNum < 0 || (paymentAmountNum === 0 && amountDue > 0)) {
					newErrors.paymentAmount = "Payment amount is required.";
				}
				if (!formData?.payerMobile) {
					newErrors.payerMobile = "Mobile is required.";
				} else if (!/^(\+8801[3-9]\d{8})|(01[3-9]\d{8})$/.test(formData.payerMobile)) {
					newErrors.payerMobile = "Invalid mobile number.";
				}
				if (!formData?.paymentMethod) {
					newErrors.paymentMethod = "Payment method is required.";
				}

				if (Object.keys(newErrors).length > 0) {
					setErrors(newErrors);
					return;
				} else {
					setErrors({});
				}
			}

			// Prepare payload
			let payload: any = {
				paymentAmount: formData.paymentAmount,
				discount: formData.discount || 0,
				paymentMethod: formData.paymentMethod,
				remarks: formData.remarks || "",
				transactionId: formData.transactionId || "MANUAL-PAY-" + Date.now(),
				payerMobile: formData.payerMobile,
				note: formData.note || "",
				referenceId: selectedDetails?.id,
				targetType:"appointment",
				confirmDuplicateTransaction,
			};

			const res = await appointmentManualPayment(payload);
			console.log('res is',res)

			if (res?.statusCode === 200) {
				setDuplicateWarning("");
				message.success("Manual payment recorded successfully");
				setPaymentModal(false);
			} else if (res?.statusCode === 409) {
				setDuplicateWarning(res.message);
			} else {
				setDuplicateWarning("");
				message.error(res?.message || "Failed to record payment");
			}
		} catch (error) {
			console.error("Error submitting manual payment:", error);
			message.error("Something went wrong.");
		}
	};

	const handleConfirmDuplicate = async () => {
		if (!formData.note?.trim()) {
			setNoteError("Please explain why this Transaction ID is being reused.");
			return;
		}
		setNoteError("");
		await submitManualPayment(true);
	};


	return (
		<>
		<Modal
			title="Manual Payment Entry"
			open={paymentModal}
			onCancel={() => setPaymentModal(false)}
			onOk={() => submitManualPayment(false)}
			okText="Submit"
			cancelText="Cancel"
		>
			<div className="space-y-4">
				{/* Payment Amount */}

				{selectedDetails?.paymentDetails && (
					<div className="bg-gray-50 p-4 rounded-md border border-gray-200">
						<h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Summary</h3>
						<div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
							<div>
								<span className="font-medium">Fee (excl. VAT):</span>
								<div className="text-gray-900 font-semibold">৳ {selectedDetails.paymentDetails.amount}</div>
							</div>
							<div>
								<span className="font-medium">Discount:</span>
								<div className="text-gray-900 font-semibold">৳ {selectedDetails.paymentDetails.discount}</div>
							</div>
							<div>
								<span className="font-medium">Total Amount:</span>
								<div className="text-primary font-bold">৳ {selectedDetails.paymentDetails.payable}</div>
							</div>
						</div>
					</div>
				)}

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Payment Amount <span className="text-red-500">*</span>
					</label>
					<input
						type="number"
						name="paymentAmount"
						value={formData.paymentAmount}
						onChange={handleChange}
						className={`mt-1 block w-full px-3 py-2 border ${
							errors.paymentAmount ? 'border-red-500' : 'border-gray-300'
						} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
						min={0}
					/>
					{errors.paymentAmount && <p className="text-red-500 text-xs mt-1">{errors.paymentAmount}</p>}
				</div>

				{/* Discount */}
				<div>
					<label className="block text-sm font-medium text-gray-700">Discount</label>
					<input
						type="number"
						name="discount"
						value={formData.discount}
						onChange={handleChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
						min={0}
					/>
				</div>

				{/* Payment Method */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Payment Method <span className="text-red-500">*</span>
					</label>
					<select
						name="paymentMethod"
						value={formData.paymentMethod}
						onChange={handleChange}
						className={`mt-1 block w-full px-3 py-2 border ${
							errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
						} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
					>
						<option value="">Select a method</option>
						{options.paymentMethod
							.filter((method: any) => method.isActive)
							.map(({ value, label }: any) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
					</select>
					{errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod}</p>}
				</div>

				{/* Transaction ID */}
				<div>
					<label className="block text-sm font-medium text-gray-700">Transaction ID</label>
					<input
						type="text"
						name="transactionId"
						value={formData.transactionId}
						onChange={handleChange}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					/>
				</div>

				{/* Payer Mobile */}
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Payer Mobile <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						name="payerMobile"
						value={formData.payerMobile}
						onChange={handleChange}
						placeholder="e.g., +8801XXXXXXXXX"
						className={`mt-1 block w-full px-3 py-2 border ${
							errors.payerMobile ? 'border-red-500' : 'border-gray-300'
						} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
						required
						pattern="(\+8801[3-9]\d{8})|(01[3-9]\d{8})"
						title="Enter a valid Bangladeshi phone number, e.g., +8801XXXXXXXXX or 01XXXXXXXXX"
					/>
					{errors.payerMobile && <p className="text-red-500 text-xs mt-1">{errors.payerMobile}</p>}
				</div>

				{/* Remarks */}
				<div>
					<label className="block text-sm font-medium text-gray-700">Remarks</label>
					<textarea
						name="remarks"
						value={formData.remarks}
						onChange={handleChange}
						rows={3}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					/>
				</div>

				{/* Note */}
				<div>
					<label className="block text-sm font-medium text-gray-700">Note</label>
					<textarea
						name="note"
						value={formData.note}
						onChange={handleChange}
						rows={3}
						className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
					/>
				</div>
			</div>
		</Modal>

		<Modal
			title="Duplicate Transaction ID"
			open={!!duplicateWarning}
			onOk={handleConfirmDuplicate}
			onCancel={() => setDuplicateWarning('')}
			okText="Confirm & Continue"
			cancelText="Cancel"
		>
			<p className="mb-3">{duplicateWarning}</p>
			<label className="block text-sm font-medium text-gray-700">Note (required to reuse this Transaction ID)</label>
			<textarea
				name="note"
				value={formData.note}
				onChange={handleChange}
				rows={3}
				className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
			/>
			{noteError && <p className="text-red-500 text-xs mt-1">{noteError}</p>}
		</Modal>
		</>
	);
};

export default AppointmentManualPayment;
