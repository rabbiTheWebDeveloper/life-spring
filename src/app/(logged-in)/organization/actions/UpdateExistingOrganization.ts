"use server";
import { patch } from "@/api/ApiClient";

export async function updateExistingOrganization(id: any, body: any): Promise<any> {
	try {
		let response: any = await patch(`v1/organization/${id}`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create organization");
	}
}
