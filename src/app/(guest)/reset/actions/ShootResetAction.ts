"use server";

import { post } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { DefaultFormActionResult } from "@/app/components/types/Form";

export default async function shootReset(r: DefaultFormActionResult, formData: FormData) {
	try {
		await post("v1/auth/reset/shoot", {
			email: formData.get("email"),
		});
		return { error: undefined, success: formData.get("email") as string };
	} catch (e) {
		if (e instanceof HttpError) {
			return { error: e.message, success: undefined };
		}
		throw e;
	}
}
