"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorList(page: any, doctorName?: string): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/doctor?page=${page}&size=99&inactiveForAppointment=false${doctorName ? `&name=${doctorName}` : ""}`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Doctor list");
	}
}
