"use server";
import { get } from "@/api/ApiClient";

export async function exportInvoice(id: any, isCurrencyUSD: boolean = false): Promise<any> {
	try {
		let response: any = await get<any>(`v1/appointment/${isCurrencyUSD ? "invoice-usd" : "invoice"}/${id}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get export invoice");
	}
}
