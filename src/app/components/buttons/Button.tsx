import { Tooltip } from "antd";

export default function Button({ onButtonClick, children, tooltipTitle }: any) {
	return (
		<Tooltip placement="left" title={tooltipTitle} color={"#2db7f5"}>
			<button
				className="bg-primary-400 flex items-center justify-center rounded-md px-2.5 py-1.5 cursor-pointer text-white"
				onClick={onButtonClick}
			>
				{children}
			</button>
		</Tooltip>
	);
}
