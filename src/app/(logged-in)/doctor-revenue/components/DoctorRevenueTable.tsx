import DataTable from "@/app/components/tables/DataTable";
import { Tag } from "antd";

// Column definitions
const columns = [
	{
		title: "Doctor ID",
		dataIndex: "doctorId",
		key: "doctorId",
	},
	{
		title: "Doctor Name",
		dataIndex: "doctorName",
		key: "doctorName",
	},
	{
		title: "Total Appointments",
		dataIndex: "totalAppointments",
		key: "totalAppointments",
		render: (text: any) => <span>{parseInt(text) === 0 ? <Tag color="red">0</Tag> : text}</span>,
	},
	{
		title: "Total Fees (৳)",
		dataIndex: "totalFees",
		key: "totalFees",
		render: (fee: any) => <span>{parseInt(fee) === 0 ? <Tag color="red">৳ 0</Tag> : `৳ ${fee}`}</span>,
	},
];

const DoctorRevenueTable = ({ data, pagination, url }: any) => {
	return (
		<DataTable
			tableColumns={columns}
			tableData={data}
			paginationUrl={url}
			paginationData={pagination}
			rolePermissionTag="doctor-revenue-report"
		/>
	);
};

export default DoctorRevenueTable;
