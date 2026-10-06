//@ts-ignore
"use client";
import { getBranchList } from "@/app/(logged-in)/branch/actions/GetBranchList";
import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import { createDoctorBooking } from "@/app/(logged-in)/doctor/create/action/CreateDoctorAction";
import SubmitButton from "@/app/components/buttons/SubmitButton";
import MultiSelectDropdown from "@/app/components/formInputs/MultiSelectDropdown";
import { message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaFileUpload } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { AccountType, BankDetails, BankName, MFSType } from "../../types/Type";
import IntroVideoField from "../../components/IntroVideoField";
import CommissionInput from "../components/CommissionInput";
import { Speciality } from "../types/Types";
import DoctorFormField from "./DoctorFormField";
interface Props {
	specialties: Speciality[];
	setPreview: (value: string | null) => void;
	preview: any;
	organizationList: any;
}

const DoctorForm = ({ specialties, setPreview, preview, organizationList }: Props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedFileSign, setSelectedFileSign] = useState<File | null>(null);
	const [showPassword, setShowPassword] = useState(false);
	const [attachment, setAttachment] = useState([]);
	const router = useRouter();
	const [isCoach, setIsCoach] = useState(false);
	const [previewSign, setPreviewSing] = useState<any>(null);
	const [branchList, setBranchList] = useState<any[]>([]);
	const [selectedBranch, setSelectedBranch] = useState<any>(null);
	const [bankDetails, setBankDetails] = useState<BankDetails>({
		accountType: AccountType.BANK,
		mfsType: MFSType.BKASH,
		accountNo: "",
		accountName: "",
		bankName: "",
		branchName: "",
		routingNumber: "",
	});

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
	const handleSignFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setSelectedFileSign(file);
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewSing(reader.result as string);
			};
			reader.readAsDataURL(file);
		} else {
			setPreviewSing(null);
		}
	};

	const changeAccountType = (t: AccountType) => {
		setBankDetails((c) => {
			const newCurrent = { ...c };
			newCurrent.accountType = t;
			if (t == AccountType.MFS) {
				newCurrent.mfsType = c.mfsType ?? MFSType.BKASH;
			}
			return newCurrent;
		});
	};
	const changeMfsType = (t: MFSType) => {
		setBankDetails((c) => {
			const newCurrent = { ...c };
			newCurrent.mfsType = t;
			return newCurrent;
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		// setIsLoading(true);
		e.preventDefault();
		try {
			const formData = new FormData(e.currentTarget);
			if (selectedFile) {
				formData.append("profilePic", selectedFile);
			}
			if (selectedFileSign) {
				formData.append("signature", selectedFileSign);
			}
			if (selectedBranch) {
				const branches = Array.isArray(selectedBranch) ? selectedBranch : [selectedBranch];
				formData.append("branchIds", JSON.stringify(branches));
			}

			if (attachment?.length > 0) {
				for (let i = 0; i < attachment.length; i++) {
					formData.append("files", attachment[i]);
				}
			}

			const bankDetail = { ...bankDetails };
			bankDetail.accountNo = formData.get("accountNo") as string;
			bankDetail.accountName = formData.get("accountName") as string;
			bankDetail.branchName = formData.get("branchName") as string;
			bankDetail.routingNumber = formData.get("routingNumber") as string;

			formData.set("bankDetails", JSON.stringify(bankDetail));

			const response: any = await createDoctorBooking(formData);
			if (response?.statusCode == 200) {
				message.success("Doctor created successfully!");
				router.push("/doctor");
			} else {
				message.error(response.message);
			}
		} catch (error) {
			console.error("Failed to submit the form:", error);
			message.error("Failed to submit the form. Please try again.");
		} finally {
			// setIsLoading(false);
		}
	};
	const handleFileChangedocument = (e: any) => {
		const files = Array.from(e.target.files);
		if (files.some((file: any) => file.size > 2 * 1024 * 1024)) {
			return;
		}
		setAttachment((prev): any => [...prev, ...files]);
	};

	const handleRemoveFile = (index: any) => {
		setAttachment((prev) => prev.filter((_, i) => i !== index));
	};

	if (isLoading) {
		return <Loader />;
	}

	return (
		<div className="pb-10 ">
			<form onSubmit={handleSubmit}>
				<div className="flex flex-col gap-4 w-full  px-4">
					<div className="flex items-center gap-2">
						<div>
							{preview && (
								<div className="mb-4">
									<Image
										src={preview}
										alt="Profile Preview"
										width={40}
										height={40}
										className="object-cover rounded-full w-24 h-24"
									/>
								</div>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1 justify-start mb-4">
									<label className="text-gr text-medium text-sm">
										Profile Picture <span className="text-red-500">*</span>
									</label>
									<input
										className="border-2 rounded-md p-1 text-gr w-1/2"
										type="file"
										accept="image/*"
										name="profilePic"
										required={true}
										onChange={handleFileChange}
									/>
								</div>
							</div>
						</div>

						<div>
							{previewSign && (
								<div className="mb-4">
									<Image
										src={previewSign}
										alt="Profile Preview"
										width={40}
										height={40}
										className="object-cover border border-b-2 w-44 h-24"
									/>
								</div>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div className="flex flex-col gap-1 justify-start mb-4">
									<label className="text-gr text-medium text-sm">Signature</label>
									<input
										className="border-2 rounded-md p-1 text-gr w-1/2"
										type="file"
										accept="image/*"
										name="signature"
										onChange={handleSignFileChange}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="">
						<p className="mb-2 text-primary-500 font-semibold">Personal Information</p>
						<div className="grid grid-cols-3 gap-4">
							<DoctorFormField label="Name" name="name" type="text" placeholder="Enter doctor name" required={true} />
							<DoctorFormField
								label="Email Address"
								name="email"
								type="email"
								placeholder="Enter email address"
								required={true}
							/>
							<DoctorFormField
								label="Mobile Number"
								name="mobile"
								type="text"
								placeholder="Enter phone number"
								maxLength={11}
								required={true}
							/>
						</div>
					</div>
					<div>
						<p className="mb-2 text-primary-500 font-semibold">Professional Information</p>
						<div className="grid grid-cols-3 gap-4">
							<DoctorFormField label="BMDC Reg Code" name="bmdcCode" type="text" placeholder="Enter BMDC Reg Code" />
							<DoctorFormField
								label="BMDC Expiry Date"
								name="bmdcExpiryDate"
								type="date"
								placeholder="Enter BMDC Expiry Date"
							/>
							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr text-medium text-sm">
									Department <span className="text-red-500">*</span>
								</label>
								<select className="border-2 rounded-md p-2 text-gr bg-white" name="specialtyId" required>
									{specialties?.map((speciality) => (
										<option key={speciality?.name?.en} value={speciality?.id}>
											{speciality?.name?.en}
										</option>
									))}
								</select>
							</div>
							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr text-medium text-sm">Organization</label>
								<select className="border-2 rounded-md p-2 text-gr bg-white" name="organization">
									<option key={""} value={""}>
										LifeSpring
									</option>
									{organizationList?.result?.map((org: any) => (
										<option key={org.name} value={org.id}>
											{org.name}
										</option>
									))}
									<option key={"freelancer"} value={"freelancer"}>
										Freelancer
									</option>
								</select>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<DoctorFormField
							label="Experience (In years)"
							name="experience"
							type="number"
							placeholder="Enter experience in years"
							min={0}
							required={true}
						/>
						<DoctorFormField label="Degrees" name="degrees" type="text" placeholder="Enter Degrees" required={true} />
						<DoctorFormField
							label="Fee"
							name="fee"
							type="number"
							placeholder="Enter fee amount"
							min={0}
							required={true}
						/>
						<DoctorFormField
							label="Min Fee"
							name="minFee"
							type="number"
							placeholder="Enter min fee amount"
							min={0}
							required={true}
						/>
						<DoctorFormField
							label="Max Fee"
							name="maxFee"
							type="number"
							placeholder="Enter max fee amount"
							min={0}
							required={true}
						/>
						<MultiSelectDropdown
							labelText="Select Branch"
							selectionValue={selectedBranch}
							selectionOptions={branchList}
							onSelectChange={(value: any) => {
								setSelectedBranch(value);
								console.log(value);
							}}
						/>

						<DoctorFormField
							label="Time Period (Minutes)"
							name="timePeriod"
							type="text"
							placeholder="Enter appointment time duration"
							maxLength={2}
							required={true}
						/>
						<DoctorFormField
							label="Common SL"
							name="commonSl"
							type="number"
							placeholder="Enter Common SL"
							min={0}
							required={false}
						/>
						<DoctorFormField
							label="Department SL"
							name="departmentSl"
							type="number"
							placeholder="Enter Department SL"
							min={0}
							required={false}
						/>
					</div>
					<div>
						<p className="mb-2 text-primary-500 font-semibold">Platform Information</p>
						<div className="grid grid-cols-3 gap-4">
							<CommissionInput />
							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr text-medium text-sm">
									Biography <span className="text-red-500">*</span>
								</label>
								<textarea
									className="border-2 rounded-md p-2 text-gr focus:outline-none"
									name="biography"
									// type='text'
									placeholder="Enter biography"
									required
								/>
							</div>
							<div className="flex flex-col gap-1 justify-start">
								<label className="text-gr text-medium text-sm">
									Working in<span className="text-red-500">*</span>
								</label>

								<textarea
									className="border-2 rounded-md p-2 text-gr focus:outline-none"
									name="working_at"
									// type='text'
									placeholder="Enter Working in"
									required
								/>
							</div>
							<IntroVideoField />
						</div>
					</div>
					<h2 className="mt-2 font-bold text-primary-500">Settlement Details</h2>
					<hr />

					<div className="grid grid-cols-3 gap-4">
						<div className="flex flex-col gap-1 justify-start col-span-3">
							<label className="text-gr text-medium text-sm">Account Type</label>
							<div className="flex flex-wrap gap-2">
								{(Object.keys(AccountType) as Array<keyof typeof AccountType>).map((t) => (
									<div key={t} className="flex items-center text-xs">
										<input
											type="radio"
											id={t}
											name="accountType"
											value={t}
											checked={bankDetails.accountType == AccountType[t]}
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

						{bankDetails.accountType == AccountType.MFS && (
							<div className="flex flex-col gap-1 justify-start col-span-3">
								<label className="text-gr text-medium text-sm">MFS Type</label>
								<div className="flex flex-wrap gap-2">
									{(Object.keys(MFSType) as Array<keyof typeof MFSType>).map((t) => (
										<div key={t} className="flex items-center text-xs">
											<input
												type="radio"
												id={t}
												name="mfsType"
												value={t}
												checked={bankDetails.mfsType == MFSType[t]}
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

						<DoctorFormField
							label="Account No"
							name="accountNo"
							type="text"
							placeholder="Enter Account No"
							required={false}
						/>
						{bankDetails.accountType == AccountType.BANK && (
							<>
								<DoctorFormField
									label="Account Name "
									name="accountName"
									type="text"
									placeholder="Enter Account No"
									required={false}
								/>
								<div className="flex flex-col gap-1 justify-start">
									<label className="text-gr text-medium text-sm">Bank Name</label>
									<select
										className="border-2 rounded-md p-2 text-gray-700 bg-white"
										name="bankName"
										// required
										value={bankDetails.bankName}
										onChange={(e: any) => {
											setBankDetails({
												...bankDetails,
												bankName: e.target.value,
											});
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
								<DoctorFormField
									label="Branch Name"
									name="branchName"
									type="text"
									placeholder="Enter Branch Name"
									required={false}
								/>
								<DoctorFormField
									label="Routing Number"
									name="routingNumber"
									type="text"
									placeholder="Enter Routing Number"
									required={false}
								/>
							</>
						)}
					</div>
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
									{attachment.map((file: any, key: number): any => (
										<span key={key}>
											{file.name}
											{key + 1 !== attachment.length ? ", " : ""}
										</span>
									))}
									{attachment.length === 0 ? "Attachment" : ""}
								</p>
							</div>
							<p className="font-normal text-xs text-red-500 mt-2">
								*** Upload any certificate or document if you have. (Maximum file size 2MB)
							</p>

							<div className="mt-2 flex flex-wrap items-center gap-4 ">
								{attachment?.map((file: any, index: number) => (
									<div key={index} className="relative">
										{file.type.startsWith("image/") ? (
											<img
												src={URL.createObjectURL(file)}
												alt={file.name}
												className="w-[200px] h-[200px] overflow-scroll  rounded-lg"
											/>
										) : (
											<iframe
												src={URL.createObjectURL(file)}
												title={file.name}
												className="w-[200px] h-[200px] overflow-scroll border rounded-lg"
											/>
										)}

										<RxCross2
											size={22}
											className=" cursor-pointer absolute top-0 right-0 text-red-500"
											onClick={() => handleRemoveFile(index)}
										/>
									</div>
								))}
							</div>
						</div>
					</div>
					<SubmitButton text="Create" />
				</div>
			</form>
		</div>
	);
};

export default DoctorForm;
