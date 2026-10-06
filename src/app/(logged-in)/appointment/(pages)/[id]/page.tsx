import { get } from "@/api/ApiClient";
import React from "react";
import { Appointment } from "../../types/Types";
import AppointmentInfo from "./components/AppointmentInfo";
import AppointmentDetails from "@/app/(logged-in)/appointment/(pages)/[id]/components/AppointmentDetails";
import AppointmentLogTable from "./components/LogTable";

interface Props {
	params: { [key: string]: number };
}

const page = async ({ params }: Props) => {
	const id = params.id;
	const appointment: any = await get<Appointment>(`v1/appointment/${id}`);
	console.log("APPOINTMENT DETAILS", appointment);
	return (
		<div>
			{/*<AppointmentInfo appointment={appointment?.data} />*/}
			<AppointmentDetails appointment={appointment?.data} />
			{/* <AppointmentLogTable logs={appointment?.data?.statusChangelog} /> */}
		</div>
	);
};

export default page;
