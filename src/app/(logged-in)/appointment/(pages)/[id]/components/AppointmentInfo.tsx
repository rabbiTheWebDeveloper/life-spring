"use client";
import React, { useState } from "react";
import { patientAge } from "@/helper/DateHelper";
import clsx from "clsx";
import { Appts, Payments } from "../../../types/Models";
import CancelModal from "../../../components/CancelModal";
import { buildDoctorId } from "@/app/(logged-in)/doctor/types/Type";
import FormattedTime from "@/app/components/layout/FormattedTime";
import FormattedDate, { formatDate } from "@/app/components/layout/FormattedDate";
import { useRouter } from "next/navigation";
import { Button, Modal, Space, Tooltip } from "antd";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdOutlineCancelPresentation } from "react-icons/md";
import DoctorDetailField from "@/app/(logged-in)/doctor/[id]/components/DoctorDetailField";
import { Image } from "antd";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

const AppointmentInfo = ({ appointment }: any) => {
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const router = useRouter();
	const doctorFields = [
		{ title: "Doctor ID", value: buildDoctorId(appointment?.doctor?.id) },
		{ title: "Name", value: appointment?.doctor?.name },
		{ title: "Email", value: appointment?.doctor?.email },
		{ title: "Mobile", value: appointment?.doctor?.mobile },
		{ title: "Degrees", value: appointment?.doctor?.degrees },
		{ title: "Experience", value: `${appointment?.doctor?.experience} Years` },
		{ title: "BMDC Code", value: appointment?.doctor?.bmdcCode },
		{ title: "BMDC Expiry Date", value: formatDate(appointment?.doctor?.bmdcExpiryDate) },
		{ title: "Fee", value: `${appointment?.doctor?.fee} Tk` },
		{ title: "Commission", value: `${appointment?.doctor?.commission} %` },
	];
	const pdfUrl = appointment?.prescriptionLink;

	// Wrap the PDF URL in Google Docs Viewer
	const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(pdfUrl)}&embedded=true`;

	const patientFields = [
		{ title: "Name", value: appointment?.patientDetails?.name || appointment?.patient?.name },
		{ title: "Mobile", value: appointment?.patientDetails?.mobile || appointment?.patient?.mobile },
		{ title: "Age", value: patientAge(appointment?.patientDetails, appointment?.patient) },
		{ title: "Gender", value: appointment?.patientDetails?.gender },
		{
			title: "Weight",
			value: `${appointment?.patientDetails?.weight > 0 ? appointment?.patientDetails?.weight + "Kg" : "--"}`,
		},
		// { title: "Problems", value: appointment?.patientDetails?.problems },
	];

	const handleCancelAppointment = (id: number) => {
		setShowModal(true);
	};
	const handleRefundAppointment = (id: number) => {
		setShowRefundModal(true);
	};

	return (
		<div className="">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="p-6 shadow-md rounded-lg border border-gray-200">
					<div className="flex items-center justify-between">
						<h4 className="text-lg font-semibold text-blue-600 mb-2">Appointment Information</h4>
						<div className="flex flex-col gap-2">
							{Appts.isScheduled(appointment) && (
								<div className="flex gap-3 items-start">
									<RolePermissionChecker tag="appointment" name="update">
										<Tooltip placement="top" title={"Reschedule"} color={"#2db7f5"}>
											<div
												className="bg-primary-400 flex items-center justify-center rounded-md px-2 py-2 cursor-pointer text-white"
												onClick={() => router.push(`/appointment/reschedule-appointment/${appointment?.id}`)}
											>
												<AiOutlineSchedule size={18} />
											</div>
										</Tooltip>
									</RolePermissionChecker>
									<RolePermissionChecker tag="appointment" name="update">
										<Tooltip placement="top" title={"Cancel"} color={"#2db7f5"}>
											<div
												className="bg-red-200 flex items-center justify-center rounded-md px-2 py-2 cursor-pointer text-white"
												onClick={() => handleCancelAppointment(appointment?.id)}
											>
												<MdOutlineCancelPresentation size={18} />
											</div>
										</Tooltip>
									</RolePermissionChecker>
								</div>
							)}
						</div>
					</div>
					<DoctorDetailField title="Appointment ID" value={appointment?.id} />
					<div className="flex items-center justify-between border-b border-slate-300">
						<h2 className="font-semibold">Created At: </h2>
						<h2 className="text-sm font-medium">
							<>
								<FormattedTime isoString={appointment?.createdAt} />,{" "}
								<FormattedDate isoString={appointment?.createdAt} />
							</>
						</h2>
					</div>
					<div className="flex items-center justify-between border-b border-slate-300">
						<h2 className="font-semibold">Schedule Start: </h2>
						<h2 className="text-sm font-medium">
							<>
								<FormattedTime isoString={appointment?.scheduleStart} />,{" "}
								<FormattedDate isoString={appointment?.scheduleStart} />
							</>
						</h2>
					</div>
					<div className="flex items-center justify-between border-b border-slate-300">
						<h2 className="font-semibold">Schedule End: </h2>
						<h2 className="text-sm font-medium">
							<>
								<FormattedTime isoString={appointment?.scheduleEnd} />,{" "}
								<FormattedDate isoString={appointment?.scheduleEnd} />
							</>
						</h2>
					</div>
					<DoctorDetailField title="Created By" value={appointment?.createdByType} />

					{/*{*/}
					{/*	appointment?.prescriptionLink &&*/}
					{/*	<div className="flex items-center justify-between border-b border-slate-300">*/}
					{/*		<h2 className="font-medium">Prescription Link:</h2>*/}
					{/*		<button*/}
					{/*			onClick={() => window.open(appointment?.prescriptionLink, '_blank', 'noopener,noreferrer')}*/}
					{/*			className="underline text-blue-600 hover:text-blue-800"*/}
					{/*		>*/}
					{/*			Open Prescription*/}
					{/*		</button>*/}

					{/*	</div>*/}
					{/*}*/}
					<RolePermissionChecker tag="appointment" name="prescription-view">
						{appointment?.prescriptionLink && (
							<div className="flex items-center justify-between border-b border-slate-300">
								<h2 className="font-semibold text-primary">Prescription</h2>
								<button
									onClick={() => {
										setIsModalVisible(true);
									}}
									className="underline text-blue-600 hover:text-blue-800"
								>
									Open Prescription
								</button>
							</div>
						)}
					</RolePermissionChecker>

					<div className="flex items-center border-b border-slate-300 mb-1 justify-between mt-1">
						<h2 className="font-semibold">Appointment Status</h2>
						<button
							className={clsx("rounded-md py-.5 px-3.5", {
								"bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]": Appts?.isScheduled(appointment),
								"bg-[#DBFEE3] border-[#B5FD93] text-[#12B76A]": Appts?.isCompleted(appointment),
								"bg-[#FEDBDB] border-[#FD9393] text-[#B71212]": Appts?.isCancelled(appointment),
								"bg-[#bcb9e2] border-[#be9292] text-white": Appts?.isPending(appointment),
							})}
						>
							{appointment?.status}
						</button>
					</div>
					<div className="flex items-center border-b border-slate-300 mb-1 justify-between mt-1">
						<h2 className="font-semibold">Payment Status</h2>
						<button
							className={clsx("rounded-md py-.5 px-3.5", {
								"bg-teal-500 border-[#B5FD93] text-white": Payments?.isPaid(appointment),
								"bg-amber-500 border-amber-300 text-white": Payments?.isPartiallyPaid(appointment),
								"bg-cyan-500 border-[#93C5FD] text-white": Payments?.isUnpaid(appointment),
							})}
						>
							{Payments?.getStatusValue(appointment)}
						</button>
					</div>
				</div>
				<div className="p-6 shadow-md rounded-lg border border-gray-200">
					<h4 className="text-lg font-semibold text-blue-600 mb-2">Doctor Information</h4>
					{doctorFields.map((field, index) => (
						<DoctorDetailField key={index} title={field?.title} value={field?.value} />
					))}

					<div className="flex items-center justify-between mt-1">
						<h2 className="font-semibold">Doctor Status</h2>
						<button
							className={clsx("min-w-fit w-fit px-3 py-.5 text-sm rounded-md text-center", {
								"bg-pink-200 ": appointment?.doctor?.isActive,
								"bg-red-200": !appointment?.doctor?.isActive,
							})}
						>
							{appointment?.doctor?.isActive ? "Active" : "Inactive"}
						</button>
					</div>
				</div>
				<div className="p-6 shadow-md rounded-lg border border-gray-200">
					<h4 className="text-lg font-semibold text-blue-600 mb-2">Patient Information</h4>
					{patientFields?.map((field, index) => (
						<DoctorDetailField key={index} title={field.title} value={field.value} />
					))}
					<RolePermissionChecker tag="appointment" name="reason-view">
						{
							<div className="flex items-center justify-between border-b border-slate-300">
								<h2 className="font-semibold text-primary">Problems</h2>
								<p>{appointment?.patientDetails?.problems ? appointment?.patientDetails?.problems : "--"}</p>
							</div>
						}
					</RolePermissionChecker>
				</div>
			</div>
			<RolePermissionChecker tag="appointment" name="attachment-view">
				<div className="p-6 mt-5 bg-white rounded-lg border border-gray-200">
					<h4 className="text-lg font-semibold text-blue-600 mb-2">Patient Documents</h4>
					<div>
						{appointment?.attachments?.length > 0 ? (
							<div className="flex flex-wrap items-center gap-4">
								{appointment?.attachments?.map((file: any, index: any) => (
									<div key={index} className="relative">
										{file.endsWith(".pdf") ? (
											<iframe
												src={file}
												title={`attachment-${index}`}
												className="w-[300px] h-[300px] overflow-scroll rounded-md border"
											/>
										) : (
											<Image width={300} src={file} className="rounded-md border" />
										)}
									</div>
								))}
							</div>
						) : (
							<div className="text-center p-10 text-2xl font-medium text-gray-500">No documents uploaded yet</div>
						)}
					</div>
				</div>
			</RolePermissionChecker>

			{showModal && appointment.id !== null && (
				<CancelModal
					setShowModal={setShowModal}
					appointmentId={appointment?.id}
					fetchData={() => window.location.reload()}
				/>
			)}

			<Modal
				title="Prescription View"
				open={isModalVisible}
				width="70%"
				style={{ top: 40, overflow: "auto" }}
				onCancel={() => {
					setIsModalVisible(false);
				}}
				footer={null}
			>
				<div>
					<Space style={{ marginBottom: 16 }}>
						{/* Download button */}
						<a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
							<Button type="default" className="bg-primary-400 text-white">
								Download Prescription
							</Button>
						</a>
					</Space>

					<iframe src={googleViewerUrl} title="PDF Viewer" width="100%" height="600px" style={{ border: "none" }} />
				</div>
			</Modal>
		</div>
	);
};

export default AppointmentInfo;
