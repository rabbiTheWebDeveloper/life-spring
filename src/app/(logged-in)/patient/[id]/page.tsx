import { get } from "@/api/ApiClient";
import { Patient } from "../types/Types";
import PatientDetails from "./components/PatientDetails";
import { PatientAppointment } from "./types/Types";
interface Props {
	params: { [key: string]: number };
}

const page = async ({ params }: Props) => {
	const id = params.id;
	const patient: any = await get<Patient>(`v1/patient/${id}`);
	const patientAppointment = await get<PatientAppointment>(`v1/appointment/patient/${id}`);

	return <PatientDetails patient={patient?.data} patientAppointment={patientAppointment} />;
};

export default page;
