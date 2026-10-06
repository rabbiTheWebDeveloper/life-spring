import { Switch, Modal } from "antd";

const { confirm } = Modal;

interface Props {
	checked: boolean;
	onConfirm: (value: boolean) => void;
}

export default function DoctorDisableSwitch({ checked, onConfirm }: Props) {
	const handleToggle = (nextValue: boolean) => {
		confirm({
			title: nextValue ? "Enable Doctor" : "Disable Doctor",
			content: nextValue
				? "Are you sure you want to enable this doctor?"
				: "Are you sure you want to disable this doctor?",
			okText: "Yes",
			cancelText: "No",
			onOk() {
				onConfirm(nextValue);
			},
		});
	};

	return <Switch checked={checked} onChange={handleToggle} />;
}
