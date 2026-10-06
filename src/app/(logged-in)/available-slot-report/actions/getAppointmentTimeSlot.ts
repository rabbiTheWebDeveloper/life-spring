"use server";
import { get } from "@/api/ApiClient";

export async function getAppointmentWithTimeSlot(
	doctorId: any,
	branchId: any,
	startDate: any,
	endDate: any,
	startTime: any,
	endTime: any
): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/appointment/availability?${doctorId ? `&doctorId=${doctorId}` : ""}${
				branchId ? `&branchId=${branchId}` : ""
			}${startDate ? `&startDate=${startDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}${
				startTime ? `&startTime=${startTime}` : ""
			}${endTime ? `&endTime=${endTime}` : ""}`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get doctor schedule");
	}
}
