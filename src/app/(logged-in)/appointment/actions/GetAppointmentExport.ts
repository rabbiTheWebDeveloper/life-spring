"use server";
import { get, post } from "@/api/ApiClient";

export async function getAppointmentList(
	page: any,
	status: any,
	search: any,
	fromCount: any,
	toCount: any,
	paymentStatus: any,
	appointmentType: any,
	branch: any,
	doctorId: any,
	appointmentId: any,
	criteria: any,
	createdByType: any,
	createdById: any,
	sortBy: any,
	orderBy: any
): Promise<any> {
	console.log(`${sortBy && orderBy ? `&sort=${sortBy}:${orderBy}` : ""}`);
	try {
		return await get<any>(
			`v2/appointment/export?format=xlsx${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}${
				fromCount && toCount ? `&from=${fromCount}&to=${toCount}` : ""
			}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ""}${
				appointmentType ? `&appointmentType=${appointmentType}` : ""
			}${branch ? `&branchId=${branch}` : ""}${doctorId ? `&doctorId=${doctorId}` : ""}${
				appointmentId ? `&id=${appointmentId}` : ""
			}${criteria ? `&criteria=${criteria}` : ""}${createdByType ? `&createdByType=${createdByType}` : ""}${
				createdById ? `&createdById=${createdById}` : ""
			}${sortBy && orderBy ? `&sort=${sortBy}:${orderBy}` : "sort=createdAt:desc"}`
		);
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get appointment list");
	}
}

export async function appointmentManualPayment(body: any): Promise<any> {
	let response: any = await post(`v1/payment-gateway/manual-payment`, body);
	return response || {};
}
