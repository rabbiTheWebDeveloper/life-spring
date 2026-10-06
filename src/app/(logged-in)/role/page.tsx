"use client";

import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";
import Searcher from "@/app/components/layout/Searcher";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import { message } from "antd";
import { useEffect, useState } from "react";
import { createNewRole } from "./actions/CreateNewRole";
import { getRoleList } from "./actions/GetRoleList";
import RoleDetailsModal from "./components/RoleDetailsModal";
import RoleTable from "./components/RoleTable";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

export default function RolePage({ searchParams }: Props) {
	const page = searchParams.page ?? 0;
	const size = searchParams.size ?? 10;
	const search = searchParams.search ?? "";
	const [loading, setLoading] = useState<boolean>(false);
	const [roleList, setRoleList] = useState<any[]>([]);
	const [pagination, setPagination] = useState<any[]>([]);
	const [selectedType, setSelectedType] = useState<any>("shukhee");
	const [roleDetails, setRoleDetails] = useState({
		name: "",
		type: "lifespring",
	});

	const [showModal, setShowModal] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res: any = await getRoleList(page, size, selectedType, search);
				if (res?.success) {
					setRoleList(res.data.data);
					setPagination(res.data.pagination);
				} else {
					throw new Error(res?.message || "Failed to Fetch Role List");
				}
			} catch (error: any) {
				message.error("Failed to Fetch Role List");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [page, size, selectedType, search]);

	function handleCreate() {
		setShowModal(true);
	}
	function handleModalClose() {
		setShowModal(false);
		setRoleDetails({
			name: "",
			type: "lifespring",
		});
	}

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setRoleDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};
	const handleSelectChange = (name: any, value: any) => {
		setRoleDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
		console.log(name, value);
	};

	async function handleFormSubmit(e: any) {
		e.preventDefault();
		try {
			const res = await createNewRole(roleDetails);
			console.log(res);

			if (res?.success) {
				message.success("Role Created Successfully");
				window.location.reload();
			} else {
				throw new Error(res?.message || "Failed to create role");
			}

			setShowModal(false);
			handleModalClose();
		} catch (error: any) {
			message.error(error.message || `Failed to create role`);
		}
	}
	return (
		<>
			<SidebarPermission tag="user-role-permission">
				<div className="mb-4 p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">
					<div className="flex w-full justify-between items-end">
						<div className="flex gap-4">
							<Searcher prop={"search"} url={`/role?size=10&page=0`} />
							{/*<select*/}
							{/*	className="border border-primary  rounded-md px-2 py-2 w-[200px] text-sm focus:outline-none"*/}
							{/*	onChange={(e) => {*/}
							{/*		setSelectedType(e.target.value);*/}
							{/*	}}*/}
							{/*	value={selectedType}*/}
							{/*>*/}
							{/*	/!* <option value="">Select Type</option> *!/*/}
							{/*	<option value="shukhee">Shukhee</option>*/}
							{/*	<option value="ssk-portal">SSK Portal</option>*/}
							{/*	<option value="eye-hospital">Eye Hospital</option>*/}
							{/*</select>*/}
						</div>
						<RolePermissionChecker tag="user-role-permission-role" name="create">
							<CreateTooltipButton onClickFnc={handleCreate} title="Create Role" />
						</RolePermissionChecker>
					</div>
					<RolePermissionChecker tag="user-role-permission-role" name="list">
						<RoleTable roleList={roleList} pagination={pagination} url={"role?size=10"} loading={loading} />
						{/* TABLE */}
					</RolePermissionChecker>
				</div>
			</SidebarPermission>
			<RoleDetailsModal
				showModal={showModal}
				onModalClose={handleModalClose}
				onInputChange={handleInputChange}
				onSelectChange={handleSelectChange}
				onFormSubmit={handleFormSubmit}
				roleDetails={roleDetails}
			/>
		</>
	);
}
