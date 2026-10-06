"use client";

import DropdownWithSearch from "@/app/components/formInputs/DropdownWithSearch";
import TextAreaField from "@/app/components/formInputs/inputFields/TextAreaField";
import { Modal, message } from "antd";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAllPackages } from "../../appointment-booking/actions/getAllPackages";
import { getExecutiveList } from "../actions/getExecutiveList";
import { updateAppointment } from "../actions/updateAppointment";
import RolePermissionChecker from "../../../components/rolepermission/HandleRolePermission";

export default function AppointmentUpdateModal({ appointment, isModalOpen, onClose, fetchData, options }: any) {
	// console.log("Appointment for update:", appointment.paymentSummary.paymentStatus);
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const scheduleDate = new Date(appointment?.scheduleStart);
	scheduleDate.setHours(0, 0, 0, 0);

	const isTodayBefore = today < scheduleDate;
	const isPaid = ["FullDiscount", "Paid", "PartialDiscount"].includes(appointment?.paymentSummary?.paymentStatus);
	console.log("Is today before appointment date?", isTodayBefore, isPaid);

	const appointmentStatusOptions = [
		{ value: "", label: "Appointment Status", disabled: true },
		...options.appointmentStatus,
	];
	const appointmentTypeOptions = [{ value: "", label: "Appointment Type" }, ...options.appointmentType];
	const criteriaOptions = [{ value: "", label: "Criteria" }, ...options.criteria];

	const [details, setDetails] = useState({
		appointmentType: "",
		criteria: "",
		status: "",
		notes: "",
		createdById: "",
		packageId: "",
	});

	const [formErrors, setFormErrors] = useState<any>(null);
	const [loading, setLoading] = useState(false);

	const [packages, setPackages] = useState<any[]>([]);
	const [packagesLoading, setPackagesLoading] = useState(false);

	const [executives, setExecutives] = useState<any[]>([]);
	const [executivesLoading, setExecutivesLoading] = useState(false);
	// Guards against a slow earlier request landing after a newer one and
	// overwriting the fresher results.
	const executiveFetchId = useRef(0);

	// The executive already on the appointment. Seeded from the appointment
	// itself rather than the fetched list, so the name renders straight away and
	// keeps rendering even while the user searches for somebody else -- or if
	// that staff account has since been deactivated and no longer comes back
	// from the search.
	const selectedExecutiveOption = useMemo(() => {
		const current = appointment?.createdBy;
		if (!current?.id) return null;

		return {
			value: current.id,
			label: current.fullName || current.nickName || `#${current.id}`,
		};
	}, [appointment?.createdBy]);

	// Keep the selected option in the list no matter what the search returned,
	// otherwise antd has no label for the current value and falls back to
	// showing the raw id.
	const executiveOptions = useMemo(() => {
		if (!selectedExecutiveOption) return executives;

		const rest = executives.filter((option) => option.value !== selectedExecutiveOption.value);
		return [selectedExecutiveOption, ...rest];
	}, [executives, selectedExecutiveOption]);

	// The package already on the appointment, kept in the list whatever the API
	// returns: only active packages come back, so a retired one would otherwise
	// leave the Select with a value it has no label for.
	const selectedPackageOption = useMemo(() => {
		if (!appointment?.packageId) return null;

		return {
			value: appointment.packageId,
			label: appointment.packageName || `#${appointment.packageId}`,
		};
	}, [appointment?.packageId, appointment?.packageName]);

	const packageOptions = useMemo(() => {
		if (!selectedPackageOption) return packages;
		if (packages.some((option) => option.value === selectedPackageOption.value)) return packages;

		return [selectedPackageOption, ...packages];
	}, [packages, selectedPackageOption]);

	const fetchPackages = useCallback(async () => {
		setPackagesLoading(true);

		try {
			const res: any = await getAllPackages();

			setPackages(
				res?.success
					? res.data
							.filter((pkg: any) => pkg.isActive)
							.map((pkg: any) => ({
								value: pkg.id,
								label: pkg.description || pkg.name,
							}))
					: [],
			);
		} catch (error: any) {
			setPackages([]);
			message.error("Failed to fetch package list");
		} finally {
			setPackagesLoading(false);
		}
	}, []);

	const fetchExecutives = useCallback(async (search?: string) => {
		const fetchId = ++executiveFetchId.current;
		setExecutivesLoading(true);

		try {
			const res: any = await getExecutiveList(search);
			if (fetchId !== executiveFetchId.current) return;

			setExecutives(
				res?.data?.data?.map((user: any) => ({
					value: user.id,
					label: `${user.firstName} ${user.lastName}`,
				})) || [],
			);
		} catch (error: any) {
			if (fetchId !== executiveFetchId.current) return;
			setExecutives([]);
			message.error("Failed to fetch executive list");
		} finally {
			if (fetchId === executiveFetchId.current) setExecutivesLoading(false);
		}
	}, []);

	const debouncedFetchExecutives = useMemo(() => debounce(fetchExecutives, 400), [fetchExecutives]);

	useEffect(() => () => debouncedFetchExecutives.cancel(), [debouncedFetchExecutives]);

	// 👇 Set appointment values when modal opens or appointment prop changes
	useEffect(() => {
		if (appointment && isModalOpen) {
			setDetails({
				appointmentType: appointment.appointmentType || "",
				criteria: appointment.criteria || "",
				status: appointment.status || "",
				notes: "",
				createdById: appointment?.createdBy?.id || "",
				packageId: appointment?.packageId || "",
			});
		}
	}, [appointment, isModalOpen]);

	// Only load staff once the modal is actually open -- this used to run on
	// every appointment list render, whether or not anybody opened the modal.
	useEffect(() => {
		if (!isModalOpen) return;

		debouncedFetchExecutives.cancel();
		fetchExecutives();
		fetchPackages();
	}, [isModalOpen, fetchExecutives, debouncedFetchExecutives, fetchPackages]);

	function handleSelectChange(name: string, value: any) {
		setDetails((prev: any) => ({
			...prev,
			[name]: value,
		}));
	}

	const handleSubmit = async () => {
		setLoading(true);

		const payload = Object.fromEntries(Object.entries(details).filter(([, value]) => value !== "" && value != null));

		const res = await updateAppointment(appointment.id, payload);
		console.log(res);

		if (res?.success) {
			message.success(res.message);
			onClose(); // Close modal
			fetchData(); // Refresh list
		} else {
			message.error(res?.message || "Failed to update appointment.");
			console.error(res);
		}
		setLoading(false);
	};

	return (
		<Modal
			title="Update Appointment"
			open={isModalOpen}
			onCancel={onClose}
			onOk={handleSubmit}
			okText="Update"
			confirmLoading={loading}
		>
			<div className="flex flex-col gap-2">
				<div className="flex flex-col gap-1">
					<DropdownWithSearch
						labelText="Status"
						selectionValue={details.status || ""}
						onSelectChange={(value: string) => handleSelectChange("status", value)}
						selectionOptions={appointmentStatusOptions}
						inputPlaceholder="Select status"
						error={formErrors?.status}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<DropdownWithSearch
						labelText="Appointment Type"
						selectionValue={details.appointmentType || ""}
						onSelectChange={(value: string) => handleSelectChange("appointmentType", value)}
						selectionOptions={appointmentTypeOptions}
						inputPlaceholder="Select appointment type"
						error={formErrors?.appointmentType}
						isRequired={false}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<DropdownWithSearch
						labelText="Criteria"
						selectionValue={details.criteria || ""}
						onSelectChange={(value: string) => handleSelectChange("criteria", value)}
						selectionOptions={criteriaOptions}
						inputPlaceholder="Select criteria"
						error={formErrors?.criteria}
						isRequired={false}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<DropdownWithSearch
						labelText="Package"
						selectionValue={details.packageId || ""}
						onSelectChange={(value: number) => handleSelectChange("packageId", value)}
						selectionOptions={packageOptions}
						inputPlaceholder="Select package"
						isLoading={packagesLoading}
						notFoundContent={packagesLoading ? "Loading..." : "No package found"}
						error={formErrors?.packageId}
						isRequired={false}
					/>
				</div>

				<RolePermissionChecker tag={"appointment"} name={"executive-selection"}>
					<div className="flex flex-col gap-1">
						<DropdownWithSearch
							labelText="Executive"
							selectionValue={details.createdById || ""}
							onSelectChange={(value: string) => handleSelectChange("createdById", value)}
							selectionOptions={executiveOptions}
							inputPlaceholder="Search executive by name"
							onSearch={debouncedFetchExecutives}
							isLoading={executivesLoading}
							notFoundContent={executivesLoading ? "Searching..." : "No executive found"}
							isRequired={false}
						/>
					</div>
				</RolePermissionChecker>

				{/* Notes accumulate, so the ones already on the appointment are shown
				    read-only and the box below only ever adds another one. The server
				    stamps each with its author and time. */}
				{appointment?.notes && (
					<div className="flex flex-col col-span-2 gap-1">
						<label className="text-sm">Previous Notes</label>
						<div className="p-2 overflow-y-auto text-xs text-gray-700 whitespace-pre-wrap border rounded max-h-32">
							{appointment.notes}
						</div>
					</div>
				)}

				<div className="flex flex-col col-span-2 gap-1">
					<TextAreaField
						labelText="Add Note"
						inputName="notes"
						inputValue={details.notes}
						onInputChange={(e: any) => handleSelectChange("notes", e.target.value)}
						inputPlaceholder="e.g., Notes"
						// Per note, not per appointment: the column is TEXT and notes now
						// accumulate, so one entry gets room to say something useful.
						inputMaxLength={500}
						error={formErrors?.notes}
						isRequired={false}
					/>
				</div>
			</div>
		</Modal>
	);
}
