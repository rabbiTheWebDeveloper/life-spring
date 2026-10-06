import FilterButton from "@/app/components/buttons/FilterButton";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import DateRangeFilter from "@/app/components/filters/DateRangeFilter";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import SearchFromList from "@/app/components/filters/SearchFromList";
import UserSearchFilter from "@/app/components/filters/UserSearchFilter";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import { useEffect, useState } from "react";

import { getDoctorList } from "../../appointment/actions/getDoctorList";
import { getBranchList } from "../../branch/actions/GetBranchList";

export default function RefundTableFilter({
	page,
	status,
	search,
	startDate,
	endDate,
	paymentStatus,
	appointmentType,
	branch,
	doctor,
	criteria,
	appointmentId,
	phoneNumber,
	createdByType,
	executive,
	sortBy,
	orderBy,
	fetchData,
	options,
}: any) {
	const appointmentStatusOptions = [
		{ value: "", label: "Appointment Status", disabled: true },
		...options.appointmentStatus,
	];
	const paymentStatusOptions = [{ value: "", label: "Payment Status", disabled: true }, ...options.paymentStatus];
	const appointmentTypeOptions = [{ value: "", label: "Appointment Type" }, ...options.appointmentType];
	const criteriaOptions = [{ value: "", label: "Criteria" }, ...options.criteria];
	const createdByTypeOptions = [{ value: "", label: "All" }, ...options.createdByType];

	const [branchList, setBranchList] = useState<any[]>([]);
	const [doctorList, setDoctorList] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getBranchList(0, "", 20);
				if (res?.success) {
					setBranchList([
						{ value: "", label: "Select Branch", disabled: true },
						...res.data.data.map((branch: any) => ({
							label: branch.name,
							value: String(branch.id),
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
			search,
			appointmentType,
			paymentStatus,
			startDate,
			endDate,
			status,
			branch,
			doctor,
			criteria,
			appointmentId,
			phoneNumber,
			createdByType,
			executive,
			sortBy,
			orderBy,
		};

		const query = Object.entries(params)
			.filter(([key, value]: any) => value && !excludeParams.includes(key))
			.map(([key, value]) => `&${key}=${value}`)
			.join("");

		return `refund-report?page=${page}${query}`;
	};

	return (
		<FilterWrapper permissionTag="appointment">
			<div className="w-full flex gap-4 flex-wrap">
				<SearchableDropDown
					url={generateFilterUrl(["branch"])}
					prop="branch"
					selectionOption={branchList}
					width={250}
				/>
				<SearchableDropDown
					url={generateFilterUrl(["doctor"])}
					prop="doctor"
					selectionOption={doctorList}
					width={250}
				/>
				<SearchFromList url={generateFilterUrl(["search"])} prop="search" placeholder="Search patient name/phone" />
				<SearchFromList
					url={generateFilterUrl(["appointmentId"])}
					prop="appointmentId"
					placeholder="Search by appointment id"
				/>
				<SearchableDropDown
					url={generateFilterUrl(["status"])}
					prop="status"
					selectionOption={appointmentStatusOptions}
					width={200}
				/>
				<SearchableDropDown
					url={generateFilterUrl(["createdByType"])}
					prop="createdByType"
					selectionOption={createdByTypeOptions}
					width={200}
				/>
				<SearchableDropDown
					url={generateFilterUrl(["criteria"])}
					prop="criteria"
					selectionOption={criteriaOptions}
					width={200}
				/>
				<SearchableDropDown
					url={generateFilterUrl(["appointmentType"])}
					prop="appointmentType"
					selectionOption={appointmentTypeOptions}
				/>
				<SearchableDropDown
					url={generateFilterUrl(["paymentStatus"])}
					prop="paymentStatus"
					selectionOption={paymentStatusOptions}
					width={200}
				/>
				<UserSearchFilter url={generateFilterUrl(["executive"])} prop="executive" />
				<DateRangeFilter
					fromDateParam="startDate"
					toDateParam="endDate"
					url={generateFilterUrl(["startDate", "endDate"])}
				/>

				<FilterButton onButtonClick={() => fetchData()} />
				<ResetFilterButton />
				{/* <ExportButton
					status={status}
					search={search}
					startDate={startDate}
					endDate={endDate}
					paymentStatus={paymentStatus}
					appointmentType={appointmentType}
					branch={branch}
					doctor={doctor}
					criteria={criteria}
					appointmentId={appointmentId}
					phoneNumber={phoneNumber}
					executive={executive}
					createdByType={createdByType}
					orderBy={orderBy}
					sortBy={sortBy}
				/> */}
			</div>
		</FilterWrapper>
	);
}
