"use client";
import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { formatDhaka } from "@/helper/DhakaTime";
import dayjs from "dayjs";
import ContentWrapper from "../../../../../components/layout/wrappers/ContentWrapper";

interface LogItem {
	id: number;
	referenceId: number;
	servicetype: string;
	oldStatus: string;
	newStatus: string;
	changeReason: string;
	changeDate: string;
	changerName: string;
	changerType: string;
}

interface Props {
	logs: LogItem[];
}

export default function AppointmentLogTable({ logs }: Props) {
	const columns: ColumnsType<LogItem> = [
		{
			title: "Date & Time",
			dataIndex: "changeDate",
			key: "changeDate",
			render: (value) => formatDhaka(value, "DD MMM YYYY, hh:mm A"),
			sorter: (a, b) => dayjs(a.changeDate).unix() - dayjs(b.changeDate).unix(),
		},
		{
			title: "Service",
			dataIndex: "servicetype",
			key: "servicetype",
			render: (value) => <Tag color="blue">{value}</Tag>,
		},
		{
			title: "Status Change",
			key: "status",
			render: (_, record) => (
				<>
					<Tag color="default">{record.oldStatus}</Tag>
					<span style={{ margin: "0 6px" }}>→</span>
					<Tag color="green">{record.newStatus}</Tag>
				</>
			),
		},
		{
			title: "Reason",
			dataIndex: "changeReason",
			key: "changeReason",
		},
		{
			title: "Changed By",
			key: "changer",
			render: (_, record) => (
				<>
					<strong>{record.changerName}</strong>
					<div style={{ fontSize: 12, color: "#888" }}>{record.changerType}</div>
				</>
			),
		},
	];

	return (
		<div className="bg-white mt-10 ">
			<div className="">
				<Table rowKey="id" columns={columns} dataSource={logs} pagination={false} bordered size="middle" />
			</div>
		</div>
	);
}
