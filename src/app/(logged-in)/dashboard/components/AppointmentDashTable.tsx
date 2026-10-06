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
import {Table, Tooltip} from "antd";
import {SlEye} from "react-icons/sl";

interface Props {
	appointments: Appointments
	url: string;
}

const AppointmentDashTable = ({ appointments, url }: Props) => {
	const appointmentData = appointments?.appointments;
	const router=useRouter()
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
				<button
					className={`rounded-md py-.5 px-3.5 ${
						appointment.appointmentType === "online"
							? "bg-[#6A0DAD] border-[#6A0DAD]"
							: "bg-[#008080] border-[#008080]"
					}  text-white`}
				>
					{appointment.appointmentType}
				</button>
			),
		},
		{
			title: "Payment Status",
			dataIndex: "paymentStatus",
			key: "paymentStatus",
			render: (_: string, appointment: any) => (
				<button
					className={clsx("rounded-md py-0 px-2", {
						"bg-teal-500 border-[#B5FD93] text-white": Payments.isPaid(appointment),
						"bg-amber-500 border-amber-300 text-white": Payments?.isPartiallyPaid(appointment),
						"bg-cyan-500 border-[#93C5FD] text-white": Payments.isUnpaid(appointment),
					})}
				>
					{Payments.getStatusValue(appointment)}
				</button>
			),
		},
		{
			title: "Appt. Status",
			dataIndex: "apptStatus",
			key: "apptStatus",
			render: (_: string, appointment: any) => (
				<button
					className={clsx("rounded-md py-0 px-2", {
						"bg-[#DBEAFE] border-[#93C5FD] text-[#1E40AF]": Appts.isScheduled(appointment),
						"bg-[#DBFEE3] border-[#B5FD93] text-[#12B76A]": Appts.isCompleted(appointment),
						"bg-[#FEDBDB] border-[#FD9393] text-[#B71212]": Appts.isCancelled(appointment),
						"bg-[#bcb9e2] border-[#be9292] text-white": Appts.isPending(appointment),
					})}
				>
					{appointment.status}
				</button>
			),
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
			render: (_: any, record: any) => (
				<div className="flex justify-start items-center gap-x-2 ">
					<Tooltip placement="top" title={"View Details"} color={"#2db7f5"}>
						<div
							className="bg-teal-500 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
							onClick={() => router.push(`/appointment/${record.id}`)}
						>
							<SlEye size={18}/>
						</div>
					</Tooltip>
				</div>
			),
		},
	];

	return (
		<div className="">
			<Table
				columns={columns}
				dataSource={appointmentData}
				rowKey={(record: any) => record.id}
				pagination={false}
			/>
			<div className='flex justify-end bottom-5 text-right'>
				<Paginator url={url} pagination={appointments?.pagination}/>
			</div>
		</div>
	)
}

export default AppointmentDashTable
