import FilterButton from "@/app/components/buttons/FilterButton";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import MultiSearchableDropDown from "@/app/components/filters/MultiSearchableDropDown";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import SearchFromList from "@/app/components/filters/SearchFromList";
import UserSearchFilter from "@/app/components/filters/UserSearchFilter";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import { useEffect, useState } from "react";

import SingleDateFilter from "@/app/components/filters/DateFilter";
import { getBranchList } from "../../branch/actions/GetBranchList";
import { getDoctorList } from "../actions/getDoctorList";
import ExportButton from "./ExportButton";

// Daily Patient List shows every appointment except Cancelled ones. It
// previously defaulted to "Scheduled,Pending", which hid call-center
// confirmations (raw status "Confirmed") along with every Ongoing/Blocked/
// Waiting/Refunded/Completed/Not-Visited appointment.
// These are raw enum values, not an option list: the labels come from the API
// like everywhere else, and the badge text rendered in the table comes from
// Appts.getStatusLabel(), shared with the Appointment page.
const dailyPatientStatuses = [
	"Pending",
	"Scheduled",
	"Confirmed",
	"Ongoing",
	"Blocked",
	"Waiting",
	"Refunded",
	"Completed",
	"Not-Visited",
];

export const dailyPatientDefaultStatus = dailyPatientStatuses.join(",");

export const sortByOptions = [
	{ value: "", label: "Sort by" },
	{ value: "scheduleStart", label: "Appointment Date" },
	{ value: "createdAt", label: "Booking Date" },
];
export const orderByOptions = [
	{ value: "", label: "Order by" },
	{ value: "desc", label: "Descending" },
	{ value: "asc", label: "Ascending" },
];

export default function AppointmentTableFilter({
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
	isReporting = false,
	url = "appointment",
	createdFrom,
	createdTo,
	options,
}: any) {
	const appointmentStatusOptions = [
		{ value: "", label: "Appointment Status", disabled: true },
		...options.appointmentStatus,
	];
	const dailyPatientStatusOptions = options.appointmentStatus.filter((option: any) =>
		dailyPatientStatuses.includes(option.value),
	);
	const paymentStatusOptions = [{ value: "", label: "Payment Status", disabled: true }, ...options.paymentStatus];
	const appointmentTypeOptions = [
		{ value: "", label: "Appointment Type", disabled: true },
		...options.appointmentType,
	];
	const criteriaOptions = [{ value: "", label: "Criteria", disabled: true }, ...options.criteria];
	const createdByTypeOptions = [{ value: "", label: "All" }, ...options.createdByType];

	const [branchList, setBranchList] = useState<any[]>([]);
	const [doctorList, setDoctorList] = useState<any[]>([]);
	const [doctorSearch, setDoctorSearch] = useState("");
	const [debouncedDoctorSearch, setDebouncedDoctorSearch] = useState("");

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
		const fetchDoctor = async () => {
			try {
				const res: any = await getDoctorList(0, debouncedDoctorSearch);
				if (res?.success) {
					setDoctorList([
						{ value: "", label: "Select Doctor", disabled: true },
						...res.data.doctors.map((doctor: any) => ({
							label: doctor.name,
							value: String(doctor.id),
						})),
					]);
				}
			} catch (error) {
				console.error("Failed to Fetch Doctor List");
			}
		};

		fetchDoctor();
	}, [debouncedDoctorSearch]);
	// ✅ Debounce doctor search
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedDoctorSearch(doctorSearch);
		}, 400); // debounce delay

		return () => clearTimeout(timer);
	}, [doctorSearch]);

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
			createdFrom,
			createdTo,
		};

		const query = Object.entries(params)
			.filter(([key, value]: any) => value && !excludeParams.includes(key))
			.map(([key, value]) => `&${key}=${value}`)
			.join("");

		// A changed filter starts at page 0; keeping the current page can land the user on
		// a page the narrowed result set no longer has.
		return `${url}?page=0${query}`;
	};

	return (
		<FilterWrapper permissionTag="appointment">
			<div className="w-full flex gap-4 flex-wrap">
				{!isReporting && (
					<SearchableDropDown
						url={generateFilterUrl(["branch"])}
						prop="branch"
						selectionOption={branchList}
						width={250}
					/>
				)}
				{/* Doctor Search */}
				<SearchableDropDown
					url={generateFilterUrl(["doctor"])}
					prop="doctor"
					selectionOption={doctorList}
					width={250}
					onSearch={(value: string) => setDoctorSearch(value)}
				/>

				{isReporting && (
					<MultiSearchableDropDown
						url={generateFilterUrl(["status"])}
						prop="status"
						selectionOption={dailyPatientStatusOptions}
						selectedValue={dailyPatientDefaultStatus}
						placeholder="Select Status"
						width={220}
					/>
				)}
				{!isReporting && (
					<>
						<SearchFromList url={generateFilterUrl(["search"])} prop="search" placeholder="Search patient name/phone" />
						{/* <SearchFromList
					url={generateFilterUrl(["phoneNumber"])}
					prop="phoneNumber"
					placeholder="Search by patient phone"
				/> */}
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
					</>
				)}

				<SingleDateFilter
					fromDateParam="startDate"
					toDateParam="endDate"
					url={generateFilterUrl(["startDate", "endDate"])}
				/>
				{/* <DateRangeFilter
					fromDateParam="createdFrom"
					toDateParam="createdTo"
					url={generateFilterUrl(["createdFrom", "createdTo"])}
					inputPlaceholder={["Created From", "Created To"]}
				/> */}
				{!isReporting && (
					<>
						<SearchableDropDown
							url={generateFilterUrl(["sortBy"])}
							prop="sortBy"
							selectionOption={sortByOptions}
							width={200}
						/>
						<SearchableDropDown
							url={generateFilterUrl(["orderBy"])}
							prop="orderBy"
							selectionOption={orderByOptions}
							width={200}
						/>
					</>
				)}
				<FilterButton onButtonClick={() => fetchData()} />
				<ResetFilterButton />
				<ExportButton
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
				/>
			</div>
		</FilterWrapper>
	);
}
