"use server";

import { post } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { Toast } from "@/services/toast/Server";
import { redirect } from "next/navigation";

export default async function requestRefund(state: any): Promise<any> {
	const { id } = state;
	let success = false;

	try {
		await post(`v1/refunds`, {
			appointmentId: id,
		});
		success = true;
	} catch (e) {
		if (e instanceof HttpError) {
			Toast.error(e.message);
		}
		throw e;
	} finally {
		if (success) {
			Toast.success(`Refund requested successfully`);
			redirect(`/refund`);
		}
	}

	return { id, error: undefined, success: `Refund requested successfully` };
}
