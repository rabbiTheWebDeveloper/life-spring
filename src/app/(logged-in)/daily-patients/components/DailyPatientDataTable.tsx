import { Appts } from "@/app/(logged-in)/appointment/types/Models";
import FormattedTime from "@/app/components/layout/FormattedTime";
import DataTable from "@/app/components/tables/DataTable";
import { patientAge } from "@/helper/DateHelper";
import { formatDateOnly } from "@/helper/DateTimeHelper";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";

const DailyPatientDataTable = ({ tableData, paginationUrl, paginationData, fetchData, isReporting = false, loading }: any) => {
	console.log(tableData);
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

	console.log("check data", tableData);
	const columns: any = [
		// {
		// 	title: "Booking",
		// 	dataIndex: "scheduleDate",
		// 	key: "scheduleDate",
		// 	render: (_: any, record: any) => (
		// 		<div className="text-xs">
		// 			<p>{record?.createdBy?.nickName ? record?.createdBy?.nickName : record?.createdBy?.fullName}</p>
		// 			<p>{formatDateOnly(record?.createdAt)}</p>
		// 			<p>
		// 				<FormattedTime isoString={record?.createdAt} />
		// 			</p>
		// 		</div>
		// 	),
		// },
		{
			title: "Schedule Info",
			dataIndex: "scheduleDate",
			key: "scheduleDate",
			render: (_: any, record: any) => (
				<div className="text-xs">
					<p>{formatDateOnly(record?.scheduleStart)}</p>
					<p>
						<FormattedTime isoString={record?.scheduleStart} /> - <FormattedTime isoString={record?.scheduleEnd} />(
						{record?.duration})
					</p>
				</div>
			),
		},
		// {
		// 	title: "Doctor",
		// 	dataIndex: "doctor",
		// 	key: "doctor",
		// 	render: (text: string, record: any) => (
		// 		<div className="text-xs">
		// 			<p> {record?.doctor?.name || "-"}</p>
		// 			<p> {record?.branch?.name || "-"}</p>
		// 		</div>
		// 	),
		// },
		{
			title: "Patient Info",
			dataIndex: "patientName",
			key: "patientName",
			render: (_: string, record: any) => (
				<div className="text-xs">
					<p className="text-xs">{record?.patientDetails?.fullName || record?.patient?.name || "-"}</p>
					<p className="text-xs">{record?.patientDetails?.mobile || record?.patient?.mobile || "-"}</p>
					<p>{patientAge(record?.patientDetails, record?.patient)}</p>
				</div>
			),
		},
		// {
		// 	title: "User Info",
		// 	dataIndex: "patientName",
		// 	key: "patientName",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			{/* <p>ID: {record?.id}</p> */}
		// 			<p className="text-xs">{record?.patient?.fullName || record?.patient?.name || "-"}</p>
		// 			<p className="text-xs">{record?.patient?.mobile || record?.patient?.mobile || "-"}</p>
		// 			<p>{getAge(record?.patient?.dob || record?.patient?.dob) || "-"}</p>
		// 		</div>
		// 	),
		// },
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
		// {
		// 	title: "Fee",
		// 	dataIndex: "appointmentType",
		// 	key: "appointmentType",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			<p className="font-semibold text-xs">Appt. ID: {record?.id}</p>
		// 			<p className="font-semibold text-md">{record?.paymentSummary?.fee} BDT</p>
		// 			<p className="uppercase">{record?.appointmentType}</p>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "Payable",
		// 	dataIndex: "appointmentType",
		// 	key: "appointmentType",
		// 	render: (_: string, record: any) => <div className="text-xs">{record?.paymentSummary?.payable} BDT</div>,
		// },
		// {
		// 	title: "Discount",
		// 	dataIndex: "appointmentType",
		// 	key: "appointmentType",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			<p>{record?.paymentSummary?.discount} BDT</p>
		// 			<p>{record?.paymentSummary?.discountRemarks}</p>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "VAT",
		// 	dataIndex: "VAT",
		// 	key: "vat",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			<p>{record?.paymentSummary?.vatPercentage} % </p>
		// 			<p>{record?.paymentSummary?.vatAmount} BDT</p>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "Paid",
		// 	dataIndex: "appointmentType",
		// 	key: "appointmentType",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			<p>{Number(record?.paymentSummary?.paidAmount)} BDT</p>
		// 			<p>{record?.paymentSummary?.note}</p>
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "Due",
		// 	dataIndex: "appointmentType",
		// 	key: "appointmentType",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			{record?.paymentSummary?.dueAmount ? `${record?.paymentSummary?.dueAmount} BDT` : "0 BDT"}{" "}
		// 		</div>
		// 	),
		// },
		// {
		// 	title: "Refund Amount",
		// 	dataIndex: "refundAmount",
		// 	key: "refundAmount",
		// 	render: (_: string, record: any) => (
		// 		<div className="text-xs">
		// 			<p>{record?.paymentSummary?.refundAmount} BDT</p>
		// 			<p>{record?.paymentSummary?.refundremarks} BDT</p>
		// 		</div>
		// 	),
		// },
		{
			title: "Executive",
			dataIndex: "scheduleDate",
			key: "scheduleDate",
			render: (_: any, record: any) => (
				<div className="text-xs">
					<p>{record?.createdBy?.nickName ? record?.createdBy?.nickName : record?.createdBy?.fullName}</p>
				</div>
			),
		},
		{
			title: "Payment Status",
			dataIndex: "paymentStatus",
			key: "paymentStatus",
			render: (_: string, record: any) => <div className="text-xs">{record?.paymentSummary?.paymentStatus} </div>,
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
				/>
			</div>
		</>
	);
};

export default DailyPatientDataTable;
