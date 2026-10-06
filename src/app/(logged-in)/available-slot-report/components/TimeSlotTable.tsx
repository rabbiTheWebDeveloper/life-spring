import ActionButton from "@/app/components/buttons/actionButtons/ActionButton";
import DataTable from "@/app/components/tables/DataTable";
import { Tag } from "antd";
import moment from "moment";

// Current Bangladesh time (Asia/Dhaka) as a moment, regardless of the server/browser's own timezone.
function getDhakaNow() {
	const parts = new Intl.DateTimeFormat("en-GB", {
		timeZone: "Asia/Dhaka",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	}).formatToParts(new Date());
	const get = (type: string) => parts.find((p) => p.type === type)?.value;
	return moment(
		`${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`,
		"YYYY-MM-DD HH:mm:ss"
	);
}

const TimeSlotTable = ({ data, date, handleAppointment, handleUpdateSlot, loading }: any) => {
	console.log(data);
	const dhakaNow = getDhakaNow();
	const columns = [
		{
			title: "Slot Time",
			key: "slotTime",
			render: (_: any, record: any) => {
				const start = moment(record.slotStart, "HH:mm:ss");
				const end = moment(record.slotEnd, "HH:mm:ss");

				const diffMin = end.diff(start, "minute");

				const durationText = `${start.format("hh:mm A")} - ${end.format("hh:mm A")} (${diffMin} min)`;

				return (
					<div>
						{record?.appointment?.createdBy?.nickName && <p>{record.appointment.createdBy.nickName}</p>}
						<p>{durationText}</p>
					</div>
				);
			},
		},
		{
			title: `Slot Type`,
			render: (_: any, record: any) => {
				return <p>{record?.slotInfo?.slotType}</p>;
			},
		},
		{
			title: "Patient Info",
			key: "PatientInfo",
			render: (_: any, record: any) => {
				return (
					<div className="flex flex-wrap gap-2 justify-start items-center gap-x-2">
						{!record?.appointment ? (
							"--"
						) : (
							<div>
								<p>{record.appointment.patientDetails?.fullName || "-"}</p>
								<p>{record.appointment.patientDetails?.mobile || "-"}</p>
							</div>
						)}
					</div>
				);
			},
		},
		{
			title: `Appointment Info`,
			render: (_: any, record: any) => {
				return (
					<div className="flex flex-wrap gap-2 justify-start items-center gap-x-2">
						{!record?.appointment ? (
							"--"
						) : (
							<div className="text-xs">
								<p className={"mx-2"}>
									<span>Fee: {record?.appointment?.paymentSummary?.fee || "0"}</span>
									<span className={"mx-2"}>VAT: {record?.appointment?.paymentSummary?.vatPercentage || "0"}</span>
								</p>
								<p className={"mx-2"}>
									<span>Due: {record?.appointment?.paymentSummary?.dueAmount || "0"}</span>{" "}
									<span className={"mx-2"}>Paid: {record?.appointment?.paymentSummary?.paidAmount || "0"}</span>
								</p>
								<p className={"mx-2"}>Refund Amount: {record?.appointment?.paymentSummary?.refundAmount || "0"}</p>
							</div>
						)}
					</div>
				);
			},
		},

		{
			title: "Appointment status",
			key: "isBooked",
			render: (_: any, record: any) => (
				<div>
					<div className={"mb-1"}>
						{record?.appointment?.type && <Tag color={"green"}>{record?.appointment?.type}</Tag>}
					</div>
					<div className={""}>
						{record?.appointment?.status && <Tag color={"blue"}>{record?.appointment?.status}</Tag>}
					</div>
					<p className={"mt-1"}>Total Amount: {record?.appointment?.paymentSummary?.payable || "0"}</p>
				</div>
			),
		},
		{
			title: "Blocked",
			dataIndex: "isActive",
			key: "isActive",
			render: (_: any, record: any) => (
				<div>
					<Tag color={!record?.isActive ? "red" : "green"}>{!record?.isActive ? "Blocked" : "No"}</Tag>
					{!record?.isActive && <p>{record?.slotInfo?.notes}</p>}
				</div>
			),
		},
		// {
		// 	title: "Break Time (min)",
		// 	dataIndex: ["slotInfo", "breakTime"],
		// 	key: "breakTime",
		// },
		{
			title: `Action`,
			render: (_: any, record: any) => {
				const slotStart = date ? moment(`${date} ${record.slotStart}`, "YYYY-MM-DD HH:mm:ss") : null;
				const isPast = !!slotStart && slotStart.isBefore(dhakaNow);

				// LS answered Q2: a past slot keeps its Update action, booked or not.
				// It used to render "Past slot" and nothing else, which is what was
				// reported as Update Slot being missing for admins — the tester was
				// looking at a past day. Only Book Appointment is withheld: an
				// appointment cannot be made for a time that has gone.

				return (
					<div className="flex flex-wrap gap-2 justify-start items-center gap-x-2">
						{record.appointment ? (
							<div>
								<p className={"mb-2"}>Already booked</p>
								<ActionButton
									rolePermissionTag="available-appointment-slot"
									rolePermissionName="list"
									toolTipTitle="Update Slot"
									onButtonClick={() => handleUpdateSlot(record)}
									buttonColor="bg-yellow-500"
								>
									<strong className="text-xs px-4">Update Slot</strong>
								</ActionButton>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								{isPast && <span className="text-gray-400 text-xs">Past slot</span>}
								{record?.isActive && !isPast && (
									<ActionButton
										rolePermissionTag="available-appointment-slot"
										rolePermissionName="appointment-booking"
										toolTipTitle="Book Appointment"
										onButtonClick={() => handleAppointment(record)}
										buttonColor="bg-green-500"
									>
										<strong className="text-xs">Book Appointment</strong>
									</ActionButton>
								)}

								<ActionButton
									rolePermissionTag="available-appointment-slot"
									rolePermissionName="list"
									toolTipTitle="Update Slot"
									onButtonClick={() => handleUpdateSlot(record)}
									buttonColor="bg-yellow-500"
								>
									<strong className="text-xs px-4">Update Slot</strong>
								</ActionButton>
							</div>
						)}
					</div>
				);
			},
		},
	];
	return <DataTable rolePermissionTag="doctor" tableColumns={columns} tableData={data} loading={loading} />;
};

export default TimeSlotTable;
