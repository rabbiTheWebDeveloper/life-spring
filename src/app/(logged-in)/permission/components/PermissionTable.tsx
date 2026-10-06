"use client";
import CreateActionButton from "@/app/components/buttons/actionButtons/CreateActionButton";
import { Table, Tag } from "antd";

export default function PermissionTable({ permissionList, onAddSingularPermission, loading }: any) {
	// Function to transform data into table-friendly format
	const transformData = (data: any) => {
		const tableData: any[] = [];

		Object.entries(data).forEach(([type, tags]: any) => {
			Object.entries(tags).forEach(([tag, names]) => {
				// Push a new row for each tag (eye-hospital, shukhee)
				tableData.push({
					name: names, // Store array for rendering as tags
					type,
					tag, // Store tag (eye-hospital, shukhee)
				});
			});
		});

		return tableData;
	};

	const columns: any = [
		{
			title: "Sl No.",
			render: (_: any, __: any, index: number) => index + 1,
			key: "serial",
		},
		{
			title: "Module Name",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Type",
			dataIndex: "tag",
			key: "tag",
		},
		{
			title: "Permissions",
			dataIndex: "name",
			key: "name",
			render: (permissions: string[]) => (
				<>
					{permissions.map((permission) => (
						<Tag color="blue" key={permission}>
							{permission}
						</Tag>
					))}
				</>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (record: any) => (
				<div className="flex justify-start items-center gap-x-2 ">
					<CreateActionButton
						toolTipTitle="Add Single Permission"
						rolePermissionTag="user-role-permission-permission"
						onButtonClick={() => onAddSingularPermission(record)}
					/>
				</div>
			),
		},
	];

	const tableData = transformData(permissionList);

	return (
		<div>
			<div className="border border-b-0 rounded-md w-full">
				<Table
					columns={columns}
					dataSource={tableData}
					rowKey={(record) => `${record.type}-${record.tag}`}
					pagination={false}
					loading={loading}
				/>
			</div>
		</div>
	);
}
