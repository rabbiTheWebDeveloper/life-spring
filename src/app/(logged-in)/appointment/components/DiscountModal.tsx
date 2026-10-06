import DateInputField from "@/app/components/formInputs/DateInputField";
import { Input, InputNumber, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { applyDiscount } from "../actions/discountApply";
import PaymentDateField, {
	confirmUnusualTime,
	isUnusualPaymentTime,
} from "../../../components/formInputs/PaymentDateField";

const { TextArea } = Input;
const { Option } = Select;

// Money, not floats: 674 * 0.05 is 33.700000000000003 in JS.
const round2 = (value: number) => Math.round(value * 100) / 100;

const DiscountModal = ({ setShowModal, appointment, showModal, setAppointmentDetails, fetchData }: any) => {
	console.log(appointment);
	// null = the server stamps the save moment; non-null only after an explicit Edit.
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [loading, setLoading] = useState<any>(false);
	const [discountType, setDiscountType] = useState<any>("flat");
	const [discountPercentage, setDiscountPercentage] = useState<any>(0);
	const [paymentDetails, setPaymentDetails] = useState<any>({
		referenceId: appointment?.id,
		discount: 0,
		note: "",
	});

	const handleChange = (field: string, value: any) => {
		setPaymentDetails((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent | null, timeConfirmed: boolean = false) => {
		e?.preventDefault();

		if (!timeConfirmed && selectedDate && isUnusualPaymentTime(selectedDate).unusual) {
			confirmUnusualTime("Discount time", selectedDate, () => handleSubmit(null, true));
			return;
		}

		setLoading(true);

		const payload = {
			referenceId: appointment?.id,
			targetType: "appointment",
			paymentAmount: 0,
			discount: paymentDetails?.discount,
			note: paymentDetails?.note,
			// Left out entirely unless the staff edited it, so the server stamps the time.
			...(selectedDate ? { discountDate: selectedDate } : {}),
		};

		// console.log("Submitting payment:", payload);

		const res = await applyDiscount(payload);

		// console.log(res);

		if (res?.success) {
			handleCancel();
			setShowModal(false);
			fetchData();
		} else {
			console.error(res);
		}
		setLoading(false);
	};

	// The doctor fee, VAT excluded. Everything below is derived from it, because
	// that is what the backend discounts: applyDiscount() does fee - discount and
	// then puts VAT back on top of whatever is left.
	const fee = Number(appointment?.paymentSummary?.fee || 0);
	const vatPercentage = Number(appointment?.paymentSummary?.vatPercentage || 0);
	const discountAmount = Number(paymentDetails?.discount || 0);
	const feeAfterDiscount = Math.max(0, fee - discountAmount);
	const vatAfterDiscount = round2((feeAfterDiscount * vatPercentage) / 100);
	const newPayable = round2(feeAfterDiscount + vatAfterDiscount);

	useEffect(() => {
		if (discountType === "percentage") {
			// Percentage of the fee, not of the payable. Payable already carries VAT
			// (and any earlier discount), so taking the percentage off it and then
			// letting the backend subtract that from the fee charged the discount
			// twice over: 15% off a 2000 fee came out as 1769.25 payable instead of
			// 1785. Rounded the same way the booking form rounds it.
			const calculatedDiscount = Math.round((fee * discountPercentage) / 100);

			setPaymentDetails((prev: any) => ({
				...prev,
				discount: calculatedDiscount,
			}));
		}
	}, [discountType, discountPercentage, fee]);

	const handleCancel = () => {
		setShowModal(false);
		setPaymentDetails({
			referenceId: null,
			discount: null,
			note: "",
		});
		setAppointmentDetails(null);
	};

	return (
		<Modal
			title="Discount"
			open={showModal}
			onOk={handleSubmit}
			onCancel={handleCancel}
			okText="Confirm"
			cancelText="Cancel"
			confirmLoading={loading}
			destroyOnClose={true}
		>
			<form onSubmit={handleSubmit}>
				{/* {JSON.stringify(appointment?.paymentSummary)} */}
				{/* Fee first, then what the discount does to it. Without the fee on
				    screen there was no way to tell what a percentage was taken off,
				    and Payable alone hid that VAT is recalculated on the reduced fee. */}
				<div className="mb-3 text-sm">
					<div className="flex justify-between">
						<span>Fee (excl. VAT)</span>
						<strong>{fee} BDT</strong>
					</div>
					<div className="flex justify-between">
						<span>Discount</span>
						<strong>- {discountAmount} BDT</strong>
					</div>
					<div className="flex justify-between">
						<span>
							VAT {vatPercentage}% (on {feeAfterDiscount} BDT)
						</span>
						<strong>+ {vatAfterDiscount} BDT</strong>
					</div>
					<div className="flex justify-between pt-1 mt-1 border-t">
						<span>New payable</span>
						<strong>{newPayable} BDT</strong>
					</div>
					<div className="flex justify-between mt-2 text-gray-600">
						<span>Current payable</span>
						<span>{appointment?.paymentSummary?.payable} BDT</span>
					</div>
					<div className="flex justify-between text-gray-600">
						<span>Paid</span>
						<span>{appointment?.paymentSummary?.paidAmount} BDT</span>
					</div>
					<div className="flex justify-between text-gray-600">
						<span>Due</span>
						<span>{appointment?.paymentSummary?.dueAmount} BDT</span>
					</div>
				</div>
				<div>
					<label className="mb-1">Discount Type</label>
					<Select
						className="w-full"
						value={discountType}
						onChange={(value) => setDiscountType(value)}
						placeholder="Select Discount Type"
						size="large"
					>
						<Select.Option value="percentage">Percentage</Select.Option>
						<Select.Option value="flat">Flat Amount</Select.Option>
					</Select>
				</div>
				{discountType === "percentage" && (
					<div className="mb-3">
						<label className="mb-1">Discount Percentage</label>
						<InputNumber
							size="large"
							style={{ width: "100%" }}
							value={discountPercentage}
							onChange={(value) => setDiscountPercentage(value)}
							min={0}
							max={100}
						/>
					</div>
				)}
				<div className="mb-3">
					<label className="mb-1">Discount</label>
					<InputNumber
						size="large"
						style={{ width: "100%" }}
						value={paymentDetails.discount}
						onChange={(value) => handleChange("discount", value)}
						min={0}
						// A discount equal to the fee is a legitimate 100% waiver, so the
						// cap is the fee itself, not one taka short of it.
						max={fee || undefined}
						// disabled={discountType === "percentage"}
					/>
				</div>
				<div className="mb-2">
					<PaymentDateField label="Discount time" value={selectedDate} onChange={setSelectedDate} />
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
			</form>
		</Modal>
	);
};

export default DiscountModal;
