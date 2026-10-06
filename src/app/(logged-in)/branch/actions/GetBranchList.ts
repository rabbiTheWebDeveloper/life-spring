"use server";
import { get } from "@/api/ApiClient";

export async function getBranchList(page: any, search: any, size = 10): Promise<any> {
	try {
		let response: any = await get<any>(`v1/branch?page=${page}&size=${size}&name=${search}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
