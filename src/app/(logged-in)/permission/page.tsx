"use client";

import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";
import Searcher from "@/app/components/layout/Searcher";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import { message } from "antd";
import { useEffect, useState } from "react";
import { createNewPermission } from "./actions/CreateNewPermission";
import { getPermissionList } from "./actions/GetPermissionList";
import AddSinglePermissionModal from "./components/AddSinglePermissionModal";
import PermissionDetailsModal from "./components/PermissionDetailsModal";
import PermissionTable from "./components/PermissionTable";

interface Props {
	searchParams: { [key: string]: string | undefined };
}
export default function PermissionPage({ searchParams }: Props) {
	const page = searchParams.page ?? 0;
	const size = searchParams.size ?? 10;
	const search = searchParams.search ?? "";
	const [loading, setLoading] = useState<boolean>(false);
	const [permissionList, setPermissionList] = useState<any[]>([]);
	const [selectedType, setSelectedType] = useState<any>("shukhee");
	const [permissionDetails, setPermissionDetails] = useState({
		name: "",
		type: "lifespring",
	});
	const [showModal, setShowModal] = useState<boolean>(false);
	const [showSingularPermissionModal, setShowSingularPermissionModal] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res: any = await getPermissionList(page, size, selectedType, search);
				if (res?.success) {
					const groupedPermissions = res.data.reduce((acc: any, { tag, type, name }: any) => {
						if (!acc[tag]) {
							acc[tag] = {};
						}
						if (!acc[tag][type]) {
							acc[tag][type] = [];
						}
						acc[tag][type].push(name);
						return acc;
					}, {});
					setPermissionList(groupedPermissions);
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
		setShowSingularPermissionModal(false);
		setPermissionDetails({
			name: "",
			type: "lifespring",
		});
	}

	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setPermissionDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};
	const handleSelectChange = (name: any, value: any) => {
		setPermissionDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));

	};

	async function handleFormSubmit(e: any) {
		e.preventDefault();
		try {
			const res = await createNewPermission(permissionDetails);


			if (res?.success) {
				message.success("Permission Created Successfully");
				window.location.reload();
			} else {
				throw new Error(res?.message || "Failed to create permission");
			}

			setShowModal(false);
			handleModalClose();
		} catch (error: any) {
			message.error(error.message || `Failed to create permission`);
		}
	}
	function handleSingularPermissionAdd(data: any) {
		setPermissionDetails({
			name: data.type,
			type: data.tag,
		});
		setShowSingularPermissionModal(true);
	}
	return (
		<>
			<SidebarPermission tag="user-role-permission">
				<div className="mb-4 p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">
					<div className="flex w-full justify-between items-end">
						<RolePermissionChecker tag="user-role-permission-permission" name="list">
							<div className="flex gap-4">
								<Searcher prop={"search"} url={`/permission?size=10&page=0`} />
							</div>
						</RolePermissionChecker>

						<RolePermissionChecker tag="user-role-permission-permission" name="create">
							<CreateTooltipButton onClickFnc={handleCreate} title="Create Permission" />
						</RolePermissionChecker>
					</div>
					{/* TABLE */}
					<RolePermissionChecker tag="user-role-permission-permission" name="list">
						<PermissionTable permissionList={permissionList} onAddSingularPermission={handleSingularPermissionAdd} loading={loading} />
					</RolePermissionChecker>
				</div>
			</SidebarPermission>
			<PermissionDetailsModal
				showModal={showModal}
				onModalClose={handleModalClose}
				onInputChange={handleInputChange}
				onSelectChange={handleSelectChange}
				onFormSubmit={handleFormSubmit}
				permissionDetails={permissionDetails}
			/>
			<AddSinglePermissionModal
				showModal={showSingularPermissionModal}
				onModalClose={handleModalClose}
				permissionDetails={permissionDetails}
			/>
		</>
	);
}
