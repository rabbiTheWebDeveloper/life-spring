"use server";
import { get, patch, post } from "@/api/ApiClient";

export async function getPaymentMethods(): Promise<any> {
	try {
		const response: any = await get<any>(`v1/payment-method`);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to fetch Payment Method list");
	}
}

export async function createPaymentMethod(body: any): Promise<any> {
	try {
		const response: any = await post(`v1/payment-method`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create Payment Method");
	}
}

export async function updatePaymentMethod(id: any, body: any): Promise<any> {
	try {
		const response: any = await patch(`v1/payment-method/${id}`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.data?.message || "Failed to update Payment Method");
	}
}
