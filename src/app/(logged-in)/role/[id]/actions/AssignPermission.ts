"use server";
import { patch } from "@/api/ApiClient";

export async function assignPermission(id: any, body: any): Promise<any> {
	try {
		let response: any = await patch(`v1/roles/${id}`, body);
		return response;
	} catch (e: any) {
		throw new Error(e?.response?.message || "Failed to create Permission");
	}
}
