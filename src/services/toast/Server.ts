import { cookies } from "next/headers";
import { ToastOptions, ToastType, key, helper } from "./Types";
import { addDurationToNow } from "@/helper/DateHelper";

function set(options: ToastOptions) {
	const defaultTime = { second: 5 };

	const op = { ...options };
	op.hidable = op.hidable === undefined ? false : op.hidable;
	op.autoHide = op.autoHide === undefined ? true : op.autoHide;
	op.duration = !op.autoHide ? undefined : op.duration ?? defaultTime;

	cookies().set(key, helper.encode(op), {
		expires: addDurationToNow(defaultTime),
	});
}

function buildOption(type: ToastType, content: Omit<ToastOptions, "type"> | string) {
	const option = typeof content === "string" ? { text: content } : { ...content };
	return { type, ...option };
}

function setError(options: Omit<ToastOptions, "type">): void;
function setError(text: string): void;

function setError(error: Omit<ToastOptions, "type"> | string): void {
	set(buildOption(ToastType.error, error));
}

function setSuccess(options: Omit<ToastOptions, "type">): void;
function setSuccess(text: string): void;

function setSuccess(success: Omit<ToastOptions, "type"> | string): void {
	set(buildOption(ToastType.success, success));
}

function get(): ToastOptions | undefined {
	return helper.decode(cookies().get(key)?.value);
}

function getByType(type: ToastType): ToastOptions | undefined {
	return helper.validateType(get(), type);
}

function getError(): ToastOptions | undefined {
	return getByType(ToastType.error);
}

function getSuccess(): ToastOptions | undefined {
	return getByType(ToastType.success);
}

const hasError = () => getError() !== undefined;
const hasSuccess = () => getSuccess() !== undefined;
const has = () => hasSuccess() || hasError();

export const errorToasts = {
	set: setError,
	has: hasError,
	get: getError,
};

export const successToasts = {
	set: setSuccess,
	has: hasSuccess,
	get: getSuccess,
};

const ToastManager = {
	error: errorToasts,
	success: successToasts,
	get,
	has,
	clear: () => {
		cookies().delete(key);
	},
};

export const Toast = {
	error: ToastManager.error.set,
	success: ToastManager.success.set,
};

export default ToastManager;
