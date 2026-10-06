"use server";
import { get } from "@/api/ApiClient";

export async function getBranchList(): Promise<any> {
	try {
		let response: any = await get<any>(`v1/branch/all`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
