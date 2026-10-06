"use client";
import { getDoctorDetails } from "@/app/(logged-in)/appointment-booking/actions/services";
import AppointmentForm from "@/app/(logged-in)/appointment-booking/components/AppointmentForm";
import BookingDateTimeSelection from "@/app/(logged-in)/appointment-booking/components/BookingDateTimeSelection";
import DoctorContainer from "@/app/(logged-in)/appointment-booking/components/DoctorContainer";
import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import { useEffect, useState } from "react";

import DoctorDebounceSelect from "./DoctorDebounceSelect";

const Booking = ({
	doctorsData,
	doctorSpeciality,
	search,
	loading,
	patientDetail,
	page,
	type,
	id,
	speciality,
	selectedDoctorId,
	setSelectedDoctorId,
	paginationUrl,
	options,
}: any) => {
	const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<any>(null);
	const [scheduleStart, setScheduleStart] = useState<any>(null);
	const [scheduleEnd, setScheduleEnd] = useState<any>(null);
	const [doctorDetailLoader, setDoctorDetailLoader] = useState(false);
	const [branchId, setBranchId] = useState<any>("");
	const [selectedSlot, setSelectedSlot] = useState<any>("");
	const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
	const [selectedSlotInfo, setSelectedSlotInfo] = useState<any>({});
	// console.log("MAIN", selectedSlot);

	const fetchDoctors = async () => {
		try {
			if (type == "doctor") {
				setDoctorDetailLoader(true);
			}

			const data = await getDoctorDetails(selectedDoctorId);
			console.log(data.data);
			setSelectedDoctorDetails(data?.data);
			setSelectedDoctor({ label: data?.data?.name, value: data?.data?.id });
		} catch (error) {
			console.error("Error fetching services:", error);
		} finally {
			setDoctorDetailLoader(false);
		}
	};
	console.log(selectedDoctorDetails);
	useEffect(() => {
		if (selectedDoctorId) {
			fetchDoctors();
		}
	}, [selectedDoctorId]);

	return (
		<div className="">
			<div className="grid grid-cols-12 gap-2 h-[calc(100vh-100px)]">
				<div className="col-span-7 p-2 bg-white rounded-md shadow overflow-y-auto">
					<div className="mb-4 w-[300px]">
						<p className="text-sm mb-2">Select Doctor</p>
						<DoctorDebounceSelect value={selectedDoctor} setValue={setSelectedDoctor} />
					</div>

					{selectedDoctorDetails && (
						<div className="mt-4">
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
						</div>
					)}
				</div>
				<div className="col-span-5 p-2 bg-white rounded-md shadow overflow-y-auto">
					{loading || doctorDetailLoader ? (
						<Loader />
					) : (
						<DoctorContainer
							doctorsData={doctorsData}
							setSelectedDoctorId={setSelectedDoctorId}
							selectedDoctorId={selectedDoctorId}
							paginationUrl={paginationUrl}
							type={type}
							doctorDetails={selectedDoctorDetails}
						/>
					)}

					{selectedDoctorDetails ? (
						<div>
							<AppointmentForm
								doctorId={selectedDoctorId}
								scheduleEnd={scheduleEnd}
								scheduleStart={scheduleStart}
								patientData={patientDetail}
								branchId={branchId}
								selectedSlot={selectedSlot}
								selectedSlotInfo={selectedSlotInfo}
								options={options}
							/>
						</div>
					) : (
						<div className="flex items-center justify-center">
							<div>
								<span className="text-red-500 text-base">Please select a doctor</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Booking;
