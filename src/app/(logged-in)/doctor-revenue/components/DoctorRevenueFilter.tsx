import FilterButton from "@/app/components/buttons/FilterButton";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import DateRangeFilter from "@/app/components/filters/DateRangeFilter";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import { useEffect, useState } from "react";
import { getDoctorList } from "../../appointment/actions/getDoctorList";
import ExportButton from "./ExportButton";

export default function DoctorRevenueFilter({ page, startDate, endDate, doctor, fetchData }: any) {
	const [doctorList, setDoctorList] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getDoctorList(0);
				if (res?.success) {
					setDoctorList([
						{ value: "", label: "Select Doctor", disabled: true },
						...res.data.doctors.map((doctor: any) => ({
							label: doctor.name,
							value: String(doctor.id),
						})),
					]);
				} else {
					throw new Error(res?.message || "Failed to Fetch Organization List");
				}
			} catch (error: any) {
				console.error("Failed to Fetch Organization List");
			}
		};
		fetchData();
	}, []);

	const generateFilterUrl = (excludeParams: any = []) => {
		const params = {
			startDate,
			endDate,
			doctor,
		};

		const query = Object.entries(params)
			.filter(([key, value]: any) => value && !excludeParams.includes(key))
			.map(([key, value]) => `&${key}=${value}`)
			.join("");

		return `/doctor-revenue?page=${page}${query}`;
	};

	return (
		<FilterWrapper permissionTag="appointment">
			<div className="w-full flex gap-4 flex-wrap">
				<SearchableDropDown
					url={`/doctor-revenue?page=${page}${startDate ? `&startDate=${startDate}` : ""}${
						endDate ? `&endDate=${endDate}` : ""
					}`}
					prop="doctor"
					selectionOption={doctorList}
					width={250}
				/>
				<DateRangeFilter
					fromDateParam="startDate"
					toDateParam="endDate"
					url={`/doctor-revenue?page=${page}${doctor ? `&doctor=${doctor}` : ""}`}
				/>
				<FilterButton onButtonClick={() => fetchData()} />

				<ResetFilterButton onButtonClick={() => fetchData()} />

				<ExportButton
					rolePermissionTag="doctor-revenue-report"
					startDate={startDate}
					endDate={endDate}
					doctorId={doctor}
					page={page}
				/>
			</div>
		</FilterWrapper>
	);
}
