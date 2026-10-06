import AppointmentManualPayment from "@/app/(logged-in)/appointment/components/AppointmentManualPayment";
import { Appts } from "@/app/(logged-in)/appointment/types/Models";
import UpdateActionButton from "@/app/components/buttons/actionButtons/UpdateActionButton";
import ViewActionButton from "@/app/components/buttons/actionButtons/ViewActionButton";
import FormattedTime from "@/app/components/layout/FormattedTime";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import DataTable from "@/app/components/tables/DataTable";
import { Option } from "@/app/types/Options";
import { patientAge } from "@/helper/DateHelper";
import { formatDateOnly } from "@/helper/DateTimeHelper";
import { formatDhaka } from "@/helper/DhakaTime";
import { message, Tooltip } from "antd";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineSchedule } from "react-icons/ai";
import { MdDiscount, MdOutlineCancelPresentation, MdOutlinePayments } from "react-icons/md";
import { RiRefund2Fill } from "react-icons/ri";
import { TbTax } from "react-icons/tb";
import AppointmentUpdateModal from "./AppointmentUpdateModal";
import CancelModal from "./CancelModal";
import DiscountModal from "./DiscountModal";
import ExportInvoice from "./ExportInvoice";
import PaymentModal from "./PaymentModal";
import RefundModal from "./RefundModal";
import VatUpdateModal from "./VatUpdateModal";
import { FaInfoCircle } from "react-icons/fa";

// The API stores criteria lowercase ("follow-up"); the criteria option list
// carries the labels the booking form shows.
const getCriteriaLabel = (criteria: string | undefined, criteriaOptions: Option[]) =>
	criteria ? (criteriaOptions.find((option) => option.value === criteria)?.label ?? criteria) : "";

