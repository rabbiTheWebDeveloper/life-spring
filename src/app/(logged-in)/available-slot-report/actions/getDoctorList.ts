"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorList(doctorName: any, branchId?: number): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/doctor?inactiveForAppointment=false${doctorName ? `&name=${doctorName}` : ""}${
				typeof branchId === "number" ? `&branchId=${branchId}` : ""
			}&size=100&sort=name:asc`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get doctor schedule");
	}
}
