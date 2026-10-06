"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorList(page: any): Promise<any> {
	try {
		let response: any = await get<any>(`v1/doctor?page=${page}&size=99`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
