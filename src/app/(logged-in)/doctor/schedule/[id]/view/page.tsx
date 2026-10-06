import { redirect } from "next/navigation";

export default function ScheduleViewPage({ params }: { params: { id: string } }) {
	redirect(`/doctor/schedule/${params.id}`);
}
