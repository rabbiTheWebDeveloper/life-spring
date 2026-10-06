import { CiEdit } from "react-icons/ci";
import ActionButton from "./ActionButton";

export default function UpdateActionButton({ rolePermissionTag, onButtonClick, toolTipTitle = "Update Details" , loading}: any) {
	return (
		<ActionButton
			rolePermissionTag={rolePermissionTag}
			rolePermissionName="update"
			toolTipColor="#2db7f5"
			buttonColor="bg-green-700"
			toolTipTitle={toolTipTitle}
			onButtonClick={onButtonClick}
			loading={loading}
		>
			<CiEdit size="15px" color="#fff" />
		</ActionButton>
	);
}
