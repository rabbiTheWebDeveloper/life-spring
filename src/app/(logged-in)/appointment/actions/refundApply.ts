"use server";
import { post } from "@/api/ApiClient";

export async function applyRefund(body: any): Promise<any> {
	let response: any = await post<any>(`/v1/payment-gateway/refund`, body);
	return response;
}
