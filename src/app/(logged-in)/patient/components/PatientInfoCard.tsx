import Link from "next/link";
import React from "react";
import { Patient, buildPatientId } from "../types/Types";
import { formateDate, patientAge } from "@/helper/DateHelper";
import { cmToFeetInch } from "@/helper/StringHelper";
import ImageWithLoader from "@/app/components/image/ImageWithLoader";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";

const PatientInfoCard = ({ patient }: { patient: Patient }) => {
	return (
		<div className="h-[370px]    w-[320px] md:w-[274px] py-4 px-5 border shadow rounded-xl flex flex-col gap-6">
			<div className="flex flex-col gap-4">
				<ImageWithLoader
					src={patient.profilePic}
					width={51}
					height={51}
					alt={"patient"}
					altImage={"/user.png"}
					cls="rounded-full object-cover h-[63px] w-[63px]"
				/>
				<div className="flex flex-col gap-1">
					<h2 className="font-bold leading-5 text-primary-500">{patient.name}</h2>
					<div className="text-[#343434] text-sm flex flex-col">
						<h2>ID: {buildPatientId(patient)}</h2>
						<h2>DOB: {formateDate(patient.dob)}</h2>
						<h2>{patient.mobile}</h2>
					</div>
				</div>
			</div>
			<hr />

			<div className="flex gap-2.5 text-sm font-medium leading-4">
				<div className="flex flex-col gap-1 min-w-fit">
					<h2>Height</h2>
					<h2>Weight</h2>
					<h2>Age</h2>
				</div>
				<div className="flex flex-col gap-1">
					<h2>:</h2>
					<h2>:</h2>
					<h2>:</h2>
				</div>
				<div className="flex flex-col gap-1 min-w-fit">
					<h2>{cmToFeetInch(patient.height) ?? "-"} </h2>
					<h2>{patient.weight ?? "-"} kg </h2>
					<h2>{patientAge(patient)}</h2>
				</div>
			</div>

			<RolePermissionChecker tag="patient" name="view">
				<div
					className="md:w-[234px] py-1.5 px-4 bg-primary-400 flex justify-center items-center text-center cursor-pointer rounded-md">
					<Link href={`patient/${patient.id}`} className="text-white">
						Details
					</Link>
				</div>
			</RolePermissionChecker>


		</div>
	);
};

export default PatientInfoCard;
