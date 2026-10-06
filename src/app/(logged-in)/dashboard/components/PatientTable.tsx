"use client";

import ViewActionButton from "@/app/components/buttons/actionButtons/ViewActionButton";
import DataTable from "@/app/components/tables/DataTable";
import { patientAge } from "@/helper/DateHelper";
import { indexCount } from "@/helper/IndexCount";
import { Image } from "antd";
import { useRouter } from "next/navigation";

interface Props {
	patients: any;
	url: string;
}

const PatientTable = ({ patients, url }: Props) => {
	const router = useRouter();
	const pagination = {
		totalItems: patients.totalItems,
		page: patients.page,
		size: patients.size,
	};

	const columns = [
		{
			title: "ID",
			dataIndex: "id",
			render: (text: any) => text ?? "-",
		},
		{

			title: "Patient Name",
			render: (text: any, patient: any) => (
				<div className="flex gap-2 items-center">
					<Image
						src={patient?.profilePic || "/blank-avatar.jpg"}
						width={20}
						height={20}
						alt="doctor"
						className="rounded-md object-cover"
						preview={true}
					/>
					<h2 className="text-sm">{patient.name ?? "-"}</h2>
				</div>
			),
		},
		{
			title: "Phone",
			dataIndex: "mobile",
			render: (text: any) => text ?? "-",
		},
		{
			title: "Unique ID",
			render: (text: any, patient: any) => patient?.patientUniqueId ?? "-",
		},
		{
			title: "Email",
			dataIndex: "email",
			render: (text: any) => text ?? "-",
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
			paginationData={pagination}
		/>
	);
};

export default PatientTable;
