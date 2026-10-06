"use client";
import AddButton from "@/app/components/buttons/AddButton";
import Searcher from "@/app/components/layout/Searcher";
import TitleBar from "@/app/components/text/TitleBar";
import React, { useState } from "react";
import DoctorsList from "./DoctorsList";
import { Doctors, Paginator as Pagination } from "../types/Type";
import { useRouter, useSearchParams } from "next/navigation";
import DoctorTable from "../../dashboard/components/DoctorTable";
import Image from "next/image";
import NoDataFound from "@/app/components/layout/NoDataFound";
import {CiCircleList, CiGrid41} from "react-icons/ci";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";

interface Props {
	doctors: any;
	specialties: any;
}

const DoctorsSection = ({ doctors, specialties }: Props) => {

	const [grid, setGrid] = useState<boolean>(false);
	const searchParams = useSearchParams();
	const urlParams = Object.fromEntries(searchParams);
	const name = urlParams.name || "";
	const router = useRouter();
	const [selectedStatus, setSelectedStatus] = useState<string>("");
	const [inHouse, setInHouse] = useState<string>("");

	const [selectedSpeciality, setSelectedSpeciality] = useState<any>(null);

	const handleSpecialityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedSpeciality(event.target.value);
		router.push(
			`/doctor?size=10&page=0${event.target.value ? `&specialty=${event.target.value}` : ""}${
				selectedStatus ? `&isActive=${selectedStatus}` : ""
			}`
		);
	};

	// Handle status filter change
	const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const statusValue = event.target.value;
		setSelectedStatus(statusValue);
		router.push(
			`/doctor?size=10&page=0${selectedSpeciality ? `&specialty=${selectedSpeciality}` : ""}${
				statusValue ? `&isActive=${statusValue === "true" ? true : statusValue === "false" ? false : ""}` : ""
			}`
		);
	};


	const onSwitchClick = () => {
		setGrid(!grid);
	};

	// Construct the URL for doctors list
	const url = `/doctor?size=10${name ? `&name=${name}` : ""}${
		selectedSpeciality ? `&specialty=${selectedSpeciality}` : ""
	}${selectedStatus ? `&isActive=${selectedStatus}` : ""}${inHouse ? `&isInHouse=${inHouse}` : ""}`;

	return (
		<SidebarPermission tag="doctor">
			<ContentWrapper>
				<div className=" flex flex-wrap justify-between items-center ">
					<RolePermissionChecker tag="doctor" name="list">
						<div className="flex mt-2 md:mt-0 items-center gap-3 ">

							<select
								className="border-2 border-primary-200 bg-white rounded-md px-2 py-2 w-[200px] focus:outline-none"
								onChange={handleSpecialityChange}
								value={selectedSpeciality}
							>
								<option value="">All Speciality</option>
								{specialties.map((speciality: any) => (
									<option key={speciality?.id} value={speciality?.id}>
										{speciality?.name?.en}
									</option>
								))}
							</select>
							<select
								className="border-2 border-primary-200 bg-white rounded-md px-2 py-2 w-[200px] focus:outline-none "
								onChange={handleStatusChange}
								value={selectedStatus}
							>
								<option value="">Status</option>
								<option value="true">Active</option>
								<option value="false">Inactive</option>
							</select>
							<Searcher prop={"name"} url={`/doctor?size=10&page=0`}/>
						</div>
					</RolePermissionChecker>

					<div className="flex items-center gap-2 ">
						<RolePermissionChecker tag="doctor" name="list">
							<div className="cursor-pointer" onClick={onSwitchClick}>
								{
									grid ? <CiCircleList size={32} className="text-primary-500 font-extrabold"/> :
										<CiGrid41 size={32} className="text-primary-500 font-extrabold"/>
								}
							</div>
						</RolePermissionChecker>
						<RolePermissionChecker tag="doctor" name="create">
							<AddButton text="Add Doctor" link="/doctor/create"/>
						</RolePermissionChecker>

					</div>

				</div>
				<RolePermissionChecker tag="doctor" name="list">
					{doctors?.data?.doctors.length > 0 ? (
						<>
							{grid ? (
								<DoctorsList doctors={doctors?.data} url={url}/>
							) : (
								<div className="overflow-y-auto grid grid-cols-12 mt-[-20px]">
									<div className="col-span-12 ">
										<DoctorTable doctors={doctors?.data} url={url}/>
									</div>
								</div>
							)}
						</>
					) : (
						<NoDataFound/>
					)}
				</RolePermissionChecker>

			</ContentWrapper>
		</SidebarPermission>

	);
};

export default DoctorsSection;
