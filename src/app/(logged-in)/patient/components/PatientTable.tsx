"use client";

import CreateActionButton from "@/app/components/buttons/actionButtons/CreateActionButton";
import ViewActionButton from "@/app/components/buttons/actionButtons/ViewActionButton";
import DataTable from "@/app/components/tables/DataTable";
import { patientAge } from "@/helper/DateHelper";
import { useRouter } from "next/navigation";

interface Props {
	patients: any;
	url: string;
	loading?: boolean;
}

const PatientTable = ({ patients, url, loading = false }: Props) => {
	const router: any = useRouter();

	const columns = [
		{
			title: "Patient Details",
			render: (text: any, patient: any) => (
				<div className="">
					<h2 className="text-sm">ID: {patient.id ?? "-"}</h2>
					<h2 className="text-sm">{patient.name ?? "-"}</h2>
					<h2 className="text-sm">{patient.mobile ?? "-"}</h2>
					<h2 className="text-sm">{patient.email ?? "-"}</h2>
					<h2 className="text-sm">{patient.address ?? "-"}</h2>
				</div>
			),
		},
		{
			title: "Note",
			dataIndex: "note",
			render: (text: any) => text ?? "-",
		},
		{
			title: "Unique ID",
			render: (text: any, patient: any) => patient?.patientUniqueId ?? "-",
		},
		{
			title: "Age",
			render: (text: any, patient: any) => patientAge(patient),
		},
		{
			title: "Weight",
			render: (text: any, patient: any) => `${patient.weight ?? "-"} ${patient.weight ? "Kg" : ""}`,
		},
		{
			title: "Gender",
			dataIndex: "gender",
			render: (text: any) => text ?? "-",
		},
		{
			title: "Created By",
			dataIndex: "createdByType",
			render: (text: any) => text ?? "-",
		},
		{
			title: "Status",
			render: (text: any, patient: any) => (
				<h2
					className={`min-w-fit w-fit px-3 py-0.5 text-white text-sm rounded-md text-center ${
						patient?.isActive ? "bg-green-400" : "bg-red-400"
					}`}
				>
					{patient?.isActive ? "Active" : "Inactive"}
				</h2>
			),
		},
		{
			title: "Action",
			render: (text: any, patient: any) => (
				<div className="flex justify-start items-center gap-x-2 ">
					<ViewActionButton rolePermissionTag="patient" onButtonClick={() => router.push(`/patient/${patient.id}`)} />

					<CreateActionButton
						rolePermissionTag="appointment"
						onButtonClick={() => router.push(`/appointment-booking?type=patient&id=${patient.id}`)}
						toolTipTitle={"Book Appointment"}
					/>
				</div>
			),
		},
	];

	return (
		<DataTable
			rolePermissionTag="patient"
			tableColumns={columns}
			tableData={patients?.data}
			paginationUrl={url}
			paginationData={patients?.pagination}
			loading={loading}
		/>
	);
};

export default PatientTable;
