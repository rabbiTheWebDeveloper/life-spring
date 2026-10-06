"use server";
import { get } from "@/api/ApiClient";

export async function getUserDetails(id: any): Promise<any> {
	try {
		let response: any = await get<any>(`v1/user/${id}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get user details");
	}
}
