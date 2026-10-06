
'use client'
import { buildDoctorId} from "../../types/Type";
import Link from "next/link";
import {useState} from "react";
import {Switch, Tabs} from "antd";
import moment from "moment";
import DoctorDetailField from "./DoctorDetailField";
import StatusModal from "./StatusModal";
import { Image } from 'antd';
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

const DoctorDetails = ({doctor}: { doctor: any }) => {
	const [showModal, setShowModal] = useState<boolean>(false);

	const handleStatusChange = () => {
		setShowModal(true);
	};

	const formatTime = (time: any) => {
		return moment(time, "HH:mm").format("hh:mm A");
	};

	return (
		<div className="pb-4 md:pb-0">
			<div className="grid grid-cols-12 gap-2">
				<div className="col-span-12 md:col-span-3">
					<div className="border border-primary bg-white rounded-xl p-4 shadow-md h-[500px]">
						<div className="flex flex-col items-center gap-5">


							<Image
								src={doctor?.profilePic}
								width={100}
								height={100}
								alt={"doctor"}
								className="object-cover rounded-full"

							/>


							<div className="flex flex-col items-center text-center gap-3">
								<h2 className="text-primary font-bold text-lg">{doctor?.name}</h2>
								<h2 className="text-primary text-sm">{doctor?.specialty?.name?.en}</h2>
								<div style={{height: "80px", overflowY: "auto"}}>
									<p className="text-xs italic ">{doctor?.biography ?? "-"}</p>
								</div>
								<RolePermissionChecker tag="doctor" name="update">
									<Switch checked={doctor?.isActive} onChange={handleStatusChange}/>
								</RolePermissionChecker>

								<button
									className={`rounded-md py-0 px-4 ${doctor?.isActive ? 'bg-[#DBFEE3] border-[#B5FD93] text-[#12B76A]' : 'bg-[#FEDBDB] border-[#FD9393] text-[#B71212]'}`}>
									{doctor?.isActive ? 'Active' : 'Inactive'}
								</button>
								<div className=" border-primary border-b-2 border-dotted">
									<Image
										width={50}
										src={doctor?.signatureUrl}

									/>
								</div>
							</div>
							<RolePermissionChecker tag="doctor" name="update">
								<div className="">
									<Link href={`${doctor?.id}/update`}
												className="bg-primary-400 text-white rounded-md font-semibold text-sm py-2 px-3 text-center w-full md:w-[150px] ">
										Update Details
									</Link>
								</div>
							</RolePermissionChecker>

						</div>
					</div>
				</div>

				<div className="col-span-12 md:col-span-9 ">
					<div className="border border-primary bg-white rounded-xl p-5 shadow-md h-[500px]">
						<Tabs defaultActiveKey="1">
							<Tabs.TabPane tab="Personal Info" key="1">
								<div className="flex flex-col  gap-2">
									<DoctorDetailField title="ID" value={buildDoctorId(doctor?.id)}/>
									<DoctorDetailField title="Email Address" value={doctor?.email}/>
									<DoctorDetailField title="Mobile Number" value={doctor?.mobile}/>
									<DoctorDetailField title="Education" value={doctor?.degrees ? doctor?.degrees : 'N/A'}/>
								</div>
							</Tabs.TabPane>
							<Tabs.TabPane tab="Professional Info" key="2">
								<div className="flex flex-col  gap-2">
									<DoctorDetailField
										title="Appointment Time Period"
										value={(doctor?.timePeriod ?? 15) + ' minutes'}
									/>
									<DoctorDetailField title="Experience" value={`${doctor?.experience} Years`}/>
									<DoctorDetailField title="Current Working Place" value={`${doctor?.working_at}`}/>
									<DoctorDetailField title="BMDC Code" value={doctor?.bmdcCode ? doctor?.bmdcCode : 'N/A'}/>
									<DoctorDetailField title="BMDC Expiry Date"
																		 value={doctor?.bmdcExpiryDate ? moment(doctor?.bmdcExpiryDate).format('lll') : 'N/A'}/>
								</div>

							</Tabs.TabPane>
							<Tabs.TabPane tab="Platform Info" key="3">
								<div className="flex flex-col  gap-2">
									<DoctorDetailField title="Fee" value={`${doctor?.fee ?? 0} Tk`}/>
									<DoctorDetailField title="Commission" value={`${doctor?.commission ?? 0} %`}/>
									<DoctorDetailField title="Rating" value={(doctor?.rating?.rating ?? 0).toFixed(1)}/>
									<DoctorDetailField title="Patient Checked" value={doctor?.patientChecked ?? 0}/>
								</div>

							</Tabs.TabPane>
							<Tabs.TabPane tab="Bank Info" key="4">
								<div className="flex flex-col  gap-1">
									<div>
										{
											doctor?.bankDetails?.accountType?.toLowerCase() == 'bank' ?
												<div>

													{doctor?.bankDetails?.accountNo &&
														<DoctorDetailField title="Account No" value={doctor?.bankDetails?.accountNo}/>}

													{doctor?.bankDetails?.bankName &&
														<DoctorDetailField title="Bank Name" value={doctor?.bankDetails?.bankName}/>}
													{doctor?.bankDetails?.branchName &&
														<DoctorDetailField title="Branch Name" value={doctor?.bankDetails?.branchName}/>}
													{doctor?.bankDetails?.accountName &&
														<DoctorDetailField title="Account Name" value={doctor?.bankDetails?.accountName}/>}
													{doctor?.bankDetails?.routingNumber &&
														<DoctorDetailField title="Routing Number" value={doctor?.bankDetails?.routingNumber}/>}

												</div> :
												<div>
													{doctor?.bankDetails?.mfsType &&
														<DoctorDetailField title="MFS Type" value={doctor?.bankDetails?.mfsType}/>}
													{doctor?.bankDetails?.accountType &&
														<DoctorDetailField title="Account Type" value={doctor?.bankDetails?.accountType}/>}
													{doctor?.bankDetails?.accountNo &&
														<DoctorDetailField title="Account No" value={doctor?.bankDetails?.accountNo}/>}
												</div>
										}
									</div>

								</div>

							</Tabs.TabPane>

						</Tabs>

					</div>

				</div>

			</div>
			<div className="mb-6 pt-6">

				<div className="flex flex-wrap items-center gap-4 ">
					{doctor?.fileManagement?.map((file: any, index: any) => (
						<div key={index} className="relative">
							{file.mimetype == "application/pdf" ? (
								<iframe
									src={file?.url}
									title={file.originalname}
									width="400" height="400"
									className=" overflow-scroll border rounded-lg"
								/>
							) :file.mimetype == "image/jpeg" ? (
								<img
									src={file?.url}
									alt={file.originalname}
									width="400" height="400"
									className=" overflow-scroll  rounded-lg"
								/>
							):''}

						</div>
					))}
				</div>
			</div>

			{showModal && (
				<StatusModal setShowModal={setShowModal} doctorId={doctor.id} requestedStatus={doctor.isActive ? 0 : 1}/>
			)}
		</div>
	);
};

export default DoctorDetails;

