//@ts-ignore
"use client";
import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import { updatePatient } from "@/app/(logged-in)/patient/action/AddPatient";
import InternationalPhone from "@/app/components/formInputs/InternationalPhone";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { formateDate } from "@/helper/DateHelper";
import { getBMI } from "@/helper/StringHelper";
import { Modal, Select, Tabs, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { getCountryList, getDistrictList } from "../../action/getCountry";
import { Patient } from "../../types/Types";
import { PatientAppointment } from "../types/Types";

const { TabPane } = Tabs;
const { Option } = Select;

interface Props {
	patient: Patient;
	patientAppointment: PatientAppointment;
}

const convertCmToFeetInches = (cm: any) => {
	const totalInches = cm / 2.54;
	const feet = Math.floor(totalInches / 12);
	const inches = Math.round(totalInches % 12);
	return { feet, inches };
};

const convertFeetInchesToCm = (feet: any, inches: any) => {
	const cmPerFoot = 30.48;
	const cmPerInch = 2.54;
	const centimeters = feet * cmPerFoot + inches * cmPerInch;
	return Math.round(centimeters);
};

const PatientDetails = ({ patient, patientAppointment }: Props) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [patientData, setPatientData] = useState<any>(null);
	const [errors, setErrors] = useState<any>({});
	const [country, setCountry] = useState<any[]>([]);
	const [district, setDistrict] = useState<any[]>([]);
	useEffect(() => {
		if (patient) {
			setPatientData(patient);
		}
	}, [patient]);
	const [showModal, setShowModal] = useState(false);
	const [formData, setFormData] = useState<any>({
		name: "",
		mobile: "",
		gender: "",
		weight: "",
		feet: "",
		inches: "",
		dob: "",
		email: "",
		area: "",
		country: "",
		city: "",
	});

	const fetchCountryData = async () => {
		// setLoading(true);
		try {
			const res: any = await getCountryList();
			console.log(res);
			if (res?.success) {
				setCountry(res.data);
				console.log(res.data);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		}
	};
	useEffect(() => {
		fetchCountryData();
	}, []);
	const fetchDistrictData = async () => {
		// setLoading(true);
		try {
			const res: any = await getDistrictList();
			console.log(res);
			if (res?.success) {
				setDistrict(res?.data.districts);
				console.log(res.data);
			}
		} catch (error) {
			console.error("Error fetching services:", error);
		}
	};
	useEffect(() => {
		fetchDistrictData();
	}, []);

	useMemo(() => {
		if (patientData) {
			const heightInCm = patientData?.height;
			const { feet, inches } = convertCmToFeetInches(heightInCm);

			setFormData({
				name: patientData?.name,
				mobile: patientData?.mobile,
				gender: patientData?.gender,
				weight: patientData?.weight,
				feet: feet,
				inches: inches,
				email: patientData?.email,
				dob: patientData?.dob?.slice(0, 10),
				area: patientData?.area,
				country: patientData?.country,
				city: patientData?.district,
				address: patientData?.address,
				note: patientData?.note,
				isActive: String(patientData?.isActive),
			});
		}
	}, [patientData]);
	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setFormData((prevData: any) => ({
			...prevData,
			[name]: value,
		}));
	};
	const handleCancel = () => {
		// setFormData({
		// 	name: "",
		// 	mobile: "",
		// 	gender: "",
		// 	weight: "",
		// 	feet: "",
		// 	inches: "",
		// 	email: "",
		// 	dob: "",
		// 	area: "",
		// 	country: "",
		// 	city: "",
		// });
		setShowModal(false);
		setErrors("");
	};
	const handleOk = () => {
		submitPatient();
	};

	const submitPatient = async () => {
		// setLoading(true);
		try {
			let newErrors: any = {};
			if (!formData?.name) newErrors.name = "Name is required.";
			if (!formData?.mobile) newErrors.mobile = "Mobile is required.";
			if (!formData?.gender) newErrors.gender = "Gender is required.";
			if (!formData?.dob) newErrors.dob = "Date of Birth is required.";
			if (!formData?.email) newErrors.email = "Email is required.";
			if (!formData?.country) newErrors.country = "Country is required.";
			// Outside Bangladesh there is no district list to pick from, so district/area stay optional.
			if (formData?.country === "Bangladesh") {
				if (!formData?.city) newErrors.city = "City is required.";
				if (!formData?.area) newErrors.area = "Area is required.";
			}

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			} else {
				setErrors({});
			}

			const payload = {
				name: formData?.name,
				gender: formData?.gender,
				weight: formData?.weight,
				height: convertFeetInchesToCm(formData?.feet, formData?.inches),
				dob: formData?.dob,
				email: formData?.email,
				country: formData?.country,
				district: formData?.city,
				area: formData?.area,
				isActive: formData.isActive,
				address: formData.address,
				note: formData.note,
			};
			console.log(payload);
			const res: any = await updatePatient(payload, patient?.id);
			console.log("update patient ", res);
			if (res?.statusCode === 200) {
				setPatientData(res?.data);
				handleCancel();
				// setLoading(false);
			}
		} catch (error) {
			console.error("Error approving doctor:", error);
			setLoading(false);
		}
	};

	if (!patient || loading) {
		return <Loader />;
	}

	return (
		<>
			<ContentWrapper>
				<div className="flex justify-between items-center mb-8">
					<div className="flex items-center space-x-4">
						<img
							src={
								patientData?.profilePic
									? patientData.profilePic
									: "https://dovercourt.org/wp-content/uploads/2019/11/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-286x300.jpg"
							}
							alt="Patient Image"
							className="rounded-full w-20 h-20 object-cover"
						/>
						<div>
							<div className="flex items-center gap-2">
								<h1 className="text-2xl font-semibold">{patientData?.name}</h1>
								<RolePermissionChecker tag="patient" name="update">
									<Tooltip placement="top" title={"Update Details"} color={"#2db7f5"}>
										<div
											className="bg-teal-500 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
											onClick={() => setShowModal(true)}
										>
											<CiEdit size={18} />
										</div>
									</Tooltip>
								</RolePermissionChecker>
							</div>
							<p className="text-gray-500 text-sm">ID: #{patientData?.id}</p>
							<h2
								className={`min-w-fit mt-2 w-fit px-3 py-0.5 text-white text-sm rounded-md text-center ${
									patientData?.isActive ? "bg-primary-400" : "bg-red-400"
								}`}
							>
								{patientData?.isActive ? "Active" : "Inactive"}
							</h2>
						</div>
					</div>
					<div className="text-right">
						<p className="text-lg">{patientData?.mobile}</p>
						<p className="text-lg">{patientData?.email}</p>
					</div>
				</div>
				<Tabs defaultActiveKey="1" className="mb-6">
					<TabPane tab="Details" key="1">
						{/* Patient Details Section */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							{/* Personal Information */}
							<div>
								<h2 className="text-xl text-primary-400 font-semibold  mb-4">Personal Information</h2>
								<div className="space-y-4">
									<div className="flex justify-between">
										<span className="text-gray-500">Full Name</span>
										<span className="font-semibold">{patientData?.name}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Gender</span>
										<span className="font-semibold">{patientData?.gender}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Date of Birth</span>
										<span className="font-semibold">{formateDate(patientData?.dob)}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Email</span>
										<span className="font-semibold">{patientData?.email}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Country</span>
										<span className="font-semibold">{patientData?.country}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">District</span>
										<span className="font-semibold">{patientData?.district}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Address</span>
										<span className="font-semibold">{patientData?.address}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Note</span>
										<span className="font-semibold">{patientData?.note}</span>
									</div>
								</div>
							</div>

							{/* Medical Information */}

							<div>
								<h2 className="text-xl font-semibold text-primary-400 mb-4">Health Information</h2>
								<div className="space-y-4">
									<div className="flex justify-between">
										<span className="text-gray-500">Weight</span>
										<span className="font-semibold">{patientData?.weight ? `${patientData?.weight} kg` : "-"}</span>
									</div>

									<div className="flex justify-between">
										<span className="text-gray-500">Height</span>
										<span className="font-semibold">{`${convertCmToFeetInches(patientData?.height)?.feet} Feet ${
											convertCmToFeetInches(patientData?.height)?.inches
										} Inchi`}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">BMI</span>
										<span className="font-semibold">{getBMI(patientData?.height, patientData?.weight) ?? "-"}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-gray-500">Diseases</span>
										<span className="font-semibold">{patientData?.diseases ?? "-"}</span>
									</div>
								</div>
							</div>
						</div>
					</TabPane>
					<TabPane tab="Appointment" key="2">
						{/* Appointment History */}
						<div className="space-y-4">
							<div className="flex justify-between">
								<span className="text-gray-500">Total Appointments</span>
								<span className="font-semibold">{patientAppointment?.appointment ?? 0}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-gray-500">Completed Appointments</span>
								<span className="font-semibold">{patientAppointment?.complete ?? 0}</span>
							</div>
						</div>
					</TabPane>
				</Tabs>
			</ContentWrapper>

			<Modal
				title="Update Patient"
				open={showModal}
				width={800}
				onOk={submitPatient}
				onCancel={handleCancel}
				centered
				okText="Update"
			>
				<div>
					<div>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Name <span className="text-red-500">*</span>
								</label>
								<input
									type="text"
									name="name"
									value={formData?.name || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 border ${
										errors.name ? "border-red-500" : "border-gray-300"
									} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="e.g., Jack"
									required
								/>
								{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Mobile <span className="text-red-500">*</span>
								</label>
								<InternationalPhone
									inputValue={formData.mobile}
									onInputChange={(value: any) => handleChange({ target: { name: "mobile", value } })}
								/>
								{errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Gender <span className="text-red-500">*</span>
								</label>
								<select
									name="gender"
									value={formData?.gender || ""}
									onChange={handleChange}
									required
									className={`mt-1 block w-full px-3 py-2 border ${
										errors.gender ? "border-red-500" : "border-gray-300"
									} bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
								>
									<option value="">Select Gender</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
								{errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Date of Birth<span className="text-red-500">*</span>
								</label>
								<input
									type="date"
									name="dob"
									required
									max={new Date().toISOString().split("T")[0]}
									value={formData?.dob || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 border ${
										errors.dob ? "border-red-500" : "border-gray-300"
									} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
								/>
								{errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
							</div>

							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Email <span className="text-red-500">*</span>
								</label>
								<input
									type="email"
									name="email"
									value={formData?.email || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 border ${
										errors.email ? "border-red-500" : "border-gray-300"
									} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="e.g., abcd@mail.com"
								/>
								{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Country <span className="text-red-500">*</span>
								</label>
								<Select
									size="large"
									value={formData?.country || ""}
									onChange={(value) => handleChange({ target: { name: "country", value } })}
									className={`w-full ${errors.country ? "border-red-500" : ""}`}
									status={errors.country ? "error" : ""}
									placeholder="Select Country"
									showSearch
									filterOption={(input: any, option: any) =>
										option?.children?.toLowerCase().includes(input.toLowerCase())
									}
								>
									{country?.map((c) => (
										<Option key={c.code} value={c.name}>
											{c.name}
										</Option>
									))}
								</Select>

								{errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
							</div>
							{formData.country === "Bangladesh" ? (
								<div className="form-group">
									<label className="block text-sm font-medium text-gray-700">
										District <span className="text-red-500">*</span>
									</label>
									<Select
										size="large"
										value={formData?.city || ""}
										onChange={(value) => handleChange({ target: { name: "city", value } })}
										className={`w-full ${errors.city ? "border-red-500" : ""}`}
										status={errors.city ? "error" : ""}
										placeholder="Select District"
										showSearch
										filterOption={(input: any, option: any) => option?.children?.includes(input.toLowerCase())}
									>
										{district?.map((d) => (
											<Option key={d.id} value={d.name}>
												{d.name}
											</Option>
										))}
									</Select>
									{errors?.city && <p className="text-red-500 text-xs mt-1">{errors?.city}</p>}
								</div>
							) : (
								<div className="form-group">
									<label className="block text-sm font-medium text-gray-700">City</label>
									<input
										type="text"
										name="city"
										value={formData?.city || ""}
										onChange={handleChange}
										className={`mt-1 block w-full px-3 py-2 border ${
											errors?.city ? "border-red-500" : "border-gray-300"
										} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
										placeholder="e.g., Dhaka"
									/>
									{errors?.city && <p className="text-red-500 text-xs mt-1">{errors?.city}</p>}
								</div>
							)}
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Area {formData.country === "Bangladesh" && <span className="text-red-500">*</span>}
								</label>

								<input
									type="text"
									name="area"
									value={formData?.area || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 border ${
										errors?.area ? "border-red-500" : "border-gray-300"
									} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="e.g., Dhaka"
								/>

								{errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">Weight</label>
								<input
									type="text"
									name="weight"
									value={formData?.weight || ""}
									onChange={handleChange}
									className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
									placeholder="e.g., 70"
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">
									Status <span className="text-red-500">*</span>
								</label>

								<Select
									// name="area"
									size="large"
									value={formData?.isActive}
									onChange={(value) => handleChange({ target: { name: "isActive", value } })}
									// required
									className={`w-full ${errors.isActive ? "border-red-500" : ""}`}
									status={errors.isActive ? "error" : ""}
									placeholder="Select status"
									showSearch
									filterOption={(input: any, option: any) =>
										option?.children?.toLowerCase().includes(input.toLowerCase())
									}
								>
									<Option value="true">True</Option>
									<Option value="false">False</Option>
								</Select>

								{/* {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>} */}
							</div>
							<div className="form-group ">
								<label className="block text-sm font-medium text-gray-700">Address</label>
								<textarea
									name="address"
									value={formData?.address || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="Write patients address..."
									rows={2} // You can adjust this number as needed
								/>
							</div>
							<div className="form-group">
								<label className="block text-sm font-medium text-gray-700">Note</label>
								<textarea
									name="note"
									value={formData?.note || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2  border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="Write a note..."
									rows={2} // You can adjust this number as needed
								/>
							</div>
							<div className="form-group col-span-2">
								<label className="block text-sm font-medium text-gray-700">Height (Feet and Inches)</label>
								<div className="grid grid-cols-2 gap-4">
									<input
										type="number"
										name="feet"
										value={formData?.feet || ""}
										onChange={handleChange}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
										placeholder="e.g.,5"
									/>
									<input
										type="number"
										name="inches"
										value={formData?.inches || ""}
										onChange={handleChange}
										className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
										placeholder="e.g.,5"
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default PatientDetails;
