"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorRev(page: any, startDate: any, endDate: any, doctorId: any): Promise<any> {
	let response: any = await get<any>(
		`v1/appointment/doctors/revenue?page=${page}${startDate ? `&from=${startDate}` : ""}${
			endDate ? `&to=${endDate}` : ""
		}${doctorId ? `&doctorId=${doctorId}` : ""}`
	);
	return response;
}