const AppointmentDataTable = ({
	tableData,
	paginationUrl,
	paginationData,
	fetchData,
	isReporting = false,
	loading = false,
	options,
}: any) => {
	console.log(tableData, "table data in appointment data table");
	const router = useRouter();
	const [paymentModal, setPaymentModal] = useState<any>(false);
	const [appointmentDetails, setAppointmentDetails] = useState<any>({
		status: "",
		notes: "",
		criteria: "",
		appointmentType: "",
		createdById: "",
	});
	const [selectedDetails, setSelectedDetails] = useState<any>(null);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showRefundModal, setShowRefundModal] = useState<boolean>(false);
	const [showDiscountModal, setShowDiscountModal] = useState<boolean>(false);
	const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
	const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
	const [showVatModal, setShowVatModal] = useState<boolean>(false);
	// The executive list now lives in AppointmentUpdateModal, which loads it on
	// open and searches server-side. It used to be fetched here on every mount
	// of the appointment list, whether or not the modal was ever opened.

	const handleCancelAppointment = (appointment: any) => {
		setAppointmentDetails(appointment);
		setShowModal(true);
	};
	const handleRefundAppointment = (appointment: any) => {
		setAppointmentDetails(appointment);
		setShowRefundModal(true);
	};
	const handleDiscountAppointment = (appointment: any) => {
		setAppointmentDetails(appointment);
		setShowDiscountModal(true);
	};
	const handlePaymentAppointment = (appointment: any) => {
		setAppointmentDetails(appointment);
		setShowPaymentModal(true);
	};
	const handleUpdateAppointment = (appointment: any) => {
		setAppointmentDetails(appointment);
		setShowUpdateModal(true);
	};
	const handleUpdateVat = (appointment: any) => {
		setAppointmentDetails(appointment);
		setShowVatModal(true);
	};

	console.log("check data", tableData);
	const columns: any = [
		{
			title: "Booking",
			dataIndex: "scheduleDate",
			key: "scheduleDate",
			render: (_: any, record: any) => (
				<div className="text-xs">
					{/* {JSON.stringify(record)} */}
					<p className="text-gray-800 font-medium">
						{record?.createdBy?.nickName ? record?.createdBy?.nickName : record?.createdBy?.fullName}
					</p>
					<p className="text-gray-600 font-normal">
						{record?.createdAt && formatDhaka(record.createdAt, "MMM DD, YYYY, hh:mm A")}
					</p>
				</div>
			),
		},
		{
			title: "Schedule Info",
			dataIndex: "scheduleDate",
			key: "scheduleDate",
			render: (_: any, record: any) => (
				<div className="text-xs">
					<p className="text-gray-800 font-medium">{formatDateOnly(record?.scheduleStart)}</p>
					<p className="text-gray-600 font-normal">
						<FormattedTime isoString={record?.scheduleStart} /> - <FormattedTime isoString={record?.scheduleEnd} />(
						{record?.duration})
					</p>
					{record?.criteria && (
						<span className="mt-1 inline-block rounded-md bg-[#F0F4F1] px-2 py-0 text-[11px] font-medium text-[#227F27]">
							{getCriteriaLabel(record.criteria, options.criteria)}
						</span>
					)}
				</div>
			),
		},
		{
			title: "Doctor",
			dataIndex: "doctor",
			key: "doctor",
			render: (text: string, record: any) => (
				<div className="text-xs">
					<p className="text-gray-800 font-medium"> {record?.doctor?.name || "-"}</p>
					<p className="text-gray-600 font-normal"> {record?.branch?.name || "-"}</p>
				</div>
			),
		},
		{
			title: "Patient Info",
			dataIndex: "patientName",
			key: "patientName",
			render: (_: string, record: any) => (
				<div className="text-xs">
					<p className="text-xs text-gray-800 font-medium">
						{record?.patientDetails?.fullName || record?.patient?.name || "-"}
					</p>
					<p className="text-xs text-gray-700 font-medium">
						{record?.patientDetails?.mobile || record?.patient?.mobile || "-"}
					</p>
					<p className="text-gray-600 font-normal">
						{patientAge(record?.patientDetails, record?.patient)}
					</p>
				</div>
			),
		},
		{
			title: "User Info",
			dataIndex: "patientName",
			key: "patientName",
			render: (_: string, record: any) => (
				<div className="text-xs">
					{/* <p>ID: {record?.id}</p> */}
					<p className="text-xs text-gray-800 font-medium">
						{record?.patient?.fullName || record?.patient?.name || "-"}
					</p>
					<p className="text-xs text-gray-700 font-medium">
						{record?.patient?.mobile || record?.patient?.mobile || "-"}
					</p>
					<p className="text-gray-600 font-normal">{patientAge(record?.patient)}</p>
				</div>
			),
		},
		// {
		// 	title: "Created By",
		// 	dataIndex: "createdByType",
		// 	render: (_: any, record: any) => (
		// 		<>
		// 			<p>{record?.createdByType}</p>
		// 			<p>{record?.createdBy?.fullName}</p>
		// 		</>
		// 	),
		// },
		{
			title: "Fee",
			dataIndex: "appointmentType",
			key: "appointmentType",
			render: (_: string, record: any) => (
				<div className="text-xs">
					<p className="font-semibold text-xs text-gray-900">Appt. ID: {record?.id}</p>
					<p className="font-semibold text-md text-gray-900">{record?.paymentSummary?.fee} BDT</p>
					<p className="uppercase text-gray-700 font-medium">{record?.appointmentType}</p>
				</div>
			),
		},

		{
			title: "Discount",
			dataIndex: "appointmentType",
			key: "appointmentType",
			render: (_: string, record: any) => {
				const discount = record?.paymentSummary?.discount;
				const remarks = record?.paymentDetails?.discountRemarks;

				return (
					<div className="text-xs flex flex-col gap-1">
						<div className="flex items-center gap-1">
							<span className="text-gray-800 font-medium">{discount ?? 0} BDT</span>

							{remarks && (
								<Tooltip title={remarks} placement="top">
									<span className="cursor-pointer text-blue-500">
										<FaInfoCircle size={12} />
									</span>
								</Tooltip>
							)}
						</div>
					</div>
				);
			},
		},
		{
			title: "VAT",
			dataIndex: "VAT",
			key: "vat",
			render: (_: string, record: any) => (
				<div className="text-xs">
					<p className="text-gray-800 font-medium">{record?.paymentSummary?.vatPercentage} % </p>
					<p className="text-gray-700 font-medium">{record?.paymentSummary?.vatAmount} BDT</p>
				</div>
			),
		},
		{
			title: "Payable",
			dataIndex: "appointmentType",
			key: "appointmentType",
			render: (_: string, record: any) => (
				<div className="text-xs text-gray-800 font-semibold">{record?.paymentSummary?.payable} BDT</div>
			),
		},
		{
			title: "Paid",
			dataIndex: "appointmentType",
			key: "appointmentType",
			render: (_: string, record: any) => (
				<div className="text-xs">
					<p className="text-gray-800 font-semibold">{Number(record?.paymentSummary?.paidAmount)} BDT</p>
					<p className="text-gray-600 font-normal">{record?.paymentSummary?.note}</p>
				</div>
			),
		},
		{
			title: "Due",
			dataIndex: "appointmentType",
			key: "appointmentType",
			render: (_: string, record: any) => (
				<div className="text-xs text-gray-800 font-semibold">
					{record?.paymentSummary?.dueAmount ? `${record?.paymentSummary?.dueAmount} BDT` : "0 BDT"}{" "}
				</div>
			),
		},
		{
			title: "Refund Amount",
			dataIndex: "refundAmount",
			key: "refundAmount",
			render: (_: string, record: any) => {
				const refundAmount = record?.paymentSummary?.refundAmount;
				const refundRemarks = record?.paymentDetails?.refundremarks;

				return (
					<div className="text-xs flex flex-col gap-1">
						<div className="flex items-center gap-1">
							<span className="text-gray-800 font-medium">{refundAmount ?? 0} BDT</span>

							{refundRemarks && (
								<Tooltip title={refundRemarks} placement="top">
									<span className="cursor-pointer text-blue-500">
										<FaInfoCircle size={12} />
									</span>
								</Tooltip>
							)}
						</div>
					</div>
				);
			},
		},
		{
			title: "Payment Status",
			dataIndex: "paymentStatus",
			key: "paymentStatus",
			render: (_: string, record: any) => (
				<div className="text-xs text-gray-800 font-semibold">{record?.paymentSummary?.paymentStatus} </div>
			),
		},
		{
			title: "Package",
			dataIndex: "paymentStatus",
			key: "paymentStatus",
			render: (_: string, record: any) => (
				<div className="text-xs text-gray-800 font-semibold">{record?.packageName || "N/A"} </div>
			),
		},

		{
			title: "Appt. Status",
			dataIndex: "apptStatus",
			key: "apptStatus",
			render: (_: string, appointment: any) => (
				<div>
					<button
						className={clsx("rounded-md py-0 px-2", {
							"bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]": Appts.isScheduled(appointment),
							"bg-[#DBFEE3] border-[#B5FD93] text-[#12B76A]": Appts.isCompleted(appointment),
							"bg-[#FEDBDB] border-[#FD9393] text-[#B71212]": Appts.isCancelled(appointment),
							"bg-[#bcb9e2] border-[#be9292] text-white": Appts.isPending(appointment),
						})}
					>
						{Appts.getStatusLabel(appointment)}
					</button>
				</div>
			),
		},
		// {
		// 	title: "notes",
		// 	dataIndex: "notes",
		// 	key: "notes",
		// },
		{
			title: `${!isReporting ? "Action" : ""}`,
			render: (_: any, record: any) => {
				if (isReporting) return null;

				return (
					<div className="flex flex-wrap gap-2 justify-start items-center gap-x-2">
						<ViewActionButton
							rolePermissionTag="appointment"
							onButtonClick={() => router.push(`/appointment/${record.id}`)}
						/>
						<UpdateActionButton rolePermissionTag="appointment" onButtonClick={() => handleUpdateAppointment(record)} />

						{/* ADD Payment */}
							<RolePermissionChecker tag="appointment" name="payment">
								<Tooltip placement="top" title="Payment" color="#2db7f5">
									<div
										className="bg-orange-600 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
										onClick={() => handlePaymentAppointment(record)}
									>
										<MdOutlinePayments size={16} />
									</div>
								</Tooltip>
							</RolePermissionChecker>

							{/* DISCOUNT BUTTON */}
							<RolePermissionChecker tag="appointment" name="discount">
								<Tooltip placement="top" title="Discount" color="#2db7f5">
									<div
										className="bg-purple-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
										onClick={() => handleDiscountAppointment(record)}
									>
										<MdDiscount size={16} />
									</div>
								</Tooltip>
							</RolePermissionChecker>

							{/* RESCHEDULE BUTTON */}
							<RolePermissionChecker tag="appointment" name="reschedule">
								<Tooltip placement="top" title="Reschedule Appointment" color="#2db7f5">
									<Link
										className="bg-primary-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
										href={`/appointment/reschedule-appointment/${record.id}`}
									>
										<AiOutlineSchedule size={16} />
									</Link>
								</Tooltip>
							</RolePermissionChecker>

							{/* REFUND BUTTON */}
							<RolePermissionChecker tag="appointment" name="refund">
								<Tooltip placement="top" title="Refund" color="#2db7f5">
									<div
										className="bg-blue-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
										onClick={() => handleRefundAppointment(record)}
									>
										<RiRefund2Fill size={16} />
									</div>
								</Tooltip>
							</RolePermissionChecker>

							{/* CANCEL BUTTON */}
							<RolePermissionChecker tag="appointment" name="cancel">
								<Tooltip placement="top" title="Cancel Appointment" color="#2db7f5">
									<div
										className="bg-red-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
										onClick={() => handleCancelAppointment(record)}
									>
										<MdOutlineCancelPresentation size={16} />
									</div>
								</Tooltip>
							</RolePermissionChecker>
							<RolePermissionChecker tag="appointment" name="vat">
								<Tooltip placement="top" title="Update VAT" color="#2db7f5">
									<div
										className="bg-teal-400 flex items-center justify-center rounded-md p-1 cursor-pointer text-white"
										onClick={() => handleUpdateVat(record)}
									>
										<TbTax size={16} />
									</div>
								</Tooltip>
							</RolePermissionChecker>
							<ExportInvoice id={record.id} isCurrencyUSD={false} />
							<ExportInvoice id={record.id} isCurrencyUSD={true} />
					</div>
				);
			},
		},
	];

	return (
		<>
			<div>
				<DataTable
					rolePermissionTag="appointment"
					tableColumns={columns}
					tableData={tableData}
					paginationUrl={paginationUrl}
					paginationData={paginationData}
					loading={loading}
					expandable={{
						expandedRowRender: (record: any) => (
							<div className="text-sm px-4 py-2 space-y-2">
								<div>
									<strong>Payment Remarks:</strong>
									{Array.isArray(record?.paymentRemarks) && record?.paymentRemarks?.length > 0 ? (
										<ul className="list-disc pl-5 mt-1">
											{record.paymentRemarks.map((remark: string, index: number) => (
												<li key={index}>{remark}</li>
											))}
										</ul>
									) : (
										<p>No payment remarks available.</p>
									)}
								</div>

								{/* whitespace-pre-wrap: notes are a stamped log, one entry per
								    block, and HTML would otherwise run them into a single line. */}
								<div className="whitespace-pre-wrap">
									<strong>Appointment Notes:</strong> {record?.notes || "No notes available."}
								</div>
							</div>
						),
						rowExpandable: (record: any) => !!record.notes || record?.paymentRemarks?.length > 0, // Only expandable if notes exist
					}}
				/>

				<AppointmentManualPayment
					paymentModal={paymentModal}
					setPaymentModal={setPaymentModal}
					selectedDetails={selectedDetails}
					options={options}
				/>
			</div>
			{showModal && tableData?.id !== null && (
				<CancelModal setShowModal={setShowModal} appointmentId={appointmentDetails.id} fetchData={fetchData} />
			)}

			<RefundModal
				setShowModal={setShowDiscountModal}
				showModal={showRefundModal}
				appointment={appointmentDetails}
				setAppointmentDetails={setShowRefundModal}
				fetchData={fetchData}
			/>
			<DiscountModal
				setShowModal={setShowDiscountModal}
				showModal={showDiscountModal}
				appointment={appointmentDetails}
				setAppointmentDetails={setAppointmentDetails}
				fetchData={fetchData}
			/>
			<PaymentModal
				setShowModal={setShowPaymentModal}
				showModal={showPaymentModal}
				appointment={appointmentDetails}
				setAppointmentDetails={setAppointmentDetails}
				fetchData={fetchData}
				options={options}
			/>
			<AppointmentUpdateModal
				appointment={appointmentDetails}
				isModalOpen={showUpdateModal}
				onClose={() => setShowUpdateModal(false)}
				fetchData={fetchData}
				options={options}
			/>
			<VatUpdateModal
				setShowModal={setShowVatModal}
				showModal={showVatModal}
				appointment={appointmentDetails}
				setAppointmentDetails={setAppointmentDetails}
				fetchData={fetchData}
			/>
		</>
	);
};

export default AppointmentDataTable;
