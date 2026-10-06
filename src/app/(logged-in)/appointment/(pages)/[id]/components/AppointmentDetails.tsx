"use client";

import React, { useEffect, useState } from "react";
import { formatDate } from "@/app/components/layout/FormattedDate";
import FormattedTime from "@/app/components/layout/FormattedTime";
import { patientAge } from "@/helper/DateHelper";
import { formatDateOnly, formatDateTime } from "@/helper/DateTimeHelper";
import { Image, message, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdOutlineCancelPresentation } from "react-icons/md";
import CancelModal from "../../../components/CancelModal";
import { Appts, Payments } from "../../../types/Models";

import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import RefundModal from "@/app/(logged-in)/appointment/components/RefundModal";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import DetailItem from "@/app/components/content/DetailItem";
import PrescriptionViewModal from "@/app/(logged-in)/appointment/(pages)/[id]/components/PrescriptionViewModal";
import AppointmentLogTable from "./LogTable";

interface Props {
	appointment: any;
}

const AppointmentDetails = ({ appointment }: Props) => {
	const [loading, setLoading] = useState(false);
	const [appointmentDiagnosis, setAppointmentDiagnosis] = useState<any>(null);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showRefundModal, setShowRefundModal] = useState<boolean>(false);

	const router = useRouter();
	useEffect(() => {
		if (appointment?.diagnosis) {
			setAppointmentDiagnosis(appointment?.diagnosis);
		}
	}, [appointment]);

	// const handleCancelAppointment = (id: number) => {
	// 	setShowModal(true);
	// };
	const handleRefundAppointment = (id: number) => {
		setShowRefundModal(true);
	};

	// const downloadpdf = async (id: any) => {
	// 	setLoading(true);
	// 	try {
	// 		const res: any = await getAppointmentRequestInvoice(id);
	// 		if (res?.statusCode === 200) {
	// 			message.success("Invoice Download Successfully!");
	// 			window.open(res.data, '_blank');
	// 		} else {
	// 			message.error(res?.message);
	// 		}
	// 	} catch (error) {
	// 		console.error("Failed to submit the form:", error);
	// 		message.error("Something went wrong.");
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };
	if (!appointment) return <Loader />;

	console.log("app", appointment);
	return (
		<>
			{loading ? (
				<Loader />
			) : (
				<div className="bg-gray-50 p-6 ">
					<div className="mb-6 flex items-center justify-between">
						<div>
							<h2 className="text-sm font-bold text-gray-800">Appointment #{appointment?.id}</h2>
							<p className="text-gray-500 text-xs">Requested on {formatDateTime(appointment?.createdAt)}</p>
						</div>
						{/*<RolePermissionChecker tag="appointment" name="export">*/}
						{/*	<DownloadButton onClickFnc={() => downloadpdf(appointment?.id)} title={"Appointment"}/>*/}
						{/*</RolePermissionChecker>*/}
					</div>

					<div
						className={`mb-6 p-4 w-full max-w-[500px] rounded-lg flex items-center justify-between ${
							Appts.isScheduled(appointment)
								? "bg-blue-100"
								: Appts.isCompleted(appointment)
									? "bg-green-100"
									: Appts.isCancelled(appointment)
										? "bg-red-100"
										: Appts.isPending(appointment)
											? "bg-indigo-100"
											: "bg-gray-100"
						}`}
					>
						<div className="flex items-center text-sm">
							<div
								className={`w-3 h-3 rounded-full mr-2 ${
									Appts.isScheduled(appointment)
										? "bg-blue-500"
										: Appts.isCompleted(appointment)
											? "bg-green-500"
											: Appts.isCancelled(appointment)
												? "bg-red-500"
												: Appts.isPending(appointment)
													? "bg-indigo-500"
													: "bg-gray-500"
								}`}
							></div>
							<span className="font-medium capitalize">{appointment.status}</span>
						</div>
						<div className="flex items-center gap-2">
							<div
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									Payments?.isPaid(appointment) ? "bg-green-500 text-white" : "bg-blue-500 text-white"
								}`}
							>
								{Payments?.getStatusValue(appointment)}
							</div>
							{appointment?.appointmentType?.toLowerCase() !== "emergency" && Appts.isScheduled(appointment) && (
								<div className="flex items-center gap-1">
									<RolePermissionChecker tag="appointment" name="update">
										<Tooltip placement="top" title={"Reschedule Appointment"} color={"#2db7f5"}>
											<div
												className="bg-primary-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
												onClick={() => router.push(`/appointment/reschedule-appointment/${appointment?.id}`)}
											>
												<AiOutlineSchedule size={14} />
											</div>
										</Tooltip>
									</RolePermissionChecker>

									{/* <RolePermissionChecker tag="appointment" name="update">
										<Tooltip placement="top" title={"Cancel Appointment"} color={"#2db7f5"}>
											<div
												className="bg-red-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
												onClick={() => handleCancelAppointment(appointment?.id)}
											>
												<MdOutlineCancelPresentation size={14} />
											</div>
										</Tooltip>
									</RolePermissionChecker> */}
								</div>
							)}
							{/*<RolePermissionChecker tag="appointment" name="update">*/}
							{/*	{*/}
							{/*		appointment?.appointmentType?.toLowerCase() !== 'emergency' && (*/}
							{/*			<div>*/}
							{/*				{Payments.isPaid(appointment) &&*/}
							{/*					(Appts.isCompleted(appointment) || Appts.isCancelled(appointment)) &&*/}
							{/*					(appointment?.refund?.status ? (*/}
							{/*						<p></p>*/}
							{/*					) : (*/}
							{/*						<button*/}
							{/*							onClick={() => handleRefundAppointment(appointment?.id)}*/}
							{/*							className="text-[12px] font-semibold text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"*/}
							{/*						>*/}
							{/*							Request for Refund*/}
							{/*						</button>*/}
							{/*					))}*/}
							{/*			</div>*/}
							{/*		)*/}
							{/*	}*/}
							{/*</RolePermissionChecker>*/}
						</div>
					</div>

					{/* Info cards grid */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-blue-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<h3 className="text-sm font-semibold text-gray-800">Appointment Details</h3>
							</div>
							<DetailItem label="Appointment ID" value={appointment?.id} />

							<DetailItem label="Requested At" value={formatDateTime(appointment?.createdAt)} />
							<DetailItem label="Schedule Date" value={formatDateOnly(appointment.scheduleStart)} />
							<DetailItem
								label="Schedule Time"
								value={
									<>
										<FormattedTime isoString={appointment.scheduleStart} />
										{" -- "}
										<FormattedTime isoString={appointment.scheduleEnd} />
									</>
								}
							/>
							<DetailItem label="Created By" value={appointment?.createdByType || "--"} />
							{appointment?.prescriptionLink && (
								<RolePermissionChecker tag="appointment" name="prescription-view">
									<div className="flex justify-between items-center py-3 px-4 border border-blue-200 rounded-md bg-blue-50 shadow-sm mb-2">
										<span className="text-[13px] font-semibold text-blue-800">📄 Prescription Available</span>
										<button
											onClick={() => {
												setIsModalVisible(true);
											}}
											className="text-[12px] font-semibold text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition"
										>
											View Prescription
										</button>
									</div>
								</RolePermissionChecker>
							)}
						</div>
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-purple-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
									</svg>
								</div>
								<h3 className="text-sm font-semibold text-gray-800">Doctor Information</h3>
							</div>
							<DetailItem label="Name" value={appointment?.doctor?.name || "--"} />
							<DetailItem label="Degrees" value={appointment?.doctor?.degrees || "--"} />
							<DetailItem label="Experience" value={`${appointment?.doctor?.experience || "--"} Years`} />
							<DetailItem label="BMDC Code" value={appointment?.doctor?.bmdcCode || "--"} />
							<DetailItem label="BMDC Expiry Date" value={formatDate(appointment?.doctor?.bmdcExpiryDate) || "--"} />
							<DetailItem
								label="Fee"
								value={`${
									appointment?.paymentDetails
										? (appointment?.paymentDetails?.fee ?? "--")
										: appointment?.doctor?.fee || "--"
								} Tk`}
							/>
						</div>
						<div className="bg-white rounded-xl p-5 shadow-sm">
							<div className="flex items-center mb-4">
								<div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-green-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<h3 className="text-sm font-semibold text-gray-800">Patient Information</h3>
							</div>
							<DetailItem label="Name" value={appointment?.patientDetails?.fullName || "--"} />
							<DetailItem
								label="Mobile"
								value={appointment?.patientDetails?.mobile || appointment?.patient?.mobile || "--"}
							/>
							<DetailItem label="Email" value={appointment?.patientDetails?.email || "--"} />
							<DetailItem
								label="Age"
								value={patientAge(appointment?.patientDetails, appointment?.patient)}
							/>
							<DetailItem label="Gender" value={appointment?.patientDetails?.gender || "--"} />
							<DetailItem
								label="Weight"
								value={appointment?.patientDetails?.weight ? `${appointment?.patientDetails?.weight} KG` : "--"}
							/>
							<DetailItem label="Problems" value={appointment?.patientDetails?.problems || "--"} />
							{appointment?.appointmentType?.toLowerCase() !== "emergency" && (
								<div>
									{Payments.isPaid(appointment) &&
										(Appts.isCompleted(appointment) || Appts.isCancelled(appointment)) &&
										(appointment.refund?.status ? (
											<DetailItem label="Refund Status" value={appointment?.refund?.status || "--"} />
										) : (
											<div></div>
										))}
								</div>
							)}
						</div>
					</div>

					{/*{appointment?.status === "Completed" && appointmentDiagnosis?.length>0 &&  (*/}
					{/*	<AppointmentDiagnosisSection appointmentDiagnosis={appointmentDiagnosis} />*/}
					{/*)}*/}

					<RolePermissionChecker tag="appointment" name="attachment-view">
						<div className="bg-white rounded-xl p-6 shadow-sm mt-6">
							<div className="flex items-center mb-4">
								<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-red-600"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3 3 3 0 00-3 3v4a1 1 0 102 0V7a1 1 0 112 0v4a3 3 0 11-6 0V7a5 5 0 1110 0v4a1 1 0 102 0V7a7 7 0 00-14 0v4a1 1 0 102 0V7a5 5 0 015-5z"
											clipRule="evenodd"
										/>
									</svg>
								</div>
								<h3 className="text-sm font-semibold text-gray-800">Attachments</h3>
							</div>

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
												<Image width={300} src={file} alt="patient_files" className="rounded-md border" />
											)}
										</div>
									))}
								</div>
							) : (
								<div className="text-center p-10 text-gray-500">No attachments available</div>
							)}
						</div>
						{appointment?.statusChangelog && <AppointmentLogTable logs={appointment?.statusChangelog} />}
					</RolePermissionChecker>
				</div>
			)}

			{/* {showModal && appointment.id !== null && (
				<CancelModal
					setShowModal={setShowModal}
					appointmentId={appointment?.id}
					fetchData={() => window.location.reload()}
				/>
			)} */}
			{/*{showRefundModal && appointment.id !== null && (*/}
			{/*	<RefundModal setShowRefundModal={setShowRefundModal} appointmentId={appointment?.id} />*/}
			{/*)}*/}

			<PrescriptionViewModal
				isModalVisible={isModalVisible}
				setIsModalVisible={setIsModalVisible}
				appointment={appointment}
			/>
		</>
	);
};

export default AppointmentDetails;
