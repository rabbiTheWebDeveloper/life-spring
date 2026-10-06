import { Modal } from "antd";
import AppointmentForm from "../../appointment-booking/components/AppointmentForm";

function toISO8601FromDateAndTime(dateStr: string, timeStr: string) {
	if (!dateStr || !timeStr) {
		throw new Error("Both date and time must be provided");
	}

	// Split time by ":" (e.g., "10:00")
	const [hours, minutes = "00"] = String(timeStr).split(":");

	const formattedTime = `${hours.padStart(2, "0")}:${minutes.padEnd(2, "0")}`;
	const formatted = `${dateStr} ${formattedTime}`;

	// Optional: Validate with Date
	const date = new Date(`${dateStr}T${formattedTime}:00`);
	if (isNaN(date.getTime())) {
		throw new Error("Invalid date or time input");
	}

	return formatted;
}

export default function AppointmentBookingModal({
	slotInfo,
	doctor,
	showModal,
	onCloseModal,
	branchId,
	selectedDate,
	options,
}: any) {
	if (!slotInfo) return null;
	return (
		<div>
			<Modal
				title="Appointment Booking"
				closable={{ "aria-label": "Custom Close Button" }}
				open={showModal}
				onCancel={onCloseModal}
				footer={null}
				width={900}
			>
				<div className="mb-4">
					<p>
						<strong>Selected Doctor: </strong>
						{doctor.label}
					</p>
					<p>
						<strong>Doctor Fee: </strong>
						{slotInfo.doctorFee} BDT
					</p>
					<p>
						<strong>Selected Date: </strong>
						{selectedDate}
					</p>
					<p>
						<strong>Selected Slot: </strong>
						{slotInfo.slotStart} - {slotInfo.slotEnd} ({slotInfo.duration} mins)
					</p>
					{/* {branchId} */}
				</div>
				<AppointmentForm
					doctorId={doctor.value}
					scheduleStart={toISO8601FromDateAndTime(selectedDate, slotInfo.slotStart)}
					scheduleEnd={toISO8601FromDateAndTime(selectedDate, slotInfo.slotEnd)}
					patientData={null}
					branchId={branchId}
					selectedSlot={slotInfo?.slotInfo?.appointmentSlotId}
					options={options}
				/>
			</Modal>
		</div>
	);
}
