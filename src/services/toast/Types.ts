import { Duration } from "@/helper/DateHelper";

export const key = "toast-message";

export enum ToastType {
	error = "error",
	success = "success",
}

export interface ToastOptions {
	type: ToastType;
	text: string;
	hidable?: boolean;
	autoHide?: boolean;
	duration?: Duration<number>;
}

export const helper = {
	decode: (t: string | undefined): ToastOptions | undefined => {
		if (t === undefined) return undefined;
		return JSON.parse(t);
	},
	encode: (data: ToastOptions) => JSON.stringify(data),
	validateType: (t: ToastOptions | undefined, type: ToastType) => {
		if (t === undefined) return undefined;
		return t.type === type ? t : undefined;
	},
};
