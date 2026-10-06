import { GoPlus, GoUpload } from "react-icons/go";
import RolePermissionChecker from "../rolepermission/HandleRolePermission";
import Button from "./Button";

const CreateButton = ({
	onButtonClick,
	tooltipTitle = "Create",
	permissionTag,
	permissionName = "create",
	buttonType = "normal",
	size=18
}: any) => {
	return (
		<RolePermissionChecker tag={permissionTag} name={permissionName}>
			<Button onButtonClick={onButtonClick} tooltipTitle={tooltipTitle}>
				{buttonType === "normal" && <GoPlus size={size} />}
				{buttonType === "bulk" && <GoUpload size={18} />}
				{/* {buttonType === "custom" && children} */}
			</Button>
		</RolePermissionChecker>
	);
};

export default CreateButton;
