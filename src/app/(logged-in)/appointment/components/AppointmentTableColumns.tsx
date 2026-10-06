import ViewActionButton from "@/app/components/buttons/actionButtons/ViewActionButton";
import FormattedTime from "@/app/components/layout/FormattedTime";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import { patientAge } from "@/helper/DateHelper";
import { formatDateOnly } from "@/helper/DateTimeHelper";
import clsx from "clsx";
import { Appts, Payments } from "../types/Models";


export const getAppointmentTableColumns = (router: any) => [
	{
		title: "ID",
		dataIndex: "id",
		key: "id",
	},
	{
		title: "Schedule Date",
		dataIndex: "scheduleDate",
		key: "scheduleDate",
		render: (_: any, record: any) => formatDateOnly(record.scheduleStart),
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
		title: "Channel",
		key: "channel",
		render: (text: string, record: any) => record?.channel || "-",
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
					appointment.appointmentType === "online" ? "bg-[#6A0DAD] border-[#6A0DAD]" : "bg-[#008080] border-[#008080]"
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
				<ViewActionButton
					rolePermissionTag="appointment"
					onButtonClick={() => router.push(`/appointment/${record.id}`)}
				/>

			</div>
		),
	},
];
