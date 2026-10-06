"use client";
import UpdateActionButton from "@/app/components/buttons/actionButtons/UpdateActionButton";
import DataTable from "@/app/components/tables/DataTable";

export default function BranchTable({ branchList, pagination, onUpdate, loading = false }: any) {
	const columns: any = [
		{
			title: "Sl No.",
			render: (_: any, __: any, index: number) => index + 1,
			key: "serial",
		},
		{
			title: "Branch name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Branch Location",
			dataIndex: "location",
			key: "location",
			className: "text-wrap",
		},
		{
			title: "Oranization Details",
			dataIndex: "id",
			key: "id",
			render: (_: any, record: any) => (
				<div>
					<p className="font-bold">{record?.organization?.name}</p>
					<p>{record?.organization?.address}</p>
					<p>{record?.organization?.phone}</p>
					<p>{record?.organization?.email}</p>
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
				tableData={branchList}
				paginationUrl={"/branch"}
				paginationData={pagination}
				loading={loading}
			/>
		</div>
	);
}
