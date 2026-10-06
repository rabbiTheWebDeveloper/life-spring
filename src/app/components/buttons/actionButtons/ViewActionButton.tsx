import { SlEye } from "react-icons/sl";
import ActionButton from "./ActionButton";

export default function ViewActionButton({ rolePermissionTag, onButtonClick, toolTipTitle = "View Details" , loading}: any) {
	return (
		<ActionButton
			rolePermissionTag={rolePermissionTag}
			rolePermissionName="view"
			toolTipColor="#2db7f5"
			buttonColor="bg-blue-500"
			toolTipTitle={toolTipTitle}
			onButtonClick={onButtonClick}
			loading={loading}
		>
			<SlEye size="15px" color="#fff" />
		</ActionButton>
	);
}
