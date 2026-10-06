"use server";
import { get } from "@/api/ApiClient";

export async function getDashboardStats(): Promise<any> {
	try {
		let response: any = await get<any>(`/v1/statistics/summary`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}

export async function getPaymentStats(): Promise<any> {
	try {
		let response: any = await get<any>(`/v1/statistics/payment-summary`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
export async function getCountStats(): Promise<any> {
	try {
		let response: any = await get<any>(`/v1/statistics/count-summary`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
