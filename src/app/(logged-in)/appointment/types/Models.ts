import { Appointment, AppointmentStatus, PaymentStatus } from "./Types";

export const Appts = {
	isScheduled : (a : Appointment) => a?.status === AppointmentStatus?.SCHEDULED || a?.status === AppointmentStatus?.CONFIRMED,
	isCompleted : (a : Appointment) => a?.status === AppointmentStatus?.COMPLETED,
	isCancelled : (a : Appointment) => a?.status === AppointmentStatus?.CANCELLED,
	isPending : (a : Appointment) => a?.status === AppointmentStatus?.PENDING,

	// Single source of truth for the "Appt. Status" badge text. The Appointment
	// list and the Daily Patient list previously each carried their own copy and
	// had drifted apart, so a call-center confirmation (raw status "Confirmed")
	// rendered differently on the two pages.
	getStatusLabel: (a: any) => {
		if ([AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(a?.status)) {
			return ["Paid", "PartiallyPaid"].includes(a?.paymentSummary?.paymentStatus) ? "Paid-Confirm" : "Confirmed";
		}
		if (a?.status === AppointmentStatus.COMPLETED) {
			return "Visited";
		}
		return a?.status;
	},
}

// Single source of truth for the "Payment Status" badge text. The badge used to
// collapse every non-Paid status to "Unpaid", so a partially paid appointment
// read as "Unpaid" on the detail page, the details card and the reschedule page.
const paymentStatusLabels: Record<PaymentStatus, string> = {
	[PaymentStatus.PAID]: "Paid",
	[PaymentStatus.PARTIALLY_PAID]: "Partially Paid",
	[PaymentStatus.UNPAID]: "Unpaid",
	[PaymentStatus.FULL_DISCOUNT]: "Full Discount",
	[PaymentStatus.DISCOUNT]: "Discount",
	[PaymentStatus.REFUNDED]: "Refunded",
	[PaymentStatus.REFUND_PENDING]: "Refund Pending",
	[PaymentStatus.REFUND_PROCESSING]: "Refund Processing",
	[PaymentStatus.PENDING]: "Pending",
	[PaymentStatus.FAILED]: "Failed",
	[PaymentStatus.CANCELLED]: "Cancelled",
	[PaymentStatus.INITIATED]: "Initiated",
}

export const Payments = {
	isPaid : (p : Appointment) => p.paymentStatus === PaymentStatus.PAID,
	isPartiallyPaid : (p : Appointment) => p?.paymentStatus === PaymentStatus.PARTIALLY_PAID,
	isUnpaid : (p : Appointment) => p.paymentStatus !== PaymentStatus.PAID && p.paymentStatus !== PaymentStatus.PARTIALLY_PAID,
	isFailed : (p : Appointment) => p.paymentStatus === PaymentStatus.FAILED,
	isPending : (p : Appointment) => p.paymentStatus === PaymentStatus.PENDING,
	isInitiated : (p : Appointment) => p.paymentStatus === PaymentStatus.INITIATED,

	getStatusValue: (p: Appointment) => {
		const status = p?.paymentStatus;
		if (!status) return "Unpaid";
		return paymentStatusLabels[status as PaymentStatus] ?? status;
	},
}
