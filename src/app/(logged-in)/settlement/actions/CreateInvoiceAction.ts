"use server";

import { post } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { DefaultFormActionResult } from "@/app/components/types/Form";
import { Toast } from "@/services/toast/Server";
import { redirect } from "next/navigation";

export default async function createInvoice(
	_: DefaultFormActionResult,
	formData: FormData
): Promise<DefaultFormActionResult> {
	let success = false;

	const doctorId = Number(formData.get("doctorId"));
	const appointmentIds = JSON.parse(formData.get("appointmentIds") as string);

	try {
		await post(`v1/appointment/doctor/${doctorId}/request-disbursements`, {
			appointmentIds: appointmentIds,
		});
		success = true;
	} catch (e) {
		if (e instanceof HttpError) {
			Toast.error(e.message);
			return { error: e.message, success: undefined };
		}
		throw e;
	} finally {
		if (success) {
			Toast.success(`Invoice created successfully`);
			redirect(`/invoice`);
		}
	}

	return { error: undefined, success: `Invoice created successfully` };
}
