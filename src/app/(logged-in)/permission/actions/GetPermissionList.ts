"use server";
import { get } from "@/api/ApiClient";

export async function getPermissionList(page: any, size: any, type: any, search: any): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/roles/permissions?page=${page}&size=${size}&type=${"lifespring"}&tag=${search}`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get area list");
	}
}
