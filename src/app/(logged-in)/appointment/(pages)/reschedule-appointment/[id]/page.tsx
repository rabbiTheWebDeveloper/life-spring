"use client";
import { useEffect, useState } from "react";

import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import AppointmentReschedule from "@/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/components/AppointmentReschedule";
import { getAppointmentDetails } from "@/app/(logged-in)/appointment/(pages)/reschedule-appointment/[id]/actions/services";
import { getOptions } from "@/app/actions/getOptions";
import { emptyOptions, Options } from "@/app/types/Options";

interface Props {
	params: { [key: string]: number };
}

const AppointmentRescheduleContainer = ({ params }: Props) => {
	const [appointmentData, setAppointmentData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [options, setOptions] = useState<Options>(emptyOptions);

	useEffect(() => {
		getOptions().then(setOptions);
	}, []);

	useEffect(() => {
		const fetchAppointmentDetails = async () => {
			try {
				setLoading(true);
				const data = await getAppointmentDetails(params?.id);

				setAppointmentData(data?.data);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchAppointmentDetails();
	}, [params?.id]);

	if (loading) {
		return <Loader />;
	}

	return (
		<div className="bg-white rounded-xl ">
			<AppointmentReschedule appointmentData={appointmentData} options={options} />
		</div>
	);
};

export default AppointmentRescheduleContainer;
