import { FaRegCalendarPlus } from "react-icons/fa";
import ActionButton from "./ActionButton";

export default function CreateScheduleActionButton({
	rolePermissionTag,
	onButtonClick,
	toolTipTitle = "Create Doctor Schedule",
	loading,
}: any) {
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
			<FaRegCalendarPlus size="15px" color="#fff" />
		</ActionButton>
	);
}
