import { get } from "@/api/ApiClient";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import TitleBar from "@/app/components/text/TitleBar";
import { Doctor } from "../types/Type";
import DoctorDetails from "./components/DoctorDetails";
interface Props {
	params: { [key: string]: number };
}

const page = async ({ params }: Props) => {
	const id = params.id;
	// This screen never renders individual schedule rows, so skip the
	// multi-megabyte `schedules` collection - it made this page take seconds.
	const doctor: any = await get<Doctor>(`v1/doctor/${id}?includeSchedules=false`);

	return (
		<ContentWrapper permissionTag="doctor">
			<div className="flex justify-between items-center">
				<TitleBar title={`Details for ${doctor?.data?.name}`} />
			</div>
			<DoctorDetails doctor={doctor?.data} />
		</ContentWrapper>
	);
};

export default page;
