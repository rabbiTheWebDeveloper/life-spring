import RolePermissionChecker from "../../rolepermission/HandleRolePermission";

export default function FilterWrapper({ permissionTag = "", children }: any) {
	return (
		<>
			<RolePermissionChecker tag={permissionTag} name="list">
				<div className="flex gap-2">{children}</div>
			</RolePermissionChecker>
		</>
	);
}
