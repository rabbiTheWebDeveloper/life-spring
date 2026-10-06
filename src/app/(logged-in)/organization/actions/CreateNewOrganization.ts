"use server";
import { post } from "@/api/ApiClient";

export async function createNewOrganization(body: any): Promise<any> {
	try {
		let response: any = await post(`v1/organization`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create organization");
	}
}
