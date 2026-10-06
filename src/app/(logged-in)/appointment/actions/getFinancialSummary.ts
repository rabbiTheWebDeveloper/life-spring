"use server";
import { get } from "@/api/ApiClient";

export async function getFinancialSummary(): Promise<any> {
	try {
		let response: any = await get<any>(`/v1/statistics/payment-summary`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
