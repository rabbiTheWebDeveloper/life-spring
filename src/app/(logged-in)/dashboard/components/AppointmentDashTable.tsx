import React from 'react'
import FormattedTime from '@/app/components/layout/FormattedTime';
import Link from 'next/link';
import FormattedDate from '@/app/components/layout/FormattedDate';
import clsx from 'clsx';
import ImageWithLoader from '@/app/components/image/ImageWithLoader';
import { Appointments } from '../../appointment/types/Types';
import { Paginator } from '@/app/components/layout/Paginator';
import { Appts, Payments } from '../../appointment/types/Models';
import {useRouter} from "next/navigation";
import {indexCount} from "@/helper/IndexCount";
import {patientAge} from "@/helper/DateHelper";
import { Table, Tooltip, Pagination } from "antd";
import { SlEye } from "react-icons/sl";

interface Props {
	appointments: any;
	url?: string;
	loading?: boolean;
	onPageChange?: (page: number) => void;
}

const AppointmentDashTable = ({ appointments, url = "/dashboard", loading = false, onPageChange }: Props) => {
	const appointmentData = Array.isArray(appointments) ? appointments : appointments?.appointments;
	const paginationData = appointments?.pagination;
	const router = useRouter();
	const columns = [
		{
			title: "No",
			dataIndex: "no",
			key: "no",
			render: (_: any, __: any, index: number) =>
				indexCount(index, appointments?.pagination?.page, appointments?.pagination?.size),
		},
		{
			title: "Schedule Date",
			dataIndex: "scheduleDate",
			key: "scheduleDate",
			render: (text: string, record: any) => <FormattedDate isoString={record.scheduleStart} />,
		},
		{
			title: "Schedule Time",
			dataIndex: "scheduleTime",
			key: "scheduleTime",
			render: (_: string, record: any) => (
				<>
					<FormattedTime isoString={record.scheduleStart} /> - <FormattedTime isoString={record.scheduleEnd} />
				</>
			),
		},
		{
			title: "Created Date",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (_: string, record: any) =>
				record.createdAt ? <FormattedDate isoString={record.createdAt} /> : "-",
		},
		{
			title: "Patient Name",
			dataIndex: "patientName",
			key: "patientName",
			render: (_: string, record: any) => (
				<div className="">
					<p className="text-xs">{record.patientDetails?.fullName || record.patient?.name || "-"}</p>
					<p className="text-xs">{record.patientDetails?.mobile || record.patient?.mobile || "-"}</p>
				</div>
			),
		},
		{
			title: "Patient Age",
			dataIndex: "patientAge",
			key: "patientAge",
			render: (_: string, record: any) => patientAge(record?.patientDetails, record?.patient),
		},
		{
			title: "Created By",
			dataIndex: "createdBy",
			key: "createdBy",
			render: (text: string,record:any) => record?.createdByType || "-",
		},
		{
			title: "Doctor",
			dataIndex: "doctor",
			key: "doctor",
			render: (text: string, record: any) => record.doctor?.name || "-",
		},
		{
			title: "Appointment Type",
			dataIndex: "appointmentType",
			key: "appointmentType",
			render: (_: string, appointment: any) => (
				<span
					className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
						appointment.appointmentType === "online"
							? "bg-teal-50 text-teal-800 border border-teal-200"
							: "bg-emerald-50 text-emerald-800 border border-emerald-200"
					}`}
				>
					{appointment.appointmentType || "In-person"}
				</span>
			),
		},
		{
			title: "Payment Status",
			dataIndex: "paymentStatus",
			key: "paymentStatus",
			render: (_: string, appointment: any) => {
				const isPaid = Payments.isPaid(appointment);
				const isPartial = Payments?.isPartiallyPaid(appointment);
				return (
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
							isPaid
								? "bg-emerald-50 text-emerald-800 border border-emerald-200"
								: isPartial
								? "bg-amber-50 text-amber-800 border border-amber-200"
								: "bg-rose-50 text-rose-800 border border-rose-200"
						}`}
					>
						{Payments.getStatusValue(appointment)}
					</span>
				);
			},
		},
		{
			title: "Appt. Status",
			dataIndex: "apptStatus",
			key: "apptStatus",
			render: (_: string, appointment: any) => {
				const isSched = Appts.isScheduled(appointment);
				const isComp = Appts.isCompleted(appointment);
				const isCanc = Appts.isCancelled(appointment);
				return (
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
							isComp
								? "bg-emerald-50 text-emerald-800 border border-emerald-200"
								: isSched
								? "bg-teal-50 text-teal-800 border border-teal-200"
								: isCanc
								? "bg-rose-50 text-rose-800 border border-rose-200"
								: "bg-amber-50 text-amber-800 border border-amber-200"
						}`}
					>
						{appointment.status || "Pending"}
					</span>
				);
			},
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_: any, record: any) => (
				<div className="flex justify-start items-center">
					<Tooltip placement="top" title="View Appointment Details">
						<button
							type="button"
							className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-[#134014] text-[#134014] hover:text-white flex items-center justify-center transition-all shadow-xs cursor-pointer border border-emerald-200 hover:border-[#134014]"
							onClick={() => router.push(`/appointment/${record.id}`)}
						>
							<SlEye size={14} />
						</button>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<div className="w-full">
			<Table
				columns={columns}
				dataSource={appointmentData}
				rowKey={(record: any) => record.id}
				pagination={false}
				loading={loading}
				scroll={{ x: 850 }}
			/>
			{onPageChange && paginationData ? (
				<div className="flex flex-col sm:flex-row justify-between items-center py-4 px-2 gap-3 border-t border-slate-100 mt-2">
					<span className="text-xs text-slate-500 font-medium">
						Showing {appointmentData?.length || 0} of {paginationData?.totalElements || 0} appointments
					</span>
					<Pagination
						current={(paginationData?.page || 0) + 1}
						pageSize={paginationData?.size || 10}
						total={paginationData?.totalElements || 0}
						onChange={(p) => onPageChange(p - 1)}
						size="small"
						showSizeChanger={false}
					/>
				</div>
			) : (
				url && paginationData && (
					<div className="flex justify-end bottom-5 text-right mt-3">
						<Paginator url={url} pagination={paginationData} />
					</div>
				)
			)}
		</div>
	);
}

export default AppointmentDashTable
