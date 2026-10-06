"use server";

import { post } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { DefaultFormActionResult } from "@/app/components/types/Form";
import { Toast } from "@/services/toast/Server";
import { redirect } from "next/navigation";

export default async function createDisbursement(
	_: DefaultFormActionResult,
	formData: FormData
): Promise<DefaultFormActionResult> {
	let success = false;

	const invoiceId = Number(formData.get("invoiceId"));

	try {
		await post(`v1/transaction/invoices/${invoiceId}/disburse`, {
			refNo: formData.get("refNo"),
			paymentMethod: formData.get("paymentMethod"),
			attachment: formData.get("attachment") as File,
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
			Toast.success(`Disbursement created successfully`);
			redirect(`/invoice/${invoiceId}`);
		}
	}

	return { error: undefined, success: `Disbursement created successfully` };
}
