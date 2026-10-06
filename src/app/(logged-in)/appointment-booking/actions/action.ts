"use server";
import { get } from "@/api/ApiClient";

export async function getDoctorScheduleTimeSlot(doctorId: any, branchId: any, date: any): Promise<any> {
	let response: any = await get(`v1/appointment/availability?doctorId=${doctorId}&date=${date}&branchId=${branchId}`);
	return response;
}
