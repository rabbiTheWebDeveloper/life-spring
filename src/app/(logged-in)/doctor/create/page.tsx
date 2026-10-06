import { get } from "@/api/ApiClient";

import DoctorCreate from "./components/DoctorCreate";
import { Speciality } from "./types/Types";

const page = async () => {
	const specialties = await get<Speciality[]>("v1/doctor/specialties");
	const organizationList = await get<any>("v1/organization");
	return <DoctorCreate specialties={specialties} organizationList={organizationList} />;
};

export default page;
