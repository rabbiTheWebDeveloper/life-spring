import { DefaultFormActionResult } from "@/app/components/types/Form";

export type CreateDoctorActionFn = (_: DefaultFormActionResult, formData: FormData) => Promise<DefaultFormActionResult>;
export type CreateActionFn = (_: DefaultFormActionResult, formData: FormData) => Promise<DefaultFormActionResult>;

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
	bmdcCode: string;
	password: string;
	experience: number;
	email: string;
	mobile: string;
	degrees: string;
	start: string;
	end: string;
	workDays: string[];
	fee: number;
	biography: string;
	specialtyId: number;
	isCoach: string;
}

export type FormKey = keyof FormValues;

export type FormErrors = {
	[P in FormKey]: boolean;
};
