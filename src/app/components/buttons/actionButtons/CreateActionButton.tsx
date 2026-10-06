import { SlPlus } from "react-icons/sl";
import ActionButton from "./ActionButton";

export default function CreateActionButton({ rolePermissionTag, onButtonClick, toolTipTitle = "Create" , loading}: any) {
	return (
		<ActionButton
			rolePermissionTag={rolePermissionTag}
			rolePermissionName="create"
			toolTipColor="#2db7f5"
			buttonColor="bg-green-500"
			toolTipTitle={toolTipTitle}
			onButtonClick={onButtonClick}
			loading={loading}
		>
			<SlPlus size="15px" color="#fff" />
		</ActionButton>
	);
}
