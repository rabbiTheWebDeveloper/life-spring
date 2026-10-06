"use client";

import { createAppointmentBooking, patientByPhone } from "@/app/(logged-in)/appointment-booking/actions/services";
import { getCountryList } from "@/app/(logged-in)/patient/action/getCountry";
import DropdownWithSearch from "@/app/components/formInputs/DropdownWithSearch";
import TextAreaField from "@/app/components/formInputs/inputFields/TextAreaField";
import TextInputField from "@/app/components/formInputs/inputFields/TextInputField";
import InternationalPhone from "@/app/components/formInputs/InternationalPhone";
import { Checkbox, Input, message, Modal, Spin } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { getAllPackages } from "../actions/getAllPackages";

const PROBLEM_LIST = [
	"Depression",
	"OCD",
	"ADHD",
	"Trauma",
	"Stress",
	"Child Development Issue",
	"Bipolar personality disorder",
	"Postpartum depression",
	"Schizophrenia",
	"Relationship issue",
	"Others",
];

function calculateAge(dateString: any) {
	const birthDate = new Date(dateString);
	const today = new Date();

	let age = today.getFullYear() - birthDate.getFullYear();
	const monthDifference = today.getMonth() - birthDate.getMonth();
	const dayDifference = today.getDate() - birthDate.getDate();
	if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
		age--;
	}

	return age;
}

