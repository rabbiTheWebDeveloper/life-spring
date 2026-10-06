"use server";
import { post } from "@/api/ApiClient";

export async function applyDiscount(body: any): Promise<any> {
	let response: any = await post<any>(`v1/payment-gateway/apply-discount`, body);
	return response;
}
