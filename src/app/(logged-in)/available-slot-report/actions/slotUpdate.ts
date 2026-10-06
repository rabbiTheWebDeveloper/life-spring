"use server";
import { patch } from "@/api/ApiClient";

export async function slotUpdate(slotId: any, payload: any): Promise<any> {
	try {
		let response: any = await patch<any>(`/v1/doctor/slot/${slotId}`, payload);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get doctor schedule");
	}
}
