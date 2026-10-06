
// @ts-ignore
import { useFormStatus } from "react-dom";
import LoadingButton from "./LoadingButton";


interface Props {
	text: string;
	cls?: string;
}

export default function SubmitButton({ text, cls }: Props) {
	const { pending } = useFormStatus();

	return (
		<LoadingButton
			isLoading={pending}
			cls={cls}
		>
			{text}
		</LoadingButton>
	);
}
