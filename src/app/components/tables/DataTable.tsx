"use client";
import { Table } from "antd";
import RolePermissionChecker from "../rolepermission/HandleRolePermission";
import { DataPagination } from "./pagination/DataPagination";

export default function DataTable({
	rolePermissionTag,
	tableColumns,
	tableData,
	paginationUrl,
	paginationData,
	expandable = false,
	loading = false,
}: any) {
	return (
		<RolePermissionChecker tag={rolePermissionTag} name="list">
			<div className="border border-b-0 rounded-md w-full">
				<Table
					className="text-xs [&_.ant-table-tbody>tr>td]:text-gray-800 [&_.ant-table-tbody>tr>td]:font-medium"
					columns={tableColumns}
					dataSource={tableData}
					rowKey={(record: any) => record.id}
					pagination={false}
					expandable={expandable}
					loading={loading}
				/>
			</div>
			{paginationData && !loading && (
				<div className="flex justify-end mt-4">
					<DataPagination url={paginationUrl} pagination={paginationData} />
				</div>
			)}
		</RolePermissionChecker>
	);
}
