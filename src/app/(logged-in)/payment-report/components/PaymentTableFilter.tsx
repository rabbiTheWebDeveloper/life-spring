import FilterButton from "@/app/components/buttons/FilterButton";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import DateRangeFilter from "@/app/components/filters/DateRangeFilter";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import SearchFromList from "@/app/components/filters/SearchFromList";
import UserSearchFilter from "@/app/components/filters/UserSearchFilter";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getDoctorList } from "../../appointment/actions/getDoctorList";
import { getBranchList } from "../../branch/actions/GetBranchList";
import ExportButton from "./ExportButton";

export default function PaymentTableFilter({
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
	transactionId,
	paymentMethod,
	isMigrated,
	paymentFrom,
	paymentTo,
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
	// A filter over history, so retired methods stay selectable.
	const paymentMethodOptions = [{ value: "", label: "Payment Method", disabled: true }, ...options.paymentMethod];

	const router = useRouter();
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

	const generateFilterUrl = (excludeParams: any = [], pageOverride?: any) => {
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
			paymentMethod,
			transactionId,
			paymentFrom,
			paymentTo,
		};

		const query = Object.entries(params)
			.filter(([key, value]: any) => value && !excludeParams.includes(key))
			.map(([key, value]) => `&${key}=${value}`)
			.join("");

		return `payment-report?page=${pageOverride ?? page}${query}`;
	};

	// A new search has to start from the first page. Staying on, say, page 4 while
	// the narrowed result set only has 2 pages leaves the user staring at an empty
	// table. When the page actually changes the parent's effect refetches on its
	// own, so only fire fetchData directly when we are already on page 0.
	const handleSearch = () => {
		if (Number(page) !== 0) {
			router.push(generateFilterUrl([], 0), { scroll: false });
			return;
		}

		fetchData();
	};

	return (
		<FilterWrapper permissionTag="appointment">
			<div className="w-full flex gap-2 flex-wrap items-center">
				<SearchableDropDown
					url={generateFilterUrl(["branch"])}
					prop="branch"
					selectionOption={branchList}
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
					url={generateFilterUrl(["doctor"])}
					prop="doctor"
					selectionOption={doctorList}
					width={180}
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
				<SearchableDropDown
					url={generateFilterUrl(["paymentMethod"])}
					prop="paymentMethod"
					selectionOption={paymentMethodOptions}
					width={160}
					autoWidthDropdown
				/>
				<SearchFromList url={generateFilterUrl(["transactionId"])} prop="transactionId" placeholder="transactionId" />
				<UserSearchFilter url={generateFilterUrl(["executive"])} prop="executive" />
				<DateRangeFilter
					fromDateParam="startDate"
					toDateParam="endDate"
					url={generateFilterUrl(["startDate", "endDate"])}
					inputPlaceholder={["Appt. Date", "To Date"]}
				/>
				<DateRangeFilter
					fromDateParam="paymentFrom"
					toDateParam="paymentTo"
					url={generateFilterUrl(["paymentFrom", "paymentTo"])}
					inputPlaceholder={["Payment From", "Payment To"]}
				/>

				<FilterButton onButtonClick={handleSearch} />
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
					paymentFrom={paymentFrom}
					paymentTo={paymentTo}
					transactionId={transactionId}
					paymentMethod={paymentMethod}
				/>
			</div>
		</FilterWrapper>
	);
}
