import { ToastType, key, helper } from "./Types";
import { useCookies } from "next-client-cookies";

export const useToast = (type?: ToastType) => {
	const toast = helper.decode(useCookies().get(key));
	return type ? helper.validateType(toast, type) : toast;
};

export const useErrorToast = () => {
	return useToast(ToastType.error);
};

export const useSuccessToast = () => {
	return useToast(ToastType.success);
};
