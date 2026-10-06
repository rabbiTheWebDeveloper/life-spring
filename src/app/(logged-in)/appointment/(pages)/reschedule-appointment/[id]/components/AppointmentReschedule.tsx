"use client";

import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";
import { getDoctorDetails } from "@/app/(logged-in)/appointment-booking/actions/services";
import BookingDoctor from "@/app/(logged-in)/appointment-booking/components/BookingDoctor";
import BookingDateTimeSelection from "@/app/(logged-in)/appointment-booking/components/BookingDateTimeSelection";
import AppointmentInformation from "@/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/components/AppointmentInformation";
import RescheduleForm from "@/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/components/RescheduleForm";
import DoctorSwitchSelect from "@/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/components/DoctorSwitchSelect";

const AppointmentReschedule = ({ appointmentData, options }: any) => {
	const router = useRouter();
	const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<any>(null);
	const [scheduleStart, setScheduleStart] = useState<any>(null);
	const [scheduleEnd, setScheduleEnd] = useState<any>(null);
	const [selectedSlot, setSelectedSlot] = useState<any>("");
	const [selectedSlotInfo, setSelectedSlotInfo] = useState<any>("");
	const [branchId, setBranchId] = useState<any>("");
	const [isSwitchingDoctor, setIsSwitchingDoctor] = useState(false);
	const [switchedDoctorId, setSwitchedDoctorId] = useState<number | null>(null);

	const fetchDoctors = async (doctorId: any) => {
		try {
			const data = await getDoctorDetails(doctorId);
			setSelectedDoctorDetails(data?.data);
		} catch (error) {
			console.error("Error fetching services:", error);
		}
	};

	useEffect(() => {
		if (appointmentData?.doctor?.id) {
			fetchDoctors(appointmentData.doctor.id);
		}
	}, [appointmentData?.doctor?.id]);

	const handleDoctorChange = async (doctorId: string) => {
		setSelectedSlot("");
		setSelectedSlotInfo("");
		setScheduleStart(null);
		setScheduleEnd(null);
		setBranchId("");
		setSwitchedDoctorId(Number(doctorId));
		await fetchDoctors(doctorId);
		setIsSwitchingDoctor(false);
	};

	return (
		<div className="px-2 py-4">
			<div className="grid grid-cols-12 gap-2">
				<div className="col-span-6 p-2 bg-white rounded-lg shadow-lg">
					<AppointmentInformation appointment={appointmentData} />
				</div>
				<div className="col-span-6 p-2 bg-white rounded-lg shadow-lg">
					<div className="flex items-center justify-between mb-2">
						<h3 className="text-lg font-semibold text-primary-500">Appointed Doctor</h3>
						<button
							type="button"
							onClick={() => setIsSwitchingDoctor((prev) => !prev)}
							className="text-sm font-medium text-primary-500 border border-primary-400 rounded px-3 py-1 hover:bg-primary-50 transition"
						>
							{isSwitchingDoctor ? "Cancel" : "Switch Doctor"}
						</button>
					</div>

					{isSwitchingDoctor && (
						<div className="mb-3">
							<DoctorSwitchSelect onDoctorChange={handleDoctorChange} />
						</div>
					)}

					<BookingDoctor doctor={selectedDoctorDetails} />
					<BookingDateTimeSelection
						doctor={selectedDoctorDetails}
						setScheduleStart={setScheduleStart}
						setScheduleEnd={setScheduleEnd}
						setBranchId={setBranchId}
						branchId={branchId}
						selectedSlot={selectedSlot}
						setSelectedSlot={setSelectedSlot}
						selectedSlotInfo={selectedSlotInfo}
						setSelectedSlotInfo={setSelectedSlotInfo}
					/>
					<RescheduleForm
						selectedSlot={selectedSlot}
						scheduleStart={scheduleStart}
						scheduleEnd={scheduleEnd}
						appointmentID={appointmentData?.id}
						appointmentType={appointmentData?.appointmentType}
						selectedSlotInfo={selectedSlotInfo}
						switchedDoctorId={switchedDoctorId}
						options={options}
					/>
				</div>
			</div>
		</div>
	);
};

export default AppointmentReschedule;
