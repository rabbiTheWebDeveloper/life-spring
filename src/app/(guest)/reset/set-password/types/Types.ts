import { DefaultFormActionResult } from "@/app/components/types/Form";

export interface FormValues {
	// token: string;
	password: string;
	confirm: string;
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};

export type ResetActionFn = (_: DefaultFormActionResult, formData: FormData) => Promise<DefaultFormActionResult>;
