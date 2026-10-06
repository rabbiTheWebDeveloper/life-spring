import { FaRegCalendarAlt } from "react-icons/fa";
import ActionButton from "./ActionButton";

export default function ViewScheduleActionButton({
	rolePermissionTag,
	onButtonClick,
	toolTipTitle = "View Doctor Schedule",
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
			<FaRegCalendarAlt size="15px" color="#fff" />
		</ActionButton>
	);
}
