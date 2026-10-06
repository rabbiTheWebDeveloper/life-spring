"use client";

import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { Switch, Table, Tooltip } from "antd";
import { CiEdit } from "react-icons/ci";

function PaymentMethodTable({ tableData, loading, onEdit, onToggleActive }: any) {
	// A method is switched off, never removed, so the list is always sorted the
	// same way the checkout renders it: sortOrder first, then name.
	const sortedData = [...(tableData ?? [])].sort(
		(a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || String(a.name).localeCompare(String(b.name))
	);

	const columns = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Status",
			dataIndex: "isActive",
			key: "isActive",
			render: (isActive: boolean, record: any) => (
				<div className="flex items-center gap-x-2">
					<h2
						className={`min-w-fit w-fit px-3 py-0.5 text-white text-sm rounded-md text-center ${
							isActive ? "bg-primary-400" : "bg-red-400"
						}`}
					>
						{isActive ? "Active" : "Inactive"}
					</h2>
					<RolePermissionChecker tag="administration-payment-gateway" name="update">
						<Switch checked={isActive} onChange={(checked) => onToggleActive(record, checked)} />
					</RolePermissionChecker>
				</div>
			),
		},
		{
			title: "Order",
			dataIndex: "sortOrder",
			key: "sortOrder",
		},
		{
			title: "Action",
			key: "action",
			render: (text: any, record: any) => (
				<div className="flex justify-start items-center gap-x-2">
					<RolePermissionChecker tag="administration-payment-gateway" name="update">
						<Tooltip placement="top" title={"Update Payment Method"} color={"#2db7f5"}>
							<div
								className="bg-primary-400 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
								onClick={() => onEdit(record)}
							>
								<CiEdit size={18} />
							</div>
						</Tooltip>
					</RolePermissionChecker>
				</div>
			),
		},
	];

	return (
		<div className="border rounded-md">
			<Table columns={columns} dataSource={sortedData} rowKey="id" loading={loading} pagination={false} />
		</div>
	);
}

export default PaymentMethodTable;
