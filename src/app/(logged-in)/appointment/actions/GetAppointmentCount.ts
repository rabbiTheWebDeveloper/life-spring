"use server";
import { get } from "@/api/ApiClient";

export async function getAppointmentCount(
	fromCount: any,
	toCount: any,
	statusCount: any,
	channel: any,
	paymentStatusCount: any,
	appointmentType: any,
	fromEmergencyRequest: any,
	hasPackage: any
): Promise<any> {
	try {
		let response: any = await get<any>(
			`v1/appointment/stats/count?${fromCount ? `&from=${fromCount}` : ""}${toCount ? `&to=${toCount}` : ""}${
				statusCount ? `&status=${statusCount}` : ""
			}${channel ? `&channel=${channel}` : ""}${paymentStatusCount ? `&paymentStatus=${paymentStatusCount}` : ""}${
				appointmentType ? `&appointmentType=${appointmentType}` : ""
			}${fromEmergencyRequest ? `&fromEmergencyRequest=${fromEmergencyRequest}` : ""}${
				hasPackage ? `&hasPackage=${hasPackage}` : ""
			}`
		);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get appointment count");
	}
}
