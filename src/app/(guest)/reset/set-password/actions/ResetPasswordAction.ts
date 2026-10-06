"use server";

import { post } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { DefaultFormActionResult } from "@/app/components/types/Form";
import checkPasswordStrength from "@/services/PasswordStrengthChecker";
import { Toast } from "@/services/toast/Server";
import { redirect } from "next/navigation";

export default async function resetPassword(r: DefaultFormActionResult, formData: FormData) {
	let passwordError = checkPasswordStrength(formData.get("password") as string);
	if (passwordError) {
		return { error: passwordError, success: undefined };
	}

	let success = false;

	try {
		await post("v1/auth/reset/password", {
			token: formData.get("token"),
			password: formData.get("password"),
		});
		success = true;
	} catch (e) {
		if (e instanceof HttpError) {
			return { error: e.message, success: undefined };
		}
		throw e;
	} finally {
		if (success) {
			Toast.success(`Password reset success. Please login.`);
			redirect(`/login`);
		}
	}

	return { error: undefined, success: "Success" };
}
