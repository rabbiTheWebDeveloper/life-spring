"use server";
import { patch } from "@/api/ApiClient";

export async function updateExistingBranch(id: any, body: any): Promise<any> {
	try {
		let response: any = await patch(`v1/branch/${id}`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create branch");
	}
}
