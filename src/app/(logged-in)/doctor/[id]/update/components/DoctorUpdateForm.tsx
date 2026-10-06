"use client";
import { getBranchList } from "@/app/(logged-in)/branch/actions/GetBranchList";
import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import { DeleteFile } from "@/app/(logged-in)/doctor/[id]/update/actions/UpdateDoctorAction";
import ErrorAlert from "@/app/components/alerts/ErrorAlert";
import SuccessAlert from "@/app/components/alerts/SuccessAlert";
import SubmitButton from "@/app/components/buttons/SubmitButton";
import { message, Select } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaFileUpload } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import IntroVideoField from "../../../components/IntroVideoField";
import CommissionInput from "../../../create/components/CommissionInput";
import { AccountType, BankName, MFSType } from "../../../types/Type";
import useDoctorUpdate from "../hooks/useDoctorUpdate";
import { Speciality } from "../types/Types";

interface Props {
	doctor: any;
	specialties: Speciality[];
	organizationList: any;
}

const DoctorUpdateForm = ({ doctor, specialties, organizationList }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [branchList, setBranchList] = useState<any[]>([]);
	const {
		form,
		bankDetail,
		changeAccountType,
		changeMfsType,
		handleFileChangedocument,
		handleRemoveFile,
		attachments,
		setAttachments,
	}: any = useDoctorUpdate(doctor);
	// const { form } = useDoctorUpdate(doctor);
	const { register, workDays, workingHours, handleDayChange, errors, result } = form;
	const { error, success } = result;
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedFileSign, setSelectedFileSign] = useState<File | null>(null);
	const [selectedValue, setSelectedValue] = useState(doctor?.specialty?.id);
	const router = useRouter();
	const [selectedOrg, setSelectedOrg] = useState(doctor?.organization?.id);
	const [selectedBank, setSelectedBank] = useState<any>(doctor?.bankDetails?.bankName);

	const [preview, setPreview] = useState<any>(doctor?.profilePic || null);
	const [previewUrl, setPreviewUrl] = useState<any>(doctor?.signatureUrl || null);
	const [isImage, setIsImage] = useState(false);
	const [isImageSign, setIsImageSign] = useState(false);

	const [selectedBranchIds, setSelectedBranchIds] = useState(
		doctor?.branches?.map((branch: any) => String(branch.id)) || []
	);

	useEffect(() => {
		if (doctor) {
			setAttachments(doctor?.fileManagement);
		}
	}, [doctor]);
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

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setSelectedFile(file);
		setIsImage(true);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreview(null);
		}
	};
	const handleFileChangeSign = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setSelectedFileSign(file);
		setIsImageSign(true);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewUrl(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreviewUrl(null);
		}
	};
	const handleSpecialtyUpdate = (value: any) => {
		setSelectedValue(value);
	};
	const handleOrgUpdate = (value: any) => {
		setSelectedOrg(value);
	};
	const handledelete = async (url: any) => {
		try {
			const res: any = await DeleteFile(url);
			if (res.statusCode == 200) {
				router.push(`/doctor/${doctor?.id}`);
				message.success("File deleted successfully");
			} else {
				message.error("Something went wrong!!!!");
			}
		} catch (error) {
			message.error("Failed to delete.");
		} finally {
		}
	};

	if (isLoading || !form) {
		return <Loader />;
	}
	return (
		<div className="bg-white rounded-lg pr-4">
			{error && <ErrorAlert error={error} />}
			{success && <SuccessAlert success={success} autoHide />}

			<form action={form.action}>
				<div className="grid grid-cols-1 ">
					<div className="flex items-center gap-6">
						<div className="flex flex-col gap-1 justify-start mb-4">
							<label className="text-gr font-medium text-sm">Profile Picture</label>
							{preview ? (
								<div className="">
									<img src={preview} alt="Profile Preview" className="w-24 h-24 object-cover rounded-full mb-2" />
								</div>
							) : doctor.profilePic ? (
								<img
									src={doctor.profilePic}
									alt="Current Profile"
									className="w-24 h-24 object-cover rounded-full mb-2"
								/>
							) : (
								<img
									src={
										"https://surgassociates.com/wp-content/uploads/610-6104451_image-placeholder-png-user-profile-placeholder-image-png-1.jpg"
									}
									alt="Profile Preview"
									className="w-24 h-24 object-cover rounded-full mb-2"
								/>
							)}
							<div className="flex items-center gap-4">
								<input
									className="border-2 rounded-md w-[200px] p-1 text-gr"
									{...register("profilePic")}
									type="file"
									accept="image/*"
									name="profilePic"
									onChange={handleFileChange}
								/>
								{preview && isImage && (
									<RxCross2
										className=" text-red-500 cursor-pointer"
										size={25}
										onClick={() => {
											{
												setPreview(null);
											}
											setSelectedFile(null);
										}}
									/>
								)}
							</div>
						</div>
						<div className="flex flex-col gap-1 justify-start mb-4">
							<label className="text-gr font-medium text-sm">Signature</label>
							{previewUrl ? (
								<div className="">
									<img src={previewUrl} alt="Profile Preview" className="w-24 h-24 object-cover  mb-2" />
								</div>
							) : doctor.signatureUrl ? (
								<img src={doctor.signatureUrl} alt="Current Profile" className="w-24 h-24 object-cover  mb-2" />
							) : (
								""
							)}
							<div className="flex items-center gap-4">
								<input
									className="border-2 rounded-md w-[200px] p-1 text-gr"
									{...register("signature")}
									type="file"
									accept="image/*"
									name="signature"
									onChange={handleFileChangeSign}
								/>
								{previewUrl && isImageSign && (
									<RxCross2
										className=" text-red-500 cursor-pointer"
										size={25}
										onClick={() => {
											{
												setPreviewUrl(null);
											}
											setSelectedFileSign(null);
										}}
									/>
								)}
							</div>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
					<div className="col-span-full">
						<h2 className="text-lg font-semibold text-primary-500">Personal Information</h2>
					</div>
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Name <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="text"
							{...register("name")}
							placeholder="Enter doctor name"
							required
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Email Address</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="email"
							{...register("email")}
							placeholder="Enter email address"
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Mobile Number <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="text"
							{...register("mobile")}
							maxLength={11}
							placeholder="Enter mobile number"
							required
						/>
					</div>
					<div className="col-span-full">
						<h2 className="text-lg font-semibold text-primary-500">Professional Information</h2>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">BMDC Reg Code</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							{...register("bmdcCode")}
							type="text"
							placeholder="Enter BMDC Reg Code"
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">BMDC Expiry Date</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							{...register("bmdcExpiryDate")}
							type="date"
							placeholder="Enter BMDC Expiry Date"
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Experience (In Years) <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="text"
							{...register("experience")}
							placeholder="Enter experience"
							required
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Fee <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="text"
							{...register("fee")}
							placeholder="Enter fee amount"
							required
						/>
					</div>
					{/* Max Fee */}
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Max Fee <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="number"
							{...register("maxFee")}
							placeholder="Enter max fee amount"
							required
						/>
					</div>

					{/* Min Fee */}
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Min Fee <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="number"
							{...register("minFee")}
							placeholder="Enter min fee amount"
							required
						/>
					</div>

					{/* Branch */}
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Branch <span className="text-red-500">*</span>
						</label>
						<Select
							mode="multiple"
							allowClear
							size="large"
							style={{ width: "100%" }}
							placeholder="Select branches"
							value={selectedBranchIds}
							onChange={(value) => {
								setSelectedBranchIds(value);
								document.getElementById("branchField")?.setAttribute("value", JSON.stringify(value));
							}}
							options={branchList}
							disabled
						/>

						{/* Hidden field for react-hook-form submission */}
						<input type="hidden" id="branchField" {...register("branch")} value={JSON.stringify(selectedBranchIds)} />
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Time Period (Minutes) <span className="text-red-500">*</span>
						</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="text"
							{...register("timePeriod")}
							placeholder="Enter appointment time duration"
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Common SL</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="number"
							{...register("commonSl")}
							placeholder="Enter Common SL"
						/>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Department SL</label>
						<input
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							type="number"
							{...register("departmentSl")}
							placeholder="Enter Department SL"
						/>
					</div>

					<CommissionInput initialValue={doctor.commission} />
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Department <span className="text-red-500">*</span>
						</label>
						<select
							className="border-2 focus:outline-none rounded-md p-2 text-gr bg-white"
							{...register("specialty")}
							required
							value={selectedValue}
							onChange={(e) => handleSpecialtyUpdate(e.target.value)}
						>
							{specialties.map((speciality) => (
								<option key={speciality.id} value={speciality.id}>
									{speciality.name.en}
								</option>
							))}
						</select>
					</div>
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Organization</label>
						<select
							className="border-2 focus:outline-none rounded-md p-2 text-gr bg-white"
							{...register("organizationId")}
							value={selectedOrg}
							onChange={(e) => handleOrgUpdate(e.target.value)}
						>
							<option key={""} value={""}>
								Select Organization
							</option>
							{organizationList?.result?.map((org: any) => (
								<option key={org.name} value={org.id}>
									{org.name}
								</option>
							))}
							<option key={""} value={""}>
								Freelancer
							</option>
						</select>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">
							Biography <span className="text-red-500">*</span>
						</label>
						<textarea
							rows={4}
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							{...register("biography")}
							placeholder="Enter biography"
							required
						/>
					</div>

					<IntroVideoField defaultValue={doctor?.introVideoUrl ?? ""} />

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium  text-sm">
							Degrees <span className="text-red-500">*</span>
						</label>
						<textarea
							rows={4}
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							{...register("degrees")}
							required
							placeholder="Enter degrees"
						/>
					</div>
					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Working In</label>
						<textarea
							className="border-2 focus:outline-none rounded-md p-2 text-gr"
							{...register("working_at")}
							placeholder="Enter working in"
						/>
					</div>

					<div className="col-span-full">
						<h2 className="text-lg font-semibold text-primary-500">Bank Information</h2>
					</div>

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Account Type</label>
						<div className="flex flex-wrap gap-2">
							{(Object.keys(AccountType) as Array<keyof typeof AccountType>).map((t) => (
								<div key={t} className="flex items-center text-xs">
									<input
										type="radio"
										id={t}
										name="accountType"
										value={t}
										checked={bankDetail.accountType == AccountType[t]}
										onChange={() => changeAccountType(AccountType[t])}
										className="mr-2"
									/>
									<label htmlFor={t} className="text-gr text-sm">
										{t}
									</label>
								</div>
							))}
						</div>
					</div>

					{bankDetail.accountType == AccountType.MFS && (
						<div className="flex flex-col gap-1 justify-start">
							<label className="text-gr font-medium text-sm">MFS Type</label>
							<div className="flex flex-wrap gap-2">
								{(Object.keys(MFSType) as Array<keyof typeof MFSType>).map((t) => (
									<div key={t} className="flex items-center text-xs">
										<input
											type="radio"
											id={t}
											name="mfsType"
											value={t}
											checked={bankDetail.mfsType == MFSType[t]}
											onChange={() => changeMfsType(MFSType[t])}
											className="mr-2"
										/>
										<label htmlFor={t} className="text-gr text-sm">
											{t}
										</label>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-col gap-1 justify-start">
						<label className="text-gr font-medium text-sm">Account No</label>
						<input
							className="border-2  focus:outline-none rounded-md p-2 text-gr"
							{...register("accountNo")}
							type="text"
							placeholder="Enter Account No"
							// required
						/>
					</div>

					{bankDetail.accountType == AccountType.BANK && (
						<>
							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr font-medium text-sm">
									Account Name <span className="text-red-500">*</span>
								</label>
								<input
									className="border-2 focus:outline-none rounded-md p-2 text-gr"
									{...register("accountName")}
									type="text"
									placeholder="Enter Account Name"
									// required
								/>
							</div>

							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr font-medium text-sm">
									Bank Name <span className="text-red-500">*</span>
								</label>

								<select
									className="border-2 rounded-md p-2 text-gray-700 bg-white"
									// required
									{...register("bankName")}
									value={selectedBank}
									onChange={(e: any) => {
										setSelectedBank(e.target.value);
									}}
								>
									<option key={"N/A"} value={"N/A"}>
										Select
									</option>
									{BankName?.length > 0 &&
										BankName.map((bank) => (
											<option key={bank} value={bank}>
												{bank}
											</option>
										))}
								</select>
							</div>

							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr font-medium text-sm">Branch Name</label>
								<input
									className="border-2 focus:outline-none rounded-md p-2 text-gr"
									{...register("branchName")}
									type="text"
									placeholder="Enter Branch Name"
									// required
								/>
							</div>

							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr font-medium text-sm">Routing Number</label>
								<input
									className="border-2 focus:outline-none rounded-md p-2 text-gr"
									{...register("routingNumber")}
									type="text"
									placeholder="Enter Routing Number"
									// required
								/>
							</div>
						</>
					)}

					<div className="col-span-full">
						<h2 className="mt-2 font-bold text-primary-500">Documents</h2>
						<hr />
						<div className="p-2 bg-white shadow rounded-lg mt-4">
							<div>
								<div className="py-4 flex relative items-center cursor-pointer justify-center border border-lightGray rounded-lg border-dashed space-x-2">
									<input
										type="file"
										className="absolute h-full w-full opacity-0"
										onChange={handleFileChangedocument}
										multiple
										accept="image/*,.pdf"
									/>
									<FaFileUpload size={22} className="text-primary-500" />
									<p className="font-normal text-sm text-darkGray cursor-pointer">
										{attachments?.map((file: any, key: number): any => (
											<span key={key}>
												{file.name}
												{key + 1 !== attachments?.length ? ", " : ""}
											</span>
										))}
										{attachments?.length === 0 ? "Attachment" : ""}
									</p>
								</div>
								<p className="font-normal text-xs text-gray mt-2 text-red-500">
									*** Upload any certificate or document if you have. (Maximum file size 2MB)
								</p>

								<div className="mt-2 flex flex-wrap items-center gap-4 ">
									{attachments?.map((file: any, index: number) => (
										<div key={index} className="relative">
											<div>
												{file?.type?.startsWith("image/") || file?.mimetype?.startsWith("image/") ? (
													// Render image for image types
													<img
														src={file?.url || URL?.createObjectURL(file)}
														alt={file?.originalname || file?.name}
														className="w-[200px] h-[200px] overflow-scroll rounded-lg"
													/>
												) : file?.type === "application/pdf" || file?.mimetype === "application/pdf" ? (
													// Render iframe for PDF files
													<iframe
														src={file?.url || URL?.createObjectURL(file)}
														title={file?.originalname || file?.name}
														width="200"
														height="200"
														className="overflow-scroll border rounded-lg"
													/>
												) : (
													// Fallback for unsupported file types
													<div className="w-[200px] h-[200px] flex items-center justify-center border rounded-lg bg-gray-200">
														<p>Unsupported file type</p>
													</div>
												)}
											</div>

											{!file?.id ? (
												<RxCross2
													size={22}
													className=" cursor-pointer absolute top-0 right-0 text-red-500"
													onClick={() => handleRemoveFile(index)}
												/>
											) : file?.id ? (
												<RxCross2
													size={22}
													className=" cursor-pointer absolute top-0 right-0 text-red-500"
													onClick={() => handledelete(file?.url)}
												/>
											) : (
												""
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="col-span-full mb-4">
						<SubmitButton text="Update" />
					</div>
				</div>
			</form>
		</div>
	);
};

export default DoctorUpdateForm;
