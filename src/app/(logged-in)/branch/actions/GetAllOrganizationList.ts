"use server";
import { get } from "@/api/ApiClient";

export async function getAllOrganizationList(): Promise<any> {
	try {
		let response: any = await get<any>(`v1/organization?sort=createdAt:desc&page=0&size=10`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
