"use client";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../../dashboard/components/Loader";
import { assignPermission } from "./actions/AssignPermission";
import { getRoleDetails } from "./actions/GetRoleDetails";
import GroupedTable from "./components/GroupedTable";

interface Props {
	params: { [key: string]: number };
	searchParams: { [key: string]: string | undefined };
}

export default function SingularRolePage({ params, searchParams }: Props) {
	const router = useRouter();
	const id = params.id;
	const type = searchParams.type ?? "";
	const [selectedPermissions, setSelectedPermissions] = useState<any[]>([]);
	const [name, setName] = useState<any>("");
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res: any = await getRoleDetails(id);
				console.log(res);
				if (res?.success) {
					console.log(res.data);
					setName(res.data.name);
					setSelectedPermissions(res.data.permissions.map((permission: any) => permission.id));
					setLoading(false);
				} else {
					throw new Error(res?.message || "Failed to Fetch Role Details");
				}
			} catch (error: any) {
				message.error("Failed to Fetch Role Details");
			}
		};
		fetchData();
	}, [id]);

	async function handleSubmit() {
		try {
			const payload = {
				name,
				permissionIds: selectedPermissions,
			};
			const res: any = await assignPermission(id, payload);
			console.log(res);
			if (res?.success) {
				message.success(res.message);
				router.push("/role");
			} else {
				throw new Error(res?.message || "Failed to Assign Permissions");
			}
		} catch (error: any) {
			message.error(error);
		}
	}

	if (loading) {
		return <Loader />;
	}
	return (
		<>
			{/* <RolePermissionChecker tag="user-role-permission-role" name="update"> */}
			<div className="bg-white border rounded-lg p-4">
				<h2 className="text-xl text-primary font-semibold">Assign Permissions to {name}</h2>
				<br />
				<GroupedTable type={type} selected={selectedPermissions} setSelected={setSelectedPermissions} />
				<div className="col-span-2 text-center mt-4">
					<button onClick={handleSubmit} className="bg-green-500 w-[20%] px-2 py-1 text-white rounded-md">
						Assign Permission
					</button>
				</div>
			</div>
			{/* </RolePermissionChecker> */}
		</>
	);
}
