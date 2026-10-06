import { Duration } from "@/helper/DateHelper";
import Alert from "./Alert";

interface Props {
	success: string;
	autoHide?: boolean;
	time?: Duration<number>;
}

export default function SuccessAlert({ success, autoHide, time }: Props) {
	return (
		<Alert
			image="/success.svg"
			title={success}
			className="text-white bg-green-700 font-semibold"
			autoHide={autoHide}
			time={time}
		/>
	);
}
