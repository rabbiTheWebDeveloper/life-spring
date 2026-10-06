"use client";
import CreateActionButton from "@/app/components/buttons/actionButtons/CreateActionButton";
import CreateScheduleActionButton from "@/app/components/buttons/actionButtons/CreateScheduleActionButton";
import UpdateActionButton from "@/app/components/buttons/actionButtons/UpdateActionButton";
import ViewActionButton from "@/app/components/buttons/actionButtons/ViewActionButton";
import ViewScheduleActionButton from "@/app/components/buttons/actionButtons/ViewScheduleActionButton";
import FormattedDate from "@/app/components/layout/FormattedDate";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import DataTable from "@/app/components/tables/DataTable";
import { Image, message, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdSystemUpdateAlt } from "react-icons/md";
import { getBranchList } from "../../branch/actions/GetBranchList";
import { getDoctorDetails } from "../actions/getDoctorDetails";
import BranchUpdateModal from "./BranchUpdateModal";
import DoctorDisableSwitch from "./DoctorDisableSwitch";
import { updateDoctor } from "../actions/updateBranch";
import DoctorDateRangeModal from "./DeleteDoctorSchedule";

const DoctorTable = ({ doctors, url, pagination, fetchData, loading = false }: any) => {
	// console.log(doctors[0]);
	const router = useRouter();
	const [branchList, setBranchList] = useState<any[]>([]);
	const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
	const [showModal, setShowModal] = useState<any>(false);

	// Every action here either navigates to a server-rendered page or fires an
	// API call, both of which take a moment with no visible change. We track
	// which specific button was pressed so only that one shows a spinner.
	const [isPending, startTransition] = useTransition();
	const [pendingKey, setPendingKey] = useState<string | null>(null);

	useEffect(() => {
		if (!isPending) setPendingKey((key) => (key?.startsWith("nav:") ? null : key));
	}, [isPending]);

	const navigateTo = (key: string, href: string) => {
		setPendingKey(`nav:${key}`);
		startTransition(() => router.push(href));
	};

	const isLoading = (key: string) => pendingKey === `nav:${key}` || pendingKey === key;

	const handleDoctorStatusChange = async (doctorId: string, value: boolean) => {
		console.log(value);
		try {
			const formData = new FormData();
			formData.append("inactiveForAppointment", String(!value));

			const res = await updateDoctor(doctorId, formData);

			if (res?.success) {
				message.success(res.message);
				fetchData();
			}
		} catch (error) {
			console.error("Failed to update doctor status");
		}
	};
	const handleDoctorWebsiteStatusChange = async (doctorId: string, value: boolean) => {
		console.log(value);
		try {
			const formData = new FormData();
			formData.append("isActive", String(value));

			const res = await updateDoctor(doctorId, formData);
			console.log(res);

			if (res?.success) {
				message.success(res.message);
				fetchData();
			}
		} catch (error) {
			console.error("Failed to update doctor status");
		}
	};

	const columns = [
		{
			title: "No",
			dataIndex: "no",
			key: "no",
			render: (_: any, __: any, index: number) => index + 1,
		},
		{
			title: "Doctor Details",
			dataIndex: "name",
			key: "name",
			render: (name: string, doctor: any) => (
				<div className="flex gap-2 items-center">
					<Image
						src={doctor?.profilePic || "/blank-avatar.jpg"}
						width={50}
						height={50}
						alt="doctor"
						className="rounded-md object-cover"
						preview={true}
					/>
					<div>
						<h2 className="text-sm font-bold">{name ?? "-"}</h2>
						<p>{doctor.mobile ?? "-"}</p>
						<p>{doctor.email ?? "-"}</p>
					</div>
				</div>
			),
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
			render: (bmdcExpiryDate: string) => <FormattedDate isoString={bmdcExpiryDate} />,
		},
		{
			title: "Website Visibility",
			dataIndex: "isActive",
			key: "isActive",
			render: (isActive: boolean, record: any) => (
				<>
					{/* <h2
						className={`min-w-fit w-fit px-3 py-0.5 text-white text-sm rounded-md text-center ${
							isActive ? "bg-green-400" : "bg-red-400"
						}`}
					>
						{" "}
						{isActive ? "Active" : "Inactive"}
					</h2> */}
					<DoctorDisableSwitch
						checked={isActive}
						onConfirm={(value) => handleDoctorWebsiteStatusChange(record.id, value)}
					/>
				</>
			),
		},
		{
			title: "Appointment Visibility",
			dataIndex: "inactiveForAppointment",
			key: "inactiveForAppointment",
			render: (inactiveForAppointment: boolean, record: any) => (
				<>
					<DoctorDisableSwitch
						checked={!inactiveForAppointment}
						onConfirm={(value) => handleDoctorStatusChange(record.id, value)}
					/>
				</>
			),
		},

		{
			title: "Action",
			dataIndex: "id",
			key: "action",
			render: (id: string, record: any) => (
				<div className="flex justify-start items-center gap-x-2 ">
					<ViewActionButton
						rolePermissionTag="doctor"
						onButtonClick={() => navigateTo(`view-${id}`, `/doctor/${id}`)}
						loading={isLoading(`view-${id}`)}
					/>
					<UpdateActionButton
						rolePermissionTag="doctor"
						onButtonClick={() => navigateTo(`update-${id}`, `/doctor/${id}/update`)}
						loading={isLoading(`update-${id}`)}
					/>
					<RolePermissionChecker tag="appointment" name="update">
						<Tooltip
							placement="top"
							title={isLoading(`branch-${id}`) ? "Loading..." : "Update Branch"}
							color="#2db7f5"
						>
							<button
								type="button"
								aria-busy={isLoading(`branch-${id}`)}
								disabled={isLoading(`branch-${id}`)}
								className={`bg-red-400 flex items-center justify-center rounded-md p-1 text-white ${
									isLoading(`branch-${id}`) ? "opacity-70 cursor-wait" : "cursor-pointer"
								}`}
								onClick={() => fetchDoctorData(record?.id)}
							>
								{isLoading(`branch-${id}`) ? (
									<AiOutlineLoading3Quarters size={16} className="animate-spin" />
								) : (
									<MdSystemUpdateAlt size={16} />
								)}
							</button>
						</Tooltip>
					</RolePermissionChecker>
					<CreateScheduleActionButton
						rolePermissionTag="doctor"
						onButtonClick={() => navigateTo(`schedule-${id}`, `/doctor/schedule/${id}`)}
						toolTipTitle="Plan schedule"
						loading={isLoading(`schedule-${id}`)}
					/>
					<ViewScheduleActionButton
						rolePermissionTag="doctor"
						onButtonClick={() =>
							navigateTo(
								`slots-${id}`,
								`/available-slot-report?doctorId=${id}&doctorName=${record.name}`
							)
						}
						loading={isLoading(`slots-${id}`)}
					/>

					<CreateActionButton
						rolePermissionTag="appointment"
						onButtonClick={() => navigateTo(`book-${id}`, `/appointment-booking?type=doctor&id=${id}`)}
						toolTipTitle={"Book Appointment"}
						loading={isLoading(`book-${id}`)}
					/>
					<DoctorDateRangeModal
						doctorId={id}
						doctor={record}
						fetchData={fetchData}
						fetchDoctorData={fetchDoctorData}
						selectedDoctor={selectedDoctor}
					/>
				</div>
			),
		},
	];

	const fetchDoctorData = async (id: any, shouldShowModal = true) => {
		setPendingKey(`branch-${id}`);
		try {
			const res: any = await getDoctorDetails(id);
			if (res?.success) {
				setSelectedDoctor(res.data);
				if (shouldShowModal) setShowModal(true);
			} else {
				throw new Error(res?.message || "Failed to fetch doctor details");
			}
		} catch (error: any) {
			message.error("Failed to fetch doctor details");
		} finally {
			setPendingKey(null);
		}
	};

	const dataSource = doctors?.map((doctor: any, index: number) => ({
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
		profilePic: doctor?.profilePic,
		inactiveForAppointment: doctor?.inactiveForAppointment,
	}));
	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getBranchList(0, "", 20);
				if (res?.success) {
					setBranchList([
						{ value: "", label: "Select Branch", disabled: true },
						...res.data.data.map((branch: any) => ({
							label: branch.name,
							value: String(branch.id),
						})),
					]);
				} else {
					throw new Error(res?.message || "Failed to Fetch Organization List");
				}
			} catch (error: any) {
				console.error("Failed to Fetch Organization List");
			}
		};
		fetchData();
	}, []);
	return (
		<>
			<DataTable
				rolePermissionTag="doctor"
				tableColumns={columns}
				tableData={dataSource}
				paginationUrl={url}
				paginationData={pagination}
				loading={loading}
			/>
			<BranchUpdateModal
				showModal={showModal}
				setShowModal={setShowModal}
				doctor={selectedDoctor}
				branchList={branchList}
			/>
		</>
	);
};

export default DoctorTable;
