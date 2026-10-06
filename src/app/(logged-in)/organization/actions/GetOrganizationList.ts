"use server";
import { get } from "@/api/ApiClient";

export async function getOrganizationList(page: any, search: any): Promise<any> {
	try {
		let response: any = await get<any>(`v1/organization?sort=createdAt:desc&page=${page}&size=10&name=${search}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get organization list");
	}
}
