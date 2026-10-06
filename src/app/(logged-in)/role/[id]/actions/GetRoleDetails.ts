"use server";
import { get } from "@/api/ApiClient";

export async function getRoleDetails(id: any): Promise<any> {
	try {
		let response: any = await get<any>(`v1/roles/${id}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get area list");
	}
}
