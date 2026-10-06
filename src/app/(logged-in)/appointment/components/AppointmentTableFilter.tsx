import FilterButton from "@/app/components/buttons/FilterButton";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
// import Button from "@/app/components/buttons/Button";
import DateRangeFilter from "@/app/components/filters/DateRangeFilter";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import SearchFromList from "@/app/components/filters/SearchFromList";
import UserSearchFilter from "@/app/components/filters/UserSearchFilter";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { useEffect, useState } from "react";
import { getBranchList } from "../../branch/actions/GetBranchList";
import { getDoctorList } from "../actions/getDoctorList";
import ExportButton from "./ExportButton";
import DoctorDebounceSelect from "./DebouncedSearchableSelectProps";
import { getAllPackages } from "../../appointment-booking/actions/getAllPackages";

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
	isMigrated,
	notes,
	router,
	packageId,
	options,
}: any) {
	const appointmentStatusOptions = [
		{ value: "", label: "Appointment Status", disabled: true },
		...options.appointmentStatus,
	];
	const paymentStatusOptions = [{ value: "", label: "Payment Status" }, ...options.paymentStatus];
	const appointmentTypeOptions = [{ value: "", label: "Appointment Type" }, ...options.appointmentType];
	const criteriaOptions = [{ value: "", label: "Criteria" }, ...options.criteria];
	const createdByTypeOptions = [{ value: "", label: "All" }, ...options.createdByType];

	const [branchList, setBranchList] = useState<any[]>([]);
	const [doctorList, setDoctorList] = useState<any[]>([]);
	const [packageList, setPackageList] = useState<any>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getBranchList(0, "", 20);
				if (res?.success) {
					setBranchList([
						{ value: "", label: "Select Branch" },
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

	const fetchPackages = async () => {
		// setLoadingPatient(true);
		try {
			const res: any = await getAllPackages();
			if (res?.success) {
				const options = res.data
					.filter((p: any) => p.isActive)
					.map((p: any) => ({
						label: p.description, // 👈 shown in dropdown
						value: String(p.id), // 👈 stored value
					}));
				setPackageList([{ value: "", label: "Select Package" }, ...options]);
			} else {
				setPackageList([]);
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchPackages();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getDoctorList(0);
				if (res?.success) {
					setDoctorList([
						{ value: "", label: "Select Doctor" },
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
			createdFrom,
			createdTo,
			isMigrated,
			notes,
			packageId,
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
			<div className="w-full flex gap-2 flex-wrap items-center">
				{!isReporting && (
					<SearchableDropDown
						url={generateFilterUrl(["branch"])}
						prop="branch"
						selectionOption={branchList}
						width={180}
					/>
				)}
				<DoctorDebounceSelect
					url={generateFilterUrl(["doctor"])}
					prop="doctor"
					// selectionOption={doctorList}
					width={180}
				/>
				<SearchableDropDown
					url={generateFilterUrl(["isMigrated"])}
					prop="isMigrated"
					selectedValue="All"
					selectionOption={[
						{
							label: "Migrated",
							value: "true",
						},
						{
							label: "New",
							value: "false",
						},
						{
							label: "All",
							value: "all",
						},
					]}
					width={150}
				/>

				<SearchableDropDown
					url={generateFilterUrl(["packageId"])}
					prop="packageId"
					selectedValue=""
					selectionOption={packageList}
					width={150}
				/>

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
							width={160}
						/>
						<SearchableDropDown
							url={generateFilterUrl(["createdByType"])}
							prop="createdByType"
							selectionOption={createdByTypeOptions}
							width={140}
						/>
						<SearchableDropDown
							url={generateFilterUrl(["criteria"])}
							prop="criteria"
							selectionOption={criteriaOptions}
							width={140}
						/>
						<SearchableDropDown
							url={generateFilterUrl(["appointmentType"])}
							prop="appointmentType"
							selectionOption={appointmentTypeOptions}
							width={150}
						/>
						<SearchableDropDown
							url={generateFilterUrl(["paymentStatus"])}
							prop="paymentStatus"
							selectionOption={paymentStatusOptions}
							width={160}
						/>
						<UserSearchFilter url={generateFilterUrl(["executive"])} prop="executive" />
					</>
				)}

				<DateRangeFilter
					fromDateParam="startDate"
					toDateParam="endDate"
					url={generateFilterUrl(["startDate", "endDate"])}
				/>
				<DateRangeFilter
					fromDateParam="createdFrom"
					toDateParam="createdTo"
					url={generateFilterUrl(["createdFrom", "createdTo"])}
					inputPlaceholder={["Created From", "Created To"]}
				/>
				{!isReporting && (
					<>
						<SearchableDropDown
							url={generateFilterUrl(["sortBy"])}
							prop="sortBy"
							selectionOption={sortByOptions}
							width={160}
						/>
						<SearchableDropDown
							url={generateFilterUrl(["orderBy"])}
							prop="orderBy"
							selectionOption={orderByOptions}
							width={150}
						/>
					</>
				)}
				<SearchFromList url={generateFilterUrl(["notes"])} prop="notes" placeholder="Search by notes" />
				<FilterButton onButtonClick={() => fetchData()} />
				<ResetFilterButton onButtonClick={() => fetchData()} />
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
					isMigrated={isMigrated}
					packageId={packageId}
				/>

				{/* make the button color blueish shade */}
				<div className="flex justify-end ">
					<RolePermissionChecker tag="appointment" name="create">
						<button
							className="bg-blue-500 hover:bg-blue-600 flex items-center justify-center rounded-md px-4 py-1.5 cursor-pointer text-white font-medium text-sm whitespace-nowrap transition-colors text-blue-500 hover:text-white	"
							onClick={() => router?.push(`/appointment-booking`)}
							title="Book Appointment"
						>
							Book Appointment
						</button>
					</RolePermissionChecker>
				</div>
			</div>
		</FilterWrapper>
	);
}
