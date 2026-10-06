import DataTable from "@/app/components/tables/DataTable";
import { formatDhaka } from "@/helper/DhakaTime";
import { Tag } from "antd";

const columns = [
	{
		title: "Appointment ID",
		dataIndex: "id",
		key: "id",
	},
	{
		title: "Doctor",
		dataIndex: "doctor",
		key: "doctor",
		render: (doctor: any) => doctor?.name || "-",
	},
	{
		title: "Patient",
		dataIndex: "patientDetails",
		key: "patientDetails",
		render: (patient: any) => patient?.fullName || "-",
	},
	{
		title: "Mobile",
		dataIndex: "patientDetails",
		key: "mobile",
		render: (patient: any) => patient?.mobile || "-",
	},
	{
		title: "Date & Time",
		dataIndex: "scheduleStart",
		key: "scheduleStart",
		render: (_: any, record: any) => {
			const start = formatDhaka(record.scheduleStart, "MMM D, YYYY h:mm A");
			const end = formatDhaka(record.scheduleEnd, "h:mm A");
			return `${start} - ${end}`;
		},
	},
	{
		title: "Appointment Type",
		dataIndex: "appointmentType",
		key: "appointmentType",
		render: (type: string) => <Tag color="blue">{type}</Tag>,
	},
	{
		title: "Status",
		dataIndex: "status",
		key: "status",
		render: (status: string) => {
			const color = status === "Cancelled" ? "red" : "green";
			return <Tag color={color}>{status}</Tag>;
		},
	},
	{
		title: "Payment Status",
		dataIndex: "paymentStatus",
		key: "paymentStatus",
		render: (status: string) => {
			let color = "default";
			if (status === "Refunded") color = "orange";
			else if (status === "Paid") color = "green";
			else if (status === "Unpaid") color = "red";
			return <Tag color={color}>{status}</Tag>;
		},
	},
	{
		title: "Fee (৳)",
		dataIndex: ["paymentDetails", "fee"],
		key: "fee",
	},
	{
		title: "VAT (৳)",
		dataIndex: ["paymentDetails", "vatOnAcutalReceive"],
		key: "vat",
	},
	{
		title: "Paid (৳)",
		dataIndex: ["paymentDetails", "amount"],
		key: "paid",
	},
	{
		title: "Refund (৳)",
		dataIndex: ["paymentDetails", "refundAmount"],
		key: "refund",
		render: (val: any) => (parseFloat(val) > 0 ? <Tag color="volcano">৳ {val}</Tag> : "৳ 0"),
	},
	{
		title: "Created By",
		dataIndex: "createdBy",
		key: "createdBy",
		render: (creator: any) => creator?.fullName || "-",
	},
	{
		title: "Channel",
		dataIndex: "channel",
		key: "channel",
	},
];

const RefundReportTable = ({ data, pagination, url, loading }: any) => {
	console.log(data);
	return (
		<DataTable
			rolePermissionTag="refund-report"
			tableColumns={columns}
			tableData={data}
			paginationUrl={url}
			paginationData={pagination}
			loading={loading}
			expandable={{
				expandedRowRender: (record: any) => (
					<div className="text-sm px-4 py-2">
						<p>
							<strong>Note:</strong> {record?.notes || "No notes available."}
						</p>
					</div>
				),
				rowExpandable: (record: any) => !!record.notes, // Only expandable if notes exist
			}}
		/>
	);
};

export default RefundReportTable;
