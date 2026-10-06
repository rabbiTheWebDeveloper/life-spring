
'use client'
import React from "react";
import {Table, Image, Tooltip} from "antd";
import FormattedDate from "@/app/components/layout/FormattedDate";
import { Doctors, buildDoctorId } from "../../doctor/types/Type";
import {Paginator} from "@/app/components/layout/Paginator";
import {SlEye} from "react-icons/sl";
import {useRouter} from "next/navigation";
import {CiEdit} from "react-icons/ci";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

interface Props {
	doctors: Doctors;
	url: string;
}

const DoctorTable = ({ doctors,url }: Props) => {
	const router=useRouter();
	const columns = [
		{
			title: "No",
			dataIndex: "no",
			key: "no",
			render: (_: any, __: any, index: number) =>
				index + 1,
		},
		{
			title: "Doctor Name",
			dataIndex: "name",
			key: "name",
			render: (name: string, doctor: any) => (
				<div className="flex gap-2 items-center">
					<Image
						src={doctor?.profilePic || "/blank-avatar.jpg"}
						width={40}
						height={40}
						alt="doctor"
						className="rounded-md object-cover"
						preview={true}
					/>
					<h2 className="text-sm">{name ?? "-"}</h2>
				</div>
			),
		},
		{
			title: "Phone",
			dataIndex: "mobile",
			key: "mobile",
			render: (mobile: string) => mobile ?? "-",
		},
		{
			title: "Doctor ID",
			dataIndex: "id",
			key: "id",
			render: (id: any) => buildDoctorId(id) ?? "-",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (email: string) => email ?? "-",
		},
		{
			title: "Speciality",
			dataIndex: ["specialty", "name", "en"],
			key: "specialty",
			render: (specialty: string) => specialty ?? "-",
		},
		{
			title: "BMDC No",
			dataIndex: "bmdcCode",
			key: "bmdcCode",
			render: (bmdcCode: string) => bmdcCode ?? "-",
		},
		{
			title: "BMDC Expiry Date",
			dataIndex: "bmdcExpiryDate",
			key: "bmdcExpiryDate",
			render: (bmdcExpiryDate: string) => (
				<FormattedDate isoString={bmdcExpiryDate} />
			),
		},
		{
			title: "Status",
			dataIndex: "isActive",
			key: "isActive",
			render: (isActive: boolean) => (
				<h2
					className={`min-w-fit w-fit px-3 py-0.5 text-white text-sm rounded-md text-center ${
						isActive ? "bg-primary-400" : "bg-red-400"
					}`}
				>
					{isActive ? "Active" : "Inactive"}
				</h2>
			),
		},
		{
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id: string) => (
				// href={`${doctor.id}/update`}
				<div className="flex justify-start items-center gap-x-2 ">
					<RolePermissionChecker tag="doctor" name="view">
						<Tooltip placement="top" title={"View details"} color={"#2db7f5"}>
							<div
								className="bg-blue-500 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
								onClick={() => router.push(`/doctor/${id}`)}
							>
								<SlEye size={18}/>
							</div>
						</Tooltip>
					</RolePermissionChecker>
					<RolePermissionChecker tag="doctor" name="update">
						<Tooltip placement="top" title={"Edit details"} color={"#2db7f5"}>
							<div
								className="bg-teal-500 flex items-center justify-center rounded-md px-1 py-1 cursor-pointer text-white"
								onClick={() => router.push(`/doctor/${id}/update`)}
							>
								<CiEdit size={18} />
							</div>
						</Tooltip>
					</RolePermissionChecker>

				</div>
			),
		},
	];

	const dataSource = doctors?.doctors?.map((doctor: any, index: number) => ({
		key: doctor.id,
		no: index + 1,
		name: doctor.name,
		mobile: doctor.mobile,
		id: doctor.id,
		email: doctor.email,
		specialty: doctor.specialty,
		bmdcCode: doctor.bmdcCode,
		bmdcExpiryDate: doctor.bmdcExpiryDate,
		isActive: doctor.isActive,
		profilePic: doctor?.profilePic
	}));

	return <div>
		<Table columns={columns} dataSource={dataSource} pagination={false}/>
		<div className="flex justify-end bottom-5  text-right">
						<Paginator url={url} pagination={doctors?.pagination} />
		 			</div>
	</div>;
};

export default DoctorTable;

