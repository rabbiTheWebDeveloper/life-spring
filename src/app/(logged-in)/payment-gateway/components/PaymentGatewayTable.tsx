"use client";

import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { Image, Table, Tooltip } from "antd";
import { CiEdit } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";
import React from "react";

function PaymentGatewayTable({ tableData, onDelete, onEdit }: any) {
	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			key: "id",
		},
		{
			title: "Gateway Name",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Icon",
			dataIndex: "icon",
			key: "icon",
			// A gateway without an uploaded logo is a valid state, so show a
			// placeholder instead of a broken image.
			render: (icon: string, record: any) =>
				icon ? (
					<Image src={icon} alt={`Image of ${record.title}`} height={40} />
				) : (
					<span className="text-gray-400 italic">No icon</span>
				),
		},
		{
			title: "Slug",
			dataIndex: "slug",
			key: "slug",
		},
		{
			title: "Commission",
			dataIndex: "gatewayCommission",
			key: "gatewayCommission",
		},
		{
			title: "Order",
			dataIndex: "order",
			key: "order",
		},
		{
			title: "Easy Checkout",
			dataIndex: "enableEasyCheckout",
			key: "enableEasyCheckout",
			render: (enableEasyCheckout: boolean) => (enableEasyCheckout ? "True" : "False"),
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			// render: (status: boolean) => (status ? "Active" : "Inactive"),
			render: (status: boolean) => (
				<h2
					className={`min-w-fit w-fit px-3 py-0.5 text-white text-sm rounded-md text-center ${
						status ? "bg-primary-400" : "bg-red-400"
					}`}
				>
					{status ? "Active" : "Inactive"}
				</h2>
			),
		},
		{
			title: "Action",
			key: "action",
			render: (text: any, record: any) => (
				<div>
					<div className="flex justify-start items-center gap-x-2 ">
						<RolePermissionChecker tag="administration-payment-gateway" name="update">
							<Tooltip placement="top" title={"Update Payment Gateway"} color={"#2db7f5"}>
								<div
									className="bg-primary-400 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
									onClick={() => onEdit(record.id, record)}
								>
									<CiEdit size={18} />
								</div>
							</Tooltip>
						</RolePermissionChecker>
						<RolePermissionChecker tag="administration-payment-gateway" name="delete">
							<Tooltip placement="top" title={"Delete Payment Gateway"} color={"#2db7f5"}>
								<div
									className="bg-red-500 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
									onClick={() => onDelete(record)}
								>
									<FaRegTrashAlt size={18} />
								</div>
							</Tooltip>
						</RolePermissionChecker>
					</div>


				</div>
			),
		},
	];

	return (
		<div className="border rounded-md">
			<Table columns={columns} dataSource={tableData} pagination={false}/>
		</div>
	);
}

export default PaymentGatewayTable;
