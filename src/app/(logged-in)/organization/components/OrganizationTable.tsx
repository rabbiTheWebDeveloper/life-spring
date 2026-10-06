"use client";
import UpdateActionButton from "@/app/components/buttons/actionButtons/UpdateActionButton";
import DataTable from "@/app/components/tables/DataTable";
import { Tag } from "antd";

export default function OrganizationTable({ organizationList, pagination, onUpdate, loading = false }: any) {
	const columns: any = [
		{
			title: "Sl No.",
			render: (_: any, __: any, index: number) => index + 1,
			key: "serial",
		},
		{
			title: "Organization Details",
			dataIndex: "id",
			key: "id",
			render: (_: any, record: any) => (
				<>
					<p className="font-bold">{record.name}</p>
					<p>{record.address}</p>
				</>
			),
		},
		{
			title: "Contact Details",
			dataIndex: "id",
			key: "id",
			render: (_: any, record: any) => (
				<>
					<p>{record.email}</p>
					<p>{record.phone}</p>
				</>
			),
		},
		{
			title: "Description",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Description",
			dataIndex: "id",
			key: "id",
			render: (_: any, record: any) => (
				<div className="flex justify-center">
					<Tag color={record.status ? "green" : "red"}>{record.status ? "Active" : "Inactive"}</Tag>
				</div>
			),
		},

		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_: any, record: any) => (
				<div className="flex gap-2">
					<UpdateActionButton rolePermissionTag="organization" onButtonClick={() => onUpdate(record)} />
				</div>
			),
		},
	];

	return (
		<div>
			<DataTable
				rolePermissionTag="organization"
				tableColumns={columns}
				tableData={organizationList}
				paginationUrl={"/organization"}
				paginationData={pagination}
				loading={loading}
			/>
		</div>
	);
}
