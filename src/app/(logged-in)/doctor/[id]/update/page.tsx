import React from "react";
import { Doctor } from "../../types/Type";
import { get } from "@/api/ApiClient";
import { Speciality } from "./types/Types";
import DoctorUpdate from "./components/DoctorUpdate";

interface Props {
	params: { [key: string]: number };
}

const page = async (props: Props) => {
	const params = await props.params;
	const doctorId = params.id;
	// The update form has no schedule fields, so skip the `schedules` collection.
	// Fetched in parallel - these were three sequential awaits, so the page paid
	// the sum of all three round trips before rendering anything.
	const [doctor, specialties, organizationList] = await Promise.all([
		get<Doctor>(`v1/doctor/${doctorId}?includeSchedules=false`) as Promise<any>,
		get<Speciality[]>("v1/doctor/specialties"),
		get<any>("v1/organization"),
	]);
	return (
		<div className="h-screen pl-5 flex flex-col gap-10 pt-4 pb-9">
			<div className="bg-white rounded-xl p-6">
				<DoctorUpdate doctor={doctor?.data} specialties={specialties} organizationList={organizationList} />
			</div>
		</div>
	);
};
export default page;
