"use server";
import { patch } from "@/api/ApiClient";

export async function updatePaymentAction(id: any, payload: any): Promise<any> {
	try {
		let response: any = await patch<any>(`v1/appointment/payment/${id}`, payload);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
