"use server";
import { patch } from "@/api/ApiClient";

export async function updateVat(body: any, id: any): Promise<any> {
	let response: any = await patch<any>(`v1/transaction/vat-percentage/${id}`, body);
	return response;
}
