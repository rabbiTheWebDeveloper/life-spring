//@ts-nocheck
"use client";

import UserDetailsModal from "@/app/(logged-in)/user/Components/UserDetailsModal";
import UsersTable from "@/app/(logged-in)/user/Components/UserTable";
import CreateTooltipButton from "@/app/components/buttons/AddToolTIpButton";
import NoDataFound from "@/app/components/layout/NoDataFound";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createNewUser } from "./actions/CreateUser";
import { getUserList } from "./actions/GetUserList";
import SearchFromList from "../../components/filters/SearchFromList";

interface Props {
	searchParams: { [key: string]: string | undefined };
}

const UserListPage = ({ searchParams }: Props) => {
	const router = useRouter();
	const page = searchParams.page ?? 0;
	const search = searchParams.search ?? "";

	const [userList, setUserList] = useState<any>(null);
	const [userDetails, setUserDetails] = useState<any>({
		firstName: "",
		lastName: "",
		roleId: null,
		email: "",
		designation: "",
		officeId: "",
		mobile: "",
	});

	const [loading, setLoading] = useState<boolean>(false);
	const [userIdNumber, setUserIdNumber] = useState<any>(null);
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await getUserList(page, search);
				if (res?.success) {
					setUserList(res.data);
				} else {
					message.error("Failed to Fetch User List");
				}
			} catch (error) {
				message.error("Failed to Fetch User List");
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [page, search]);

	function handleModalClose() {
		setShowModal(false);
		setUserDetails({
			firstName: "",
			lastName: "",
			roleId: null,
			email: "",
			designation: "",
			officeId: "",
			mobile: "",
		});
		setIsEditing(false);
	}
	const handleInputChange = (e: any) => {
		const { name, value } = e.target;
		setUserDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};
	const handleSelectChange = (name: any, value: any) => {
		setUserDetails((prevState: any) => ({
			...prevState,
			[name]: value,
		}));
	};
	async function handleFormSubmit(e: any) {
		e.preventDefault();
		try {
			const res = await createNewUser(userDetails);
			if (res?.success) {
				message.success(res.message);
				setUserList({ ...userList, data: [res.data, ...userList.data] });
				// window.location.reload();
			} else {
				throw new Error(res?.message || "Failed to create user");
			}

			setShowModal(false);
			handleModalClose();
		} catch (error: any) {
			message.error(error?.message || "Failed to update user");
		}
	}

	async function handleEdit(recordId: any) {
		router.push(`user/${recordId}`);
	}
	async function handleView(recordId: any) {
		router.push(`user/${recordId}?readonly=true`);
	}

	return (
		<>
			<SidebarPermission tag="user-role-permission">
				<div className="mb-4 p-8 rounded-lg border bg-white flex flex-col gap-10 mt-2">
					<div className="flex items-center justify-between gap-3">
						<SearchFromList url="/user?" prop="search" placeholder="Search user name" />
						<RolePermissionChecker tag="user-role-permission-user" name="create">
							<CreateTooltipButton onClickFnc={() => setShowModal(true)} title="Add User" />
						</RolePermissionChecker>
					</div>
					<div className="flex flex-col ">
						<RolePermissionChecker tag="user-role-permission-user" name="list">
							{userList?.data?.length > 0 || loading ? (
								<UsersTable users={userList} onEdit={handleEdit} onView={handleView} loading={loading} />
							) : (
								<NoDataFound />
							)}
						</RolePermissionChecker>
					</div>
				</div>
			</SidebarPermission>
			<UserDetailsModal
				showModal={showModal}
				onModalClose={handleModalClose}
				onInputChange={handleInputChange}
				onSelectChange={handleSelectChange}
				onFormSubmit={handleFormSubmit}
				userDetails={userDetails}
				isEditing={isEditing}
			/>
		</>
	);
};

export default UserListPage;
