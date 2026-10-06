import { DefaultFormActionResult } from "@/app/components/types/Form";

export type CreateDoctorActionFn = (_: DefaultFormActionResult, formData: FormData) => Promise<DefaultFormActionResult>;

export interface WorkingHours {
	start: string;
	end: string;
}

export interface Speciality {
	id: number;
	name: {
		bn: string;
		en: string;
	};
	value: string;
	icon: string;
}

export interface FormValues {
	name: string;
	userName: string;
	password: string;
	experience: number;
	start: string;
	end: string;
	workDays: string[];
	fee: number;
	biography: string;
	specialtyId: number;
	organizationId?:number
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};

export interface FormState extends DefaultFormActionResult {
	id: number;
}
