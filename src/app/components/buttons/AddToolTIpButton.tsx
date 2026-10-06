import { Tooltip } from "antd";
import { GoPlus } from "react-icons/go";

const CreateTooltipButton = ({ onClickFnc, title,size=25 }:any) => {
	return (
		<div className="flex items-center gap-3">
			<Tooltip placement="left" title={title} color={"#2db7f5"}>
				<div
					className={`bg-primary-400 flex items-center justify-center rounded-md ${size==15 ? 'px-1 py-1':'px-2.5 py-1.5'} cursor-pointer text-white`}
					onClick={onClickFnc}
				>
					<GoPlus size={size} />
				</div>
			</Tooltip>
		</div>
	);
};

export default CreateTooltipButton;
