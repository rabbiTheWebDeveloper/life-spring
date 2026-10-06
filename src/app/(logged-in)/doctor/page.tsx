"use client";
import CreateButton from "@/app/components/buttons/CreateButton";
import ResetFilterButton from "@/app/components/buttons/ResetFilterButton";
import SearchableDropDown from "@/app/components/filters/SearchableDropDown";
import SearchFromList from "@/app/components/filters/SearchFromList";
import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import FilterWrapper from "@/app/components/layout/wrappers/FilterWrapper";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getDoctorList } from "./actions/GetDoctorList";
import { getSpecialityList } from "./actions/GetSpecialityList";
import DoctorTable from "./components/DoctorTable";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const DoctorPage = ({ searchParams }: Props) => {
	const router = useRouter();
	const today = new Date();
	const previous30Days = new Date(today);
	previous30Days.setDate(today.getDate() - 30);

	const page = searchParams.page ?? 0;
	const size = searchParams.size ?? 12;
	const name = searchParams.name;
	const status = searchParams.status;
	const from = searchParams.from || previous30Days.toISOString().split("T")[0];
	const to = searchParams.to || new Date().toISOString().split("T")[0];
	const specialty = searchParams.specialty;
	const specialtyId = searchParams.specialtyId;
	const isActive = searchParams.isActive;

	const [loading, setLoading] = useState<boolean>(true);
	const [doctorList, setDoctorList] = useState<any[]>([]);
	const [pagination, setPagination] = useState<any>(null);
	const [specialties, setSpecialties] = useState<any[]>([]);

	const fetchData = async () => {
		setLoading(true);
		try {
			const res: any = await getDoctorList(page, name, specialty, isActive);
			setDoctorList(res?.data?.doctors);
			setPagination(res?.data?.pagination);
		} catch (error: any) {
			message.error("Failed to Fetch Doctor List");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchData();
	}, [page, name, specialty, isActive]);

	useEffect(() => {
		const fetchData = async () => {
			// setLoading(true);
			try {
				const res: any = await getSpecialityList();
				// console.log(res);
				setSpecialties(res?.data);
			} catch (error: any) {
				message.error("Failed to Fetch Speciality List");
			}
		};
		fetchData();
	}, []);

	return (
		<>
			<ContentWrapper permissionTag="doctor">
				<div className="flex flex-wrap justify-between items-center ">
					<FilterWrapper permissionTag="doctor">
						<SearchFromList
							url={`/doctor?size=10&page=0${specialty ? `&specialty=${specialty}` : ""}${
								isActive ? `&isActive=${isActive}` : ""
							}`}
							prop="name"
							placeholder="search by name"
						/>

						<SearchableDropDown
							url={`/doctor?size=10&page=0${name ? `&name=${name}` : ""}${isActive ? `&isActive=${isActive}` : ""}`}
							prop="specialty"
							selectionOption={[
								{ value: "", label: "Select Speciality", disabled: true },
								...specialties?.map((speciality: any) => ({
									value: speciality.id.toString(),
									label: speciality.name?.en,
								})),
							]}
						/>
						<SearchableDropDown
							url={`/doctor?size=10&page=0${name ? `&name=${name}` : ""}${specialty ? `&specialty=${specialty}` : ""}`}
							prop="isActive"
							selectionOption={[
								{ value: "", label: "Select Status", disabled: true },
								{ value: "true", label: "Active" },
								{ value: "false", label: "Inactive" },
							]}
						/>
						<ResetFilterButton />
					</FilterWrapper>

					<CreateButton
						permissionTag="doctor"
						tooltipTitle="Create Doctor"
						onButtonClick={() => router.push("/doctor/create")}
					/>
				</div>
				<DoctorTable
					doctors={doctorList}
					url={`/doctor?size=10${name ? `&name=${name}` : ""}${specialty ? `&specialty=${specialty}` : ""}${
						isActive ? `&isActive=${isActive}` : ""
					}`}
					pagination={pagination}
					fetchData={fetchData}
					loading={loading}
				/>
			</ContentWrapper>
		</>
	);
};

export default DoctorPage;
