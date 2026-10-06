import React, { useMemo, useState } from "react";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { rescheduleAppointment } from "@/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/actions/services";
import { LoadingModal } from "../../../../../appointment-booking/components/AppointmentForm";
import DropdownWithSearch from "../../../../../../components/formInputs/DropdownWithSearch";

const RescheduleForm = ({ selectedSlot, scheduleEnd, scheduleStart, appointmentID, appointmentType, selectedSlotInfo, switchedDoctorId, options }: any) => {
	const [reason, setReason] = useState<any>("");
	const [loading, setLoading] = useState<any>(false);
	// ponytail: appointmentData is already loaded before this component mounts (page.tsx gates on loading), so a lazy initializer is enough
	const [selectedAppointmentType, setSelectedAppointmentType] = useState(() => appointmentType || "face-to-face");
	const router = useRouter();
	const handleSubmit = async (e: React.FormEvent) => {
		setLoading(true);
		e.preventDefault();
		try {
			const payload: any = { appointmentType: selectedAppointmentType, appointmentSlotId: selectedSlot, reason: reason };
			if (switchedDoctorId) {
				payload.doctorId = switchedDoctorId;
			}

			console.log(payload);
			const res: any = await rescheduleAppointment(payload, appointmentID);
			if (res?.statusCode === 200) {
				message.success("Appointment rescheduled successfully!");
				router.push("/appointment?size=10&page=0&status=Upcoming");
			} else {
				message.error(res?.message);
			}
		} catch (error) {
			console.error("Failed to submit the form:", error);
			message.error("Failed to submit the form. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	const appointmentTypeOptions = useMemo(() => {
		const slotType = selectedSlotInfo?.slotInfo?.slotType;

		// "both" is a slot capability, never a bookable appointment type, so it is
		// dropped from the API list the same way it was never hand-typed here.
		return options.appointmentType
			.filter((option: any) => option.value !== "both")
			.map((option: any) => ({
				...option,
				disabled: slotType && slotType !== "both" && slotType !== option.value,
			}));
	}, [selectedSlotInfo, options.appointmentType]);
	return (
		<div>
			<div className=" mt-2">
				<h1 className="text-lg font-semibold text-primary-500 mb-2">Reschedule Reason</h1>
				<form onSubmit={handleSubmit}>
					<div className="grid grid-cols-1 gap-2">
						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Appointment Type"
								selectionValue={selectedAppointmentType || ""}
								onSelectChange={(value: string) => setSelectedAppointmentType(value)}
								selectionOptions={appointmentTypeOptions}
								inputPlaceholder="Select appointment type"
								isRequired={true}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<label className="text-medium text-sm">
								Reason<small className="text-red-500">*</small>
							</label>
							<textarea
								className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
								name="problems"
								placeholder="Enter reason"
								value={reason}
								onChange={(e: any) => setReason(e.target.value)}
								required
							/>
						</div>
					</div>
					<div className="mt-4">
						<button
							type="submit"
							className="text-white text-[16px] font-bold py-1.5 px-4 min-w-fit rounded-lg bg-primary-400"
						>
							Reschedule
						</button>
					</div>
				</form>
			</div>
			<LoadingModal open={loading} />
		</div>
	);
};

export default RescheduleForm;
