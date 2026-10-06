"use client";
import UpdateActionButton from "@/app/components/buttons/actionButtons/UpdateActionButton";
import ViewActionButton from "@/app/components/buttons/actionButtons/ViewActionButton";
import DataTable from "@/app/components/tables/DataTable";
import { indexCount } from "@/helper/IndexCount";
import clsx from "clsx";

const UsersTable = ({ users, onEdit, onView, loading }: any) => {
	const pagination = {
		totalItems: users?.pagination.totalItems,
		size: users?.pagination.size,
		page: users?.pagination.page,
	};
	const columns = [
		{
			title: "No",
			dataIndex: "index",
			key: "index",
			render: (text: any, record: any, index: number) => (
				<span>{indexCount(index, pagination?.page, pagination?.size)}</span>
			),
		},
		{
			title: "User Name",
			key: "firstName",
			render: (record: any) => (
				<p>
					{record.firstName} {record.lastName}
				</p>
			),
		},
		{
			title: "Nick Name",
			key: "nickName",
			render: (record: any) => <p>{record.nickName}</p>,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Role",
			dataIndex: "role",
			key: "role",
			render: (_: any, record: any) => <p>{record?.userRole?.name ? record?.userRole?.name : "-"}</p>,
		},
		{
			title: "Status",
			dataIndex: "isActive",
			key: "isActive",
			render: (isActive: boolean) => (
				<h2
					className={clsx("min-w-fit w-fit px-3 py-0.5 text-white text-sm rounded-md text-center", {
						"bg-green-500 text-black": isActive,
						"bg-red-500 text-black": !isActive,
					})}
				>
					{isActive ? "Active" : "Inactive"}
				</h2>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (record: any) => (
				<div className="flex justify-start items-center gap-x-2 ">
					<UpdateActionButton rolePermissionTag="user-role-permission-user" onButtonClick={() => onEdit(record.id)} />
					<ViewActionButton rolePermissionTag="user-role-permission-user" onButtonClick={() => onView(record.id)} />
				</div>
			),
		},
	];
	return (
		<>
			<DataTable
				tableColumns={columns}
				tableData={users?.data}
				paginationUrl={`/user?size=10`}
				paginationData={pagination}
				rolePermissionTag="user-role-permission-user"
				loading={loading}
			/>
		</>
	);
};

export default UsersTable;
