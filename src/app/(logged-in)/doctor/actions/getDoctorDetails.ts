"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorDetails(id: any): Promise<any> {
	try {
		// Feeds the branch-update modal, which needs the doctor's branches - not
		// the (very large) schedules collection.
		let response: any = await get<any>(`v1/doctor/${id}?includeSchedules=false`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