function ageToDob(age: any) {
	const today = new Date(); // Get the current date
	const years = Math.floor(age); // Get the integer part (years)
	const months = Math.round((age - years) * 12); // Get the decimal part and convert to months

	// Calculate the birth year and month
	let birthYear: any = today.getFullYear() - years; // Subtract years from the current year
	let birthMonth: any = today.getMonth() + 1 - months; // Subtract months from the current month

	// Adjust if the month calculation goes below 1 (e.g., negative months after subtracting)
	if (birthMonth <= 0) {
		birthYear -= 1; // Go back one year
		birthMonth += 12; // Adjust month to a positive value
	}

	const birthDate = today.getDate(); // Current day of the month

	// Format the DOB as YYYY-MM-DD
	const dob = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDate).padStart(2, "0")}`;
	return dob;
}

const AppointmentForm = ({ doctorId, patientData, branchId, selectedSlot, selectedSlotInfo, options }: any) => {
	console.log("SELECTED SLOT DETIL", selectedSlotInfo);
	const [patientDetail, setPatientDetail] = useState<any>(null);
	const [selectedAppointmentType, setSelectedAppointmentType] = useState<string | undefined>(undefined);
	const [selectedCriteria, setSelectedCriteria] = useState<string | undefined>(undefined);
	const [selectedPackageId, setSelectedPackageId] = useState<number | undefined>(undefined);
	const [bookingFor, setBookingFor] = useState<any>("self");
	const [formValues, setFormValues] = useState<any>({
		name: "",
		dob: "",
		weight: "",
		gender: "",
		problems: "",
		email: "",
		vatPercentage: "5",
		otherPhone: "",
		otherName: "",
		otherGender: "",
		otherAge: "",
		discount: "0",
		notes: "",
		city: "",
		area: "",
		discountRemarks: "",
	});

	const appointmentTypeOptions = useMemo(() => {
		const slotType = selectedSlotInfo?.slotInfo?.slotType;

		// "both" is a slot capability, never a bookable appointment type, so it is
		// dropped from the API list the same way it was never hand-typed here.
		return options.appointmentType
			.filter((option: any) => option.value !== "both")
			.map((option: any) => ({
				...option,
				disabled: slotType && slotType !== "both" && slotType !== option.value,
			}));
	}, [selectedSlotInfo, options.appointmentType]);

	const bookingCriteriaOptions = options.criteria;

	const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
	const [othersText, setOthersText] = useState<string>("");

	const [loadingPatient, setLoadingPatient] = useState(false);
	const [mobile, setMobile] = useState<string>("");
	const [errors, setErrors] = useState<string>("");
	const [formErrors, setFormErrors] = useState<any>({});
	const [submissionLoading, setSubmissionLoading] = useState<boolean>(false);
	const [discountType, setDiscountType] = useState<"FIXED" | "PERCENTAGE">("FIXED");
	const [discountPercentage, setDiscountPercentage] = useState<string>("");
	const [packageList, setPackageList] = useState<any>([]);
	const [countryList, setCountryList] = useState<any[]>([]);

	const doctorFee = Number(selectedSlotInfo?.doctorFee || 0);
	// console.log(selectedSlotDetails);
	const router = useRouter();

	const genderOptions = [
		{ value: "Male", label: "Male" },
		{ value: "Female", label: "Female" },
	];
	const selfOtherOptions = [
		{ value: "Self", label: "self" },
		{ value: "other", label: "Other" },
	];

	useEffect(() => {
		if (patientData) {
			setMobile(patientData?.mobile ? patientData?.mobile : patientData?.email);
		}
	}, [patientData]);

	const setDiscountValue = (value: number | string) => {
		setFormValues((prev: any) => ({
			...prev,
			discount: String(value),
		}));
	};

	const fetchPackages = async () => {
		// setLoadingPatient(true);
		try {
			const res: any = await getAllPackages();
			if (res?.success) {
				const options = res.data
					.filter((p: any) => p.isActive)
					.map((p: any) => ({
						label: p.description, // 👈 shown in dropdown
						value: p.id, // 👈 stored value
					}));
				setPackageList(options);
				console.log("PACKAGES", options);
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

	const fetchCountries = async () => {
		try {
			const res: any = await getCountryList();
			if (res?.success) {
				setCountryList(res.data.map((c: any) => ({ label: c.name, value: c.name })));
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchCountries();
	}, []);

	// Decides whether city/area are required; the booking API takes it as optional (older backends drop it silently).
	const selectedCountry = formValues.country || "Bangladesh";

	const getPatient = async (mobile: string) => {
		// setLoadingPatient(true);
		try {
			const res: any = await patientByPhone(mobile);
			// console.log(res);
			// console.log("OA", res);
			const detail = res?.data;
			if (detail) {
				setPatientDetail(detail);
				console.log(detail);
				setFormValues({
					name: detail.name || "",
					dob: calculateAge(detail.dob) || "",
					weight: detail.weight || "",
					gender: detail.gender || "",
					problems: "",
					otherPhone: mobile,
					email: detail?.email || "",
					vatPercentage: "5",
					country: detail.country || "",
					city: detail.district,
					area: detail.area,
				});
				setErrors("");
			} else {
				setPatientDetail(null);
				setSelectedProblems([]);
				setOthersText("");
				setFormValues({
					name: "",
					dob: "",
					weight: "",
					gender: "",
					problems: "",
					otherPhone: mobile,
					vatPercentage: "5",
				});
				if (!isNaN(Number(mobile.trim())) && mobile.trim() !== "") {
					setErrors("Patient not found for this mobile number.");
				} else {
					setErrors("Patient not found for this email.");
				}
			}
		} catch (error: any) {
			console.error("Failed to fetch patient details:", error);
			setPatientDetail(null);
			setSelectedProblems([]);
			setOthersText("");
			setFormValues({ name: "", dob: "", weight: "", gender: "", problems: "", vatPercentage: "5" });
			setErrors("Patient not found for this email or mobile number.");
		} finally {
			// setLoadingPatient(false);
		}
	};

	const isValidMobile = (input: string): boolean => {
		const clean = input.trim();
		const e164Regex = /^\+[1-9]\d{7,14}$/; // E.164 format
		return e164Regex.test(clean);
	};

	const isValidEmail = (input: string): boolean => {
		const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regexEmail.test(input.trim());
	};

	useEffect(() => {
		if (!mobile) return;

		const input = mobile.trim();

		if (!isValidMobile(input) && !isValidEmail(input)) {
			return; // don't call API if not valid yet
		}

		const timer = setTimeout(() => {
			getPatient(input);
		}, 700); // ⏱ debounce delay

		return () => clearTimeout(timer);
	}, [mobile]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormValues((prev: any) => ({
			...prev,
			[name]: value,
		}));
	};

	const syncProblemsString = (list: string[], others: string) => {
		const str = list
			.map((p) => (p === "Others" ? (others ? `Others: ${others}` : "Others") : p))
			.join(", ");
		setFormValues((prev: any) => ({ ...prev, problems: str }));
	};

	const handleProblemCheck = (problem: string, checked: boolean) => {
		const updated = checked
			? [...selectedProblems, problem]
			: selectedProblems.filter((p) => p !== problem);
		setSelectedProblems(updated);
		syncProblemsString(updated, othersText);
	};

	const handleOthersTextChange = (text: string) => {
		setOthersText(text);
		syncProblemsString(selectedProblems, text);
	};

	const handleSubmit = async () => {
		if (!selectedSlot) return message.error("Please select an appointment slot.");
		try {
			setSubmissionLoading(true);
			let newErrors: any = {};

			if (!mobile) newErrors.mobile = "Name/Email is required.";
			if (!formValues.name) newErrors.name = "Name is required.";
			if (!formValues.dob) newErrors.dob = "Age  is required.";
			if (!formValues.gender) newErrors.gender = "Gender is required.";
			if (!formValues.email) newErrors.email = "Email is required.";
			if (selectedCountry === "Bangladesh") {
				if (!formValues.city) newErrors.city = "City is required.";
				if (!formValues.area) newErrors.area = "Area is required.";
			}
			if (!selectedAppointmentType) newErrors.appointmentType = "Appointment Type is required.";
			if (!selectedCriteria) newErrors.criteria = "Criteria is required.";
			if (!selectedPackageId) newErrors.packageId = "Package is required.";
			if (Object.keys(newErrors).length > 0) {
				setFormErrors(newErrors);
				return;
			} else {
				setFormErrors({});
			}
			const selectedPackage = packageList.find((pkg: any) => pkg.value === selectedPackageId);
			let payload: any;
			if (bookingFor === "self") {
				payload = {
					appointmentSlotId: selectedSlot,
					doctorId: doctorId,
					// scheduleStart: scheduleStart,
					// scheduleEnd: scheduleEnd,
					appointmentType: selectedAppointmentType,
					criteria: selectedCriteria,
					branchId: branchId,
					payFullAmount: true,
					applyDiscount: Number(formValues.discount) > 0,
					vatPercentage: Number(formValues.vatPercentage),
					gatewayType: "sslcommerz",
					patientDetails: {
						fullName: formValues.name,
						dob: ageToDob(formValues.dob),
						// weight: formValues.weight,
						gender: formValues.gender,
						mobile: mobile,
						email: formValues.email,
						district: formValues.city,
						area: formValues.area,
					},
					discount: Number(formValues.discount) || 0,
					notes: formValues.notes,
					discountRemarks: formValues.discountRemarks,
					packageId: selectedPackage ? Number(selectedPackage.value) : undefined,
					packageName: selectedPackage ? selectedPackage.label : undefined,
				};
			} else {
				payload = {
					appointmentSlotId: selectedSlot,
					doctorId: doctorId,
					// scheduleStart: scheduleStart,
					// scheduleEnd: scheduleEnd,
					appointmentType: selectedAppointmentType,
					criteria: selectedCriteria,
					branchId: branchId,
					payFullAmount: true,
					applyDiscount: Number(formValues.discount) > 0,
					gatewayType: "sslcommerz",
					vatPercentage: Number(formValues.vatPercentage),
					patientDetails: {
						fullName: formValues.otherName,
						dob: ageToDob(formValues.otherAge),
						gender: formValues.otherGender,
						mobile: formValues.otherPhone,
						email: formValues.email,
						district: formValues.city,
						area: formValues.area,
					},
					discount: Number(formValues.discount) || 0,
					notes: formValues.notes,
					discountRemarks: formValues.discountRemarks,
					packageId: selectedPackage ? Number(selectedPackage.value) : undefined,
					packageName: selectedPackage ? selectedPackage.label : undefined,
				};
			}

			if (patientDetail) {
				payload.patientId = patientDetail.id;
			} else {
				// A new patient record is built from these top-level fields, not from
				// patientDetails. district/area were missing here, so every patient
				// booked through this form was saved with an empty address — and the
				// autofill above, which reads the patient record, then had nothing to
				// put in City/Area on their next visit.
				payload.name = formValues.name;
				payload.age = formValues.age;
				payload.gender = formValues.gender;
				payload.mobile = mobile;
				payload.email = formValues.email;
				payload.dob = ageToDob(formValues.dob);
				payload.country = selectedCountry;
				payload.district = formValues.city;
				payload.area = formValues.area;
			}
			if (formValues?.problems) {
				payload.patientDetails.problems = formValues.problems;
			}

			console.log(payload);
			// if (selectedAppointmentType == "online") {
			// 	payload.gatewayType = "sslcommerz";
			// }
			// console.log("TESTTTTTTTT", payload);
			const res: any = await createAppointmentBooking(payload);
			console.log("res is", res);
			if (res?.statusCode === 200) {
				message.success("Appointment created successfully!");
				router.push("/appointment?size=10&page=0");
				setMobile("");
				setPatientDetail(null);
				setSelectedProblems([]);
				setOthersText("");
				setFormValues({ name: "", dob: "", weight: "", gender: "", problems: "", vatPercentage: "5" });
			} else {
				message.error(res?.message || "Failed to create appointment.");
			}
		} catch (error) {
			console.error("Failed to submit the form:", error);
			message.error("Failed to submit the form. Please try again.");
		} finally {
			setSubmissionLoading(false);
		}
	};

	const fee = Number(selectedSlotInfo?.doctorFee || 0);
	const discount = Number(formValues.discount || 0);
	const vat = ((fee - discount) * Number(formValues.vatPercentage || 0)) / 100;

	const total = Math.round(fee + vat - discount);

	return (
		<>
			<div className=" mt-2">
				<div>
					<div className="grid grid-cols-2 gap-2">
						{/* Mobile Number Input */}
						<div className="flex flex-col gap-0.5">
							<label className="block text-sm font-medium text-gray-700">
								Mobile <span className="text-red-500">*</span>
							</label>
							<InternationalPhone
								inputValue={mobile}
								onInputChange={(value: any) => {
									setMobile(value);
									setFormValues({ ...formValues, otherPhone: mobile });
								}}
							/>
							{!!formErrors.mobile && <p className="text-red-500 text-sm mt-1">{formErrors.mobile}</p>}
							{/* {formValues.otherPhone} */}
							{/* <TextInputField
								labelText="Search by Phone/Email"
								inputName="mobile"
								inputValue={mobile}
								onInputChange={(e: any) => setMobile(e.target.value)}
								inputPlaceholder="e.g., +880"
								error={errors ? errors : formErrors?.mobile ? formErrors?.mobile : ""}
								isRequired={true}
							/> */}
						</div>

						{/* Full Name */}
						<div className="flex flex-col gap-1">
							<TextInputField
								labelText="Email"
								inputName="email"
								inputValue={formValues.email}
								onInputChange={handleInputChange}
								inputPlaceholder="e.g., doe@gmail.com"
								isRequired={true}
								error={formErrors?.email}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<TextInputField
								labelText="Full Name"
								inputName="name"
								inputValue={formValues.name}
								onInputChange={handleInputChange}
								inputPlaceholder="e.g., John Doe"
								error={formErrors?.name}
								isRequired={true}
							/>
						</div>

						{/* DOB */}
						<div className="flex flex-col gap-1">
							<TextInputField
								labelText="Age"
								inputName="dob"
								inputValue={formValues.dob}
								onInputChange={handleInputChange}
								inputPlaceholder="e.g., 28"
								error={formErrors?.dob}
								isRequired={true}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Gender"
								selectionValue={formValues.gender}
								onSelectChange={(value: string) =>
									handleInputChange({
										target: { name: "gender", value },
									} as React.ChangeEvent<HTMLSelectElement>)
								}
								selectionOptions={genderOptions}
								error={formErrors?.gender}
								inputPlaceholder="Select gender"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Booking For"
								selectionValue={bookingFor}
								onSelectChange={(value: string) => setBookingFor(value)}
								selectionOptions={selfOtherOptions}
								error={!bookingFor}
								inputPlaceholder="Select gender"
							/>
						</div>
						{bookingFor === "other" && (
							<>
								<div className="flex flex-col gap-0.5">
									<label className="block text-sm font-medium text-gray-700">
										Mobile <span className="text-red-500">*</span>
									</label>
									<InternationalPhone
										inputValue={formValues.otherPhone}
										onInputChange={(value: string) =>
											handleInputChange({
												target: {
													name: "otherPhone",
													value: value,
												},
											} as React.ChangeEvent<HTMLInputElement>)
										}
									/>
								</div>

								{/* Full Name */}
								<div className="flex flex-col gap-1">
									<TextInputField
										labelText="Full Name"
										inputName="otherName"
										inputValue={formValues.otherName}
										onInputChange={handleInputChange}
										inputPlaceholder="e.g., John Doe"
										error={formErrors?.otherName}
										isRequired={true}
									/>
								</div>

								{/* DOB */}
								<div className="flex flex-col gap-1">
									<TextInputField
										labelText="Age"
										inputName="otherAge"
										inputValue={formValues.otherAge}
										onInputChange={handleInputChange}
										inputPlaceholder="e.g., 28"
										error={formErrors?.otherAge}
										isRequired={true}
									/>
								</div>
								<div className="flex flex-col gap-1">
									<DropdownWithSearch
										labelText="Gender"
										selectionValue={formValues.otherGender}
										onSelectChange={(value: string) =>
											handleInputChange({
												target: { name: "otherGender", value },
											} as React.ChangeEvent<HTMLSelectElement>)
										}
										selectionOptions={genderOptions}
										error={formErrors?.otherGender}
										inputPlaceholder="Select gender"
									/>
								</div>
							</>
						)}

						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Country"
								selectionValue={selectedCountry}
								onSelectChange={(value: string) =>
									handleInputChange({
										target: { name: "country", value },
									} as React.ChangeEvent<HTMLSelectElement>)
								}
								selectionOptions={countryList}
								inputPlaceholder="Select country"
								error={formErrors?.country}
								isRequired={true}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<TextInputField
								labelText="City"
								inputName="city"
								inputValue={formValues.city}
								onInputChange={handleInputChange}
								inputPlaceholder="e.g., Dhaka"
								isRequired={selectedCountry === "Bangladesh"}
								error={formErrors?.city}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<TextInputField
								labelText="Area"
								inputName="area"
								inputValue={formValues.area}
								onInputChange={handleInputChange}
								inputPlaceholder="e.g., Mohammadpur"
								isRequired={selectedCountry === "Bangladesh"}
								error={formErrors?.area}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Appointment Type"
								selectionValue={selectedAppointmentType}
								onSelectChange={(value: string) => setSelectedAppointmentType(value)}
								selectionOptions={appointmentTypeOptions}
								inputPlaceholder="Select appointment type"
								error={formErrors?.appointmentType}
								isRequired={true}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Criteria"
								selectionValue={selectedCriteria}
								onSelectChange={(value: string) => setSelectedCriteria(value)}
								selectionOptions={bookingCriteriaOptions}
								inputPlaceholder="Select criteria"
								error={formErrors?.criteria}
								isRequired={true}
							/>
						</div>
						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Package List"
								selectionValue={selectedPackageId}
								onSelectChange={(value: number) => setSelectedPackageId(value)}
								selectionOptions={packageList}
								error={formErrors?.packageId}
								inputPlaceholder="Select Package"
							/>
						</div>
						<div className="flex flex-col gap-1">
							<TextInputField
								labelText="Vat Percentage"
								inputName="vatPercentage"
								inputValue={formValues.vatPercentage}
								onInputChange={handleInputChange}
								error={formErrors?.vatPercentage}
								isRequired={true}
							/>
						</div>

						<div className="flex flex-col gap-1">
							<DropdownWithSearch
								labelText="Discount Type"
								selectionValue={discountType}
								onSelectChange={(value: string) => {
									setDiscountType(value as "FIXED" | "PERCENTAGE");
									setDiscountPercentage("");
									setDiscountValue("");
								}}
								selectionOptions={[
									{ label: "Fixed (BDT)", value: "FIXED" },
									{ label: "Percentage (%)", value: "PERCENTAGE" },
								]}
								inputPlaceholder="Select discount type"
								isRequired={true}
							/>
						</div>

						{discountType === "PERCENTAGE" && (
							<div className="flex flex-col col-span-2 gap-1">
								<TextInputField
									labelText="Discount (%)"
									inputName="discountPercentage"
									inputValue={discountPercentage}
									onInputChange={(e: any) => {
										const value = e.target.value;
										setDiscountPercentage(value);

										const calculated = Math.round((doctorFee * Number(value || 0)) / 100);
										setDiscountValue(calculated);
									}}
									isRequired={true}
								/>
							</div>
						)}

						<div className="flex flex-col col-span-2 gap-1">
							<TextInputField
								labelText="Discount (BDT)"
								inputName="discount"
								inputValue={formValues.discount}
								onInputChange={handleInputChange}
								error={formErrors?.discount}
								isRequired={false}
								isReadOnly={discountType === "PERCENTAGE"}
							/>
						</div>
						<div className="flex flex-col col-span-2 gap-1">
							<TextInputField labelText="Total" inputValue={total} />
						</div>
						{/* Problems */}
						{!!formValues.discount && (
							<div className="flex flex-col col-span-2 gap-4">
								<TextAreaField
									labelText="Discount Notes"
									inputName="discountRemarks"
									inputValue={formValues.discountRemarks}
									onInputChange={handleInputChange}
									inputPlaceholder="e.g., b2b customer"
									inputMaxLength={100}
									error={""}
									isRequired={false}
								/>
							</div>
						)}
						<div className="flex col-span-2 gap-4">
							<TextAreaField
								labelText="Appointment Notes"
								inputName="notes"
								inputValue={formValues.notes}
								onInputChange={handleInputChange}
								inputPlaceholder="e.g., fever"
								inputMaxLength={100}
								error={""}
								isRequired={false}
							/>
						</div>
						{/* Problems — checkbox list */}
						<div className="flex flex-col col-span-2 gap-2">
							<label className="block text-sm font-medium text-gray-700">Problems</label>
							<div className="grid grid-cols-2 gap-x-6 gap-y-2">
								{PROBLEM_LIST.map((problem) => (
									<Checkbox
										key={problem}
										checked={selectedProblems.includes(problem)}
										onChange={(e) => handleProblemCheck(problem, e.target.checked)}
									>
										{problem}
									</Checkbox>
								))}
							</div>
							{selectedProblems.includes("Others") && (
								<Input.TextArea
									rows={3}
									maxLength={200}
									showCount
									placeholder="Please describe your problem..."
									value={othersText}
									onChange={(e) => handleOthersTextChange(e.target.value)}
									className="mt-2"
								/>
							)}
						</div>
						<div className="flex flex-col col-span-2 gap-1"></div>
					</div>

					<div className="mt-4">
						<button
							type="submit"
							onClick={handleSubmit}
							disabled={submissionLoading}
							className="text-white text-[16px] font-bold py-1.5 px-4 min-w-fit rounded-md bg-primary-400"
						>
							Book Appointment
						</button>
					</div>
				</div>
			</div>
			<LoadingModal open={submissionLoading} />
		</>
	);
};

export function LoadingModal({ open }: any) {
	return (
		<Modal
			open={open}
			footer={null}
			closable={false}
			maskClosable={false}
			width={300}
			bodyStyle={{
				padding: "36px 24px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				textAlign: "center",
			}}
			maskStyle={{
				backgroundColor: "rgba(0, 0, 0, 0.45)",
			}}
		>
			<Spin size="large" />

			<h3
				style={{
					margin: "20px 0 4px",
					fontSize: 18,
					fontWeight: 600,
					color: "#222",
				}}
			>
				Processing Request
			</h3>

			<p
				style={{
					margin: 0,
					fontSize: 14,
					color: "#666",
					lineHeight: 1.6,
				}}
			>
				Please wait while we complete your request.
			</p>
		</Modal>
	);
}
export default AppointmentForm;
