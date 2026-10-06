import { Tooltip } from "antd";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import RolePermissionChecker from "../../rolepermission/HandleRolePermission";

export default function ActionButton({
	rolePermissionTag,
	rolePermissionName,
	toolTipTitle,
	toolTipColor = "#000000",
	onButtonClick,
	buttonColor,
	children,
	// These actions trigger a request before anything visibly changes. Without
	// feedback the button looks dead and users click it repeatedly.
	loading = false,
}: any) {
	return (
		<RolePermissionChecker tag={rolePermissionTag} name={rolePermissionName}>
			<Tooltip placement="top" title={loading ? "Loading..." : toolTipTitle} color={toolTipColor}>
				<button
					type="button"
					aria-busy={loading}
					disabled={loading}
					className={`flex items-center justify-center rounded-md px-1 py-1 text-white ${buttonColor} ${
						loading ? "opacity-70 cursor-wait" : "cursor-pointer"
					}`}
					onClick={onButtonClick}
				>
					{loading ? <AiOutlineLoading3Quarters size="15px" color="#fff" className="animate-spin" /> : children}
				</button>
			</Tooltip>
		</RolePermissionChecker>
	);
}
