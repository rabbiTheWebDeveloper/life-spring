"use server";
import { patch } from "@/api/ApiClient";

export async function updateAppointment(id: any, body: any): Promise<any> {
	let response: any = await patch<any>(`v1/appointment/${id}`, body);
	return response;
}
