"use server";

import { patch } from "@/api/ApiClient";

export async function UpdateProfile(id: any, paylaod: any): Promise<any> {
	try {
		let response: any = await patch(`v1/user/${id}`, paylaod);
		return response || {};
	} catch (e) {
	} finally {
	}
}
