"use server";
import { post } from "@/api/ApiClient";

export async function AddSingularPermission(body: any): Promise<any> {
	try {
		let response: any = await post(`v1/permission/add`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to assing new Permission");
	}
}
