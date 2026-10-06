import { DefaultFormActionResult } from "@/app/components/types/Form";

export interface FormValues {
	email: string;
	password: string;
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};

export type LoginActionFn = (
	_: DefaultFormActionResult,
	formData: FormData
) => Promise<DefaultFormActionResult>;
