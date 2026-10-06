import SingleDoctorOverview from "@/app/(logged-in)/appointment-booking/components/SingleDoctorOverview";

const DoctorContainer = ({
	doctorsData,
	doctorDetails,
	type,
	setSelectedDoctorId,
	selectedDoctorId,
	paginationUrl,
}: any) => {
	const isSingleDoctorMode = doctorDetails && type === "doctor";

	return (
		<div>
			{isSingleDoctorMode ? (
				<div className="">
					<SingleDoctorOverview doctor={doctorDetails} />
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default DoctorContainer;
