"use server";
import { patch } from "@/api/ApiClient";

export async function updateDoctorBranch(id: any, payload: any): Promise<any> {
	try {
		let response: any = await patch<any>(`v1/doctor/${id}/branches`, payload);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
export async function updateDoctor(id: any, payload: any): Promise<any> {
	try {
		let response: any = await patch<any>(`v1/doctor/${id}`, payload);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
