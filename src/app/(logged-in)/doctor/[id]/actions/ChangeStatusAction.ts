"use server";

import { patch } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { DefaultFormActionResult } from "@/app/components/types/Form";
import { Toast } from "@/services/toast/Server";
import { redirect } from "next/navigation";

export default async function changeStatus(
	_: DefaultFormActionResult,
	formData: FormData
): Promise<DefaultFormActionResult> {
	let success = false;
	const status = formData.get("status");
	const id = formData.get("doctorId");

	try {
		await patch(`v1/doctor/${id}/manage?active=${status}`, {});
		success = true;
	} catch (e) {
		if (e instanceof HttpError) {
			Toast.error(e.message);
			return { error: e.message, success: undefined };
		}
		throw e;
	} finally {
		if (success) {
			Toast.success(`Status updated successfully`);
			redirect(`/doctor/${id}`);
		}
	}

	return { error: undefined, success: `Status updated successfully` };
}
