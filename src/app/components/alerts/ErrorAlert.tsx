import { Duration } from "@/helper/DateHelper";
import Alert from "./Alert";

interface Props {
	error: string;
	autoHide?: boolean;
	time?: Duration<number>;
}

export default function ErrorAlert({ error, autoHide, time }: Props) {
	return (
		<Alert
			image="/error.png"
			title={error}
			className="text-red-500 bg-red-100"
			autoHide={autoHide}
			time={time}
		/>
	);
}
