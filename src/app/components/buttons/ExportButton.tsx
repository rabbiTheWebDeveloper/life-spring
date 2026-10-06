import { FaFileDownload } from "react-icons/fa";
import RolePermissionChecker from "../rolepermission/HandleRolePermission";
import Button from "./Button";

const ExportButton = ({ onButtonClick, tooltipTitle = "Export", permissionTag, permissionName = "export" }: any) => {
	return (
		<RolePermissionChecker tag={permissionTag} name={permissionName}>
			<Button onButtonClick={onButtonClick} tooltipTitle={tooltipTitle}>
				<FaFileDownload size={18} />
			</Button>
		</RolePermissionChecker>
	);
};

export default ExportButton;
