"use client";
import { Paginator } from "@/app/components/layout/Paginator";
import { Table, Tooltip } from "antd";
import Link from "next/link";
import { MdSwapCalls } from "react-icons/md";

export default function RoleTable({ roleList, pagination, url, loading }: any) {
	const columns: any = [
		{
			title: "Sl No.",
			render: (_: any, __: any, index: number) => index + 1,
			key: "serial",
		},
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_: any, record: any) => (
				<div className="flex gap-2">
					{/* <RolePermissionChecker tag="user-role-permission-role" name="update"> */}
					<Tooltip placement="top" title={"Assign Permission"} color={"#2db7f5"}>
						<Link href={`role/${record.id}?type=${record.type}`} className="bg-green-500 p-2 rounded-md">
							<MdSwapCalls size="15px" color="#fff" />
							{/* <CiEdit size="15px" color="#fff" /> */}
						</Link>
					</Tooltip>
					{/* </RolePermissionChecker> */}
				</div>
			),
		},
	];

	return (
		<div>
			<div className="border border-b-0 rounded-md w-full">
				<Table columns={columns} dataSource={roleList} rowKey="uuid" pagination={false} loading={loading} />
			</div>
			{!loading && (
				<div className="flex justify-end">
					<Paginator url={url} pagination={pagination} />
				</div>
			)}
		</div>
	);
}
