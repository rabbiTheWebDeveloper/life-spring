"use server";
import { get, patch, post } from "@/api/ApiClient";




export async function getAppointmentDetails(id:any): Promise<any> {
	try {
		let response: any = await get(`v1/appointment/${id}`);
		return response || {};
	} catch (e) {
	} finally {
	}
}

export async function rescheduleAppointment(paylaod: any,id:any): Promise<any> {
	try {
		let response: any = await patch(`v1/appointment/${id}/reschedule`, paylaod);
		return response || {};
	} catch (e) {
	} finally {
	}
}
