"use client";

import ContentWrapper from "@/app/components/layout/wrappers/ContentWrapper";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import DataTable from "@/app/components/tables/DataTable";
import { dhakaNow } from "@/helper/DhakaTime";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useAuth } from "../../AuthContext";
import { getRoleList } from "../actions/GetRoleList";
import { updateUser } from "../actions/UpdateUser";
import { getUserDetails } from "./actions/GetUserDetails";
import UserDetailsForm from "./components/UserDetailsForm";
import { getUserLogTableColumns } from "./components/UserLogTableColumns";

interface Props {
	params: { [key: string]: number };
	searchParams: { [key: string]: string | undefined };
}
export default function UserDetailsPage({ params, searchParams }: Props) {
	const { user } = useAuth();
	const userId: number = params.id;
	const isReadOnly: any = searchParams.readonly;

	const [loading, setLoading] = useState<boolean>(false);
	const [roleList, setRoleList] = useState<any[]>([]);

	const [initialUserDetails, setInitialUserDetails] = useState<any>({
		firstName: "",
		lastName: "",
		roleId: null,
		email: "",
		designation: "",
		officeId: "",
		mobile: "",
		requestRemarks: "",
		roleName: "",
	});
	const [userDetails, setUserDetails] = useState<any>({
		firstName: "",
		lastName: "",
		roleId: null,
		email: "",
		designation: "",
		officeId: "",
		mobile: "",
		requestRemarks: "",
		roleName: "",
	});

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

	useEffect(() => {
		const fetchData = async () => {
			try {
				const res: any = await getRoleList();
				if (res?.success) {
					setRoleList(res.data.map((role: any) => ({ label: role.name, value: role.id })));
				} else {
					throw new Error(res?.message || "Failed to Fetch Role List");
				}
			} catch (error: any) {
				message.error("Failed to Fetch Role List");
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await getUserDetails(userId);
				setUserDetails({
					firstName: res.data?.firstName,
					lastName: res.data?.lastName,
					nickName: res.data?.nickName,
					roleId: res.data?.userRole ? res.data?.userRole?.id : "",
					email: res.data?.email,
					designation: res.data?.designation,
					officeId: res.data?.officeId,
					mobile: res.data?.mobile,
					isActive: res.data?.isActive,
					requestRemarks: res.data?.requestRemarks,
					roleName: res.data?.userRole ? res.data?.userRole?.name : "",
				});
				setInitialUserDetails({
					firstName: res?.data?.firstName,
					lastName: res?.data?.lastName,
					nickName: res?.data?.nickName,
					roleId: res?.data?.userRole ? res?.data?.userRole?.id : "",
					email: res?.data?.email,
					designation: res?.data?.designation,
					officeId: res?.data?.officeId,
					mobile: res?.data?.mobile,
					isActive: res?.data?.isActive,
					requestRemarks: res?.data?.requestRemarks,
					roleName: res?.data?.userRole ? res?.data?.userRole?.name : "",
				});
			} catch (error) {
				message.error("Failed to Update User Details");
			}
		};

		fetchData();
	}, [userId]);

	async function handleFormSubmit() {
		try {
			const payload = {
				firstName: userDetails?.firstName,
				lastName: userDetails?.lastName,
				nickName: userDetails?.nickName,
				roleId: userDetails?.roleId,
				email: userDetails?.email,
				designation: userDetails?.designation,
				officeId: userDetails?.officeId,
				mobile: userDetails?.mobile,
			};
			// console.log(payload.requestRemarks);
			const formData = new FormData();
			Object.entries(payload).forEach(([key, value]: any) => {
				formData.append(key, value);
			});
			Object.entries(payload).forEach(([key, value]: any) => {
				console.log(key, value);
			});
			if (initialUserDetails.roleId !== userDetails.roleId) {
				formData.append("requestRemarks[agentId]", `${user.id}`);
				formData.append(
					"requestRemarks[remarks]",
					`Changed User Role from ${initialUserDetails.roleName ? initialUserDetails.roleName : "Unassigned"} to ${
						roleList.find((item: any) => item.value === userDetails.roleId)?.label ?? ""
					}`
				);
				formData.append("requestRemarks[agentName]", `${user.firstName} ${user.lastName}`);
				formData.append("requestRemarks[createdAt]", dhakaNow().format("DD-MM-YYYY hh:mm:ss A"));
			}
			if (initialUserDetails.isActive !== userDetails?.isActive) {
				formData.append("isActive", userDetails.isActive);
			}

			const res = await updateUser(userId, formData);
			console.log(res);

			if (res?.success) {
				message.success(res.message);
				setUserDetails({ ...userDetails, requestRemarks: res.data.requestRemarks });
				setInitialUserDetails(userDetails);
			} else {
				throw new Error(res?.message || "Failed to create user");
			}
		} catch (error: any) {
			message.error(error?.message || "Failed to update user");
		}
	}
	const logColumns = getUserLogTableColumns();
	return (
		<>
			<UserDetailsForm
				userDetails={userDetails}
				onFormSubmit={handleFormSubmit}
				onInputChange={handleInputChange}
				onSelectChange={handleSelectChange}
				roleList={roleList}
				isReadOnly={isReadOnly}
			/>
			<ContentWrapper tag="user-role-permission-user">
				<RolePermissionChecker tag="user-role-permission-user" name="list">
					<h4 className="text-xl font-bold text-primary">Activity Log</h4>
				</RolePermissionChecker>

				<DataTable
					rolePermissionTag="user-role-permission-user"
					tableColumns={logColumns}
					tableData={Array.isArray(userDetails?.requestRemarks) ? [...userDetails.requestRemarks] : []}
				/>
			</ContentWrapper>
		</>
	);
}
