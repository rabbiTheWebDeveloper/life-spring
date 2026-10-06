"use server";
import { get } from "@/api/ApiClient";

export async function getRoleList(page: any, size: any, type: any, search: any): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/roles/paginated?sort=createdAt:desc&page=${page}&size=${size}&type=${type}&name=${search}`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get area list");
	}
}
