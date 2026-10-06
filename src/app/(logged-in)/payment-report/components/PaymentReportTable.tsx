"use client";
import DataTable from "@/app/components/tables/DataTable";
import UpdatePaymentActionButton from "./UpdatePaymentActionButton";

// The transaction date the Payment From/To filter matches on: the date the money
// actually changed hands for a manual entry, and the moment it was taken for an
// online one. Both come back as UTC instants and used to be printed raw, so a
// payment taken at midnight on 22 August read as "2026-08-21 18:00:00" and
// looked as though it had been filtered onto the wrong day.
const formatTransactionDate = (record: any) => {
	const value = record?.actualPaymentDate || record?.createdAt;
	if (!value) return "-";

	const date = new Date(value);
	if (isNaN(date.getTime())) return "-";

	return new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).format(date);
};

const PaymentReportTable = ({ data, pagination, url, fetchData, loading, options }: any) => {
	console.log("ABC", data);
	const columns = [
		{
			title: "ID",
			width: 100,
			render: (record: any) => (
				<>
					<p className="text-sm font-bold">{`P-${record?.id}`}</p>
					{/* Who collected the money. Absent for online patient payments —
					    the API only fills receivedBy for staff-taken payments. */}
					{record?.receivedBy?.fullName && (
						<p className="mt-1 text-xs font-normal text-gray-600">
							Received by
							<br />
							<span className="font-medium text-gray-800">{record.receivedBy.fullName}</span>
						</p>
					)}
				</>
			),
		},
		{
			title: "Patient Details",
			render: (record: any) => (
				<>
					<p className="font-bold"> A-{record?.appointment?.id || "-"}</p>
					<p>{record?.appointment?.patientDetails?.fullName || "-"}</p>
					<p>{record?.appointment?.patientDetails?.mobile || "-"}</p>
				</>
			),
		},
		{
			title: "Doctor Details",
			render: (record: any) => (
				<>
					<p>{record?.appointment?.doctor?.name || "-"}</p>
					{/* Only the doctor's name is wanted here for now. Kept rather than
					    deleted so these can be restored without digging them up again. */}
					{/* <p>{record?.appointment?.doctor?.specialty?.name.en || "-"}</p> */}
					{/* <p>{record?.appointment?.doctor?.mobile || "-"}</p> */}
					{/* <p>{record?.appointment?.doctor?.email || "-"}</p> */}
				</>
			),
		},
		{
			title: "Payment Details",
			render: (record: any) => (
				<>
					<p>{`TRNX ID: ${record?.transactionId}` || "-"}</p>
					<p>{record?.paymentMethod || "-"}</p>
					<p>{`TRNX Date: ${formatTransactionDate(record)}`}</p>
				</>
			),
		},
		{
			title: "Fee",
			render: (record: any) => (
				<>
					<p>{record?.appointment?.paymentSummary?.fee || "-"}</p>
				</>
			),
		},
		{
			title: "Discount",
			render: (record: any) => (
				<>
					{/* `?? "-"` rather than `|| "-"`: a legitimate 0 must still print as 0. */}
					<p>{record?.appointment?.paymentSummary?.discount ?? "-"}</p>
				</>
			),
		},
		{
			title: "Vat",
			render: (record: any) => (
				<>
					<p>{`${record?.appointment?.paymentSummary?.vatPercentage} %`}</p>
					<p>{record?.appointment?.paymentSummary?.vatAmount ?? "-"}</p>
				</>
			),
		},
		{
			title: "Due",
			render: (record: any) => (
				<>
					<p>{record?.appointment?.paymentSummary?.dueAmount ?? "-"}</p>
				</>
			),
		},
		{
			title: "Paid",
			render: (record: any) => (
				<>
					<p>{record?.amount ?? "-"}</p>
				</>
			),
		},
		{
			title: "Refund",
			render: (record: any) => (
				<>
					<p>{record?.appointment?.paymentSummary?.refundAmount ?? "-"}</p>
				</>
			),
		},
		// Hidden on the client's request, not dropped: they may well want the
		// Balance column back, and the API still sends paymentSummary.balance.
		// {
		// 	title: "Balance",
		// 	render: (record: any) => (
		// 		<>
		// 			<p>{record?.appointment?.paymentSummary?.balance ?? "-"}</p>
		// 		</>
		// 	),
		// },
		{
			title: "Appointment Status",
			render: (record: any) => (
				<>
					<p>
						<p>{record?.appointment?.status || "-"}</p>
					</p>
				</>
			),
		},
		{
			title: "Payment Status",
			render: (record: any) => (
				<>
					<p>{record?.appointment?.paymentSummary?.paymentStatus || "-"}</p>
				</>
			),
		},
		{
			title: "Action",
			render: (record: any) => (
				<>
					<UpdatePaymentActionButton paymentId={record.id} fetchData={fetchData} options={options} />
				</>
			),
		},
	];
	console.log("PaymentReportTable data:", data);
	// console.log(data);
	return (
		<DataTable
			rolePermissionTag="payment-report"
			tableColumns={columns}
			tableData={data}
			paginationUrl={url}
			paginationData={pagination}
			loading={loading}
			expandable={{
				expandedRowRender: (record: any) => (
					<div className="text-sm px-4 py-2">
						<p>
							<strong>Note:</strong> {record?.note || "No note available."}
						</p>
					</div>
				),
				rowExpandable: (record: any) => !!record.note, // Only expandable if notes exist
			}}
		/>
	);
};

export default PaymentReportTable;
