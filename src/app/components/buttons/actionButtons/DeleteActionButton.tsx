import { TiTrash } from "react-icons/ti";
import ActionButton from "./ActionButton";

export default function DeleteActionButton({ rolePermissionTag, onButtonClick, toolTipTitle = "Delete" , loading}: any) {
	return (
		<ActionButton
			rolePermissionTag={rolePermissionTag}
			rolePermissionName="delete"
			toolTipColor="#2db7f5"
			buttonColor="bg-red-500"
			toolTipTitle={toolTipTitle}
			onButtonClick={onButtonClick}
			loading={loading}
		>
			<TiTrash size="15px" color="#fff" />
		</ActionButton>
	);
}
