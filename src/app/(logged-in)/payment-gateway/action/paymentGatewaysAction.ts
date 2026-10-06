"use server";
import { del, get, patch, post } from "@/api/ApiClient";

export async function getPaymentGatewayList(): Promise<any> {
	try {
		let response: any = await get<any>(`v1/payment-gateway`);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create medicine");
	}
}

export async function addPaymentGateway(body: any): Promise<any> {
	try {
		let response: any = await post(`v1/payment-gateway`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create Payment Gateway");
	}
}

export async function updatePaymentGateway(body: any, id: any): Promise<any> {
	try {
		const response: any = await patch(`v1/payment-gateway/${id}`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.data?.message || "Failed to update Payment Gateway");
	}
}

export async function deletePaymentGateway(id: any): Promise<any> {
	try {
		const response: any = await del(`v1/payment-gateway/${id}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to delete  Payment Gateway");
	}
}
