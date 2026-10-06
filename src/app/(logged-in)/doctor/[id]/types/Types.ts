import { DefaultFormActionResult } from "@/app/components/types/Form";

export type ChangeStatusActionFn = (
	_: DefaultFormActionResult,
	formData: FormData
) => Promise<DefaultFormActionResult>;

export interface FormValues {
	doctorId: number;
	status: number;
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};

export interface FormState extends DefaultFormActionResult {
	id: number;
}
