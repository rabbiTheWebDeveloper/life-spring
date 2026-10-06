import { MdSwapCalls } from "react-icons/md";
import ActionButton from "./ActionButton";

export default function AssignActionButton({ rolePermissionTag, onButtonClick, toolTipTitle = "Assign" , loading}: any) {
	return (
		<ActionButton
			rolePermissionTag={rolePermissionTag}
			rolePermissionName="update"
			toolTipColor="#2db7f5"
			buttonColor="bg-primary"
			toolTipTitle={toolTipTitle}
			onButtonClick={onButtonClick}
			loading={loading}
		>
			<MdSwapCalls size="15px" color="#fff" />
		</ActionButton>
	);
}
