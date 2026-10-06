"use server";
import { post } from "@/api/ApiClient";

export async function postManualPayment(body: any): Promise<any> {
	try {
		let response: any = await post<any>(`v1/payment-gateway/manual-payment`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
