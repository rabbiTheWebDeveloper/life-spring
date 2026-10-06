"use server";
import { get } from "@/api/ApiClient";

export async function getUserList(page: any, search?: any): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/user?sort=updatedAt:desc&page=${page}&size=10${search && `&name=${search}`}`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to fetch user list");
	}
}
