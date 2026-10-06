//@ts-ignore
import { patientByPhone } from "@/app/(logged-in)/appointment-booking/actions/services";
import { addPatient } from "@/app/(logged-in)/patient/action/AddPatient";
import CreateButton from "@/app/components/buttons/CreateButton";
import InternationalPhone from "@/app/components/formInputs/InternationalPhone";
import { ageToDob } from "@/helper/DateHelper";
import { message, Modal, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { getCountryList, getDistrictList } from "../action/getCountry";
const { Option } = Select;

const CreatePatient = ({ update, setUpdate, fetchPatientData }: any) => {
	const [showModal, setShowModal] = useState(false);
	const [errors, setErrors] = useState<any>({});
	const [country, setCountry] = useState<any[]>([]);
	const [district, setDistrict] = useState<any[]>([]);
	const [formData, setFormData] = useState<any>({
		name: "",
		mobile: "",
		gender: "",
		weight: "",
		feet: "",
		inches: "",
		dob: "",
		email: "",
		city: "",
		country: "Bangladesh",
		area: "",
		address: "",
		note: "",
	});
	const [error, setError] = useState<any>("");

	const getPatient = async (mobile: any) => {
		try {
			const res = await patientByPhone(mobile);
			const patientDetail: any = res?.data;
			if (patientDetail?.id) {
				setError("Patient already exists in LifeSpring with this mobile!!.");
			}
		} catch (error: any) {
			console.error("Failed to fetch patient details:", error);
		}
	};

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
		if (formData?.mobile.startsWith("+880") && formData?.mobile.length === 14) {
			getPatient(formData?.mobile);
		} else if (formData?.mobile.length === 11 && formData?.mobile.startsWith("01")) {
			getPatient(formData?.mobile);
		} else {
			setError("");
		}
	}, [formData?.mobile]);

	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setError("");
		setFormData((prevData: any) => ({
			...prevData,
			[name]: value,
		}));
	};
	const handleCancel = () => {
		setFormData({
			name: "",
			mobile: "",
			gender: "",
			weight: "",
			feet: "",
			inches: "",
			dob: "",
			email: "",
			city: "",
			country: "Bangladesh",
			area: "",
			address: "",
			note: "",
		});

		setShowModal(false);
		setErrors("");
	};

	const submitPatient = async () => {
		try {
			let newErrors: any = {};
			if (!formData?.name) newErrors.name = "Name is required.";
			if (!formData?.mobile) newErrors.mobile = "Mobile is required.";
			if (!formData?.gender) newErrors.gender = "Gender is required.";
			if (!formData?.dob) newErrors.dob = "Date of Birth is required.";
			// if (!formData?.email) newErrors.email = "Email is required.";
			if (!formData?.country) newErrors.country = "Country is required.";
			// Outside Bangladesh there is no district list to pick from, so district/area stay optional.
			if (formData?.country === "Bangladesh") {
				if (!formData?.area) newErrors.area = "Area is required.";
				if (!formData?.city) newErrors.city = "City is required.";
			}
			if (!formData?.email) newErrors.email = "Email is required.";

			if (Object.keys(newErrors).length > 0) {
				setErrors(newErrors);
				return;
			} else {
				setErrors({});
			}

			let payload: any = {
				name: formData?.name,
				gender: formData?.gender,
				mobile: formData?.mobile,
				dob: ageToDob(formData?.dob),
				country: formData?.country,
				district: formData?.city,
				area: formData?.area,
				note: formData?.note,
				address: formData?.address,
			};

			if (formData?.weight > 0) {
				payload.weight = formData?.weight;
			}
			if (formData?.feet > 0) {
				payload.height = (formData?.feet * 30.48 + formData?.inches * 2.54)?.toFixed(2);
			}
			if (formData?.email) {
				payload.email = formData?.email;
			}

			console.log(payload);

			const res = await addPatient(payload);

			if (res?.statusCode == 200 && res?.data?.id) {
				setUpdate(!update);
				message.success("New Patient Created Successfully");
				fetchPatientData();
				handleCancel();
			} else if (res?.success?.toString()?.toLowerCase() == "false") {
				message.error(res?.message);
			}
		} catch (error) {
			console.error("Error approving doctor:", error);
		}
	};

	return (
		<div>
			<CreateButton
				permissionTag="patient"
				onButtonClick={() => setShowModal(true)}
				tooltipTitle="Create Patient"
				size={25}
			/>
			<Modal title="Add Patient" open={showModal} onCancel={handleCancel} okText="Create" width={700} footer={null}>
				<div>
					<div className="grid grid-cols-2 gap-2 mt-4">
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Mobile <span className="text-red-500">*</span>
							</label>
							<InternationalPhone
								inputValue={formData.mobile}
								onInputChange={(value: any) => handleChange({ target: { name: "mobile", value } })}
							/>
							{/* <input
								type="text"
								name="mobile"
								value={formData?.mobile || ""}
								onChange={handleChange}
								className={`mt-1 block w-full px-3 py-2 border ${
									errors.mobile ? "border-red-500" : "border-gray-300"
								} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
								placeholder="e.g., +8801XXXXXXXXX"
								required
								pattern="(\+8801[3-9]\d{8})|(01[3-9]\d{8})"
								title="Enter a valid Bangladeshi phone number, e.g., +8801XXXXXXXXX or 01XXXXXXXXX"
							/> */}
							{(errors.mobile || error) && (
								<p className="text-red-500 text-xs mt-1">{error ? error : errors?.mobile ? errors.mobile : ""}</p>
							)}
						</div>
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
								} rounded-md shadow-sm focus:outline-none focus:ring-primary ${
									error ? "bg-gray-200" : ""
								} focus:border-primary sm:text-sm`}
								placeholder="e.g., Jack"
								required
							/>
							{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
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
								} bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
									error ? "bg-gray-200" : ""
								}`}
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
								Country <span className="text-red-500">*</span>
							</label>
							<Select
								// name="country"
								size="large"
								value={formData?.country || ""}
								onChange={(value) => handleChange({ target: { name: "country", value } })}
								// required
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
									// name="district"
									size="large"
									value={formData?.city || ""}
									onChange={(value) => handleChange({ target: { name: "city", value } })}
									className={`w-full ${errors.city ? "border-red-500" : ""}`}
									status={errors.city ? "error" : ""}
									placeholder="Select District"
									showSearch
									filterOption={(input: any, option: any) =>
										option?.children?.toLowerCase().includes(input.toLowerCase())
									}
								>
									{district?.map((d) => (
										<Option key={d.id} value={d.name}>
											{d.name}
										</Option>
									))}
								</Select>
								{errors.city && <p className="text-red-500 text-xs mt-1">District is required.</p>}
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
									} rounded-md shadow-sm focus:outline-none focus:ring-primary ${
										error ? "bg-gray-200" : ""
									} focus:border-primary sm:text-sm`}
									placeholder="e.g., Dhaka"
								/>
								{errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
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
									errors.area ? "border-red-500" : "border-gray-300"
								} rounded-md shadow-sm focus:outline-none focus:ring-primary ${
									error ? "bg-gray-200" : ""
								} focus:border-primary sm:text-sm`}
								placeholder="e.g., Jack"
								required
							/>

							{errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
						</div>
						<div className="form-group">
							<label className="block text-sm font-medium text-gray-700">
								Age<span className="text-red-500">*</span>
							</label>
							<input
								type="number"
								name="dob"
								required
								value={formData?.dob || ""}
								onChange={handleChange}
								className={`mt-1 block w-full px-3 py-2 border ${
									errors.dob ? "border-red-500" : "border-gray-300"
								} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
									error ? "bg-gray-200" : ""
								}`}
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
								} rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${
									error ? "bg-gray-200" : ""
								}`}
								placeholder="e.g., abcd@mail.com"
							/>
							{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
						</div>
						<div className="form-group col-span-2">
							<label className="block text-sm font-medium text-gray-700">Weight</label>
							<input
								type="text"
								name="weight"
								value={formData?.weight || ""}
								onChange={handleChange}
								className={`mt-1 block w-full px-3 py-2 ${
									error ? "bg-gray-200" : ""
								} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
								placeholder="e.g., 70"
							/>
						</div>

						<div className="form-group ">
							<label className="block text-sm font-medium text-gray-700">Address</label>
							<textarea
								name="address"
								value={formData?.address || ""}
								onChange={handleChange}
								className={`mt-1 block w-full px-3 py-2 ${
									error ? "bg-gray-200" : ""
								} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
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
								className={`mt-1 block w-full px-3 py-2 ${
									error ? "bg-gray-200" : ""
								} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
								placeholder="Write a note..."
								rows={2} // You can adjust this number as needed
							/>
						</div>

						<div className="form-group col-span-2">
							<label className="block text-sm font-medium text-gray-700">Height (Feet and Inches)</label>
							<div className="grid grid-cols-2 gap-2">
								<input
									type="number"
									name="feet"
									value={formData?.feet || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 ${
										error ? "bg-gray-200" : ""
									} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="e.g.,5"
								/>
								<input
									type="number"
									name="inches"
									value={formData?.inches || ""}
									onChange={handleChange}
									className={`mt-1 block w-full px-3 py-2 ${
										error ? "bg-gray-200" : ""
									} border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
									placeholder="e.g.,5"
								/>
							</div>
						</div>
						<button
							type="submit"
							className="bg-primary-400 px-2 py-1 mt-4 col-span-2 text-white rounded-md "
							onClick={submitPatient}
						>
							Add Patient
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
};

export default CreatePatient;
