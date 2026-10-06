"use server";
import { get } from "@/api/ApiClient";

export async function getRefundReport(
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
	createdById: any
): Promise<any> {
	let response: any = await get<any>(
		`v1/appointment/refund?page=${page}${status ? `&status=${status}` : ""}${search ? `&search=${search}` : ""}${
			fromCount && toCount ? `&from=${fromCount}&to=${toCount}` : ""
		}${paymentStatus ? `&paymentStatus=${paymentStatus}` : ""}${
			appointmentType ? `&appointmentType=${appointmentType}` : ""
		}${branch ? `&branchId=${branch}` : ""}${doctorId ? `&doctorId=${doctorId}` : ""}${
			appointmentId ? `&id=${appointmentId}` : ""
		}${criteria ? `&criteria=${criteria}` : ""}${createdByType ? `&createdByType=${createdByType}` : ""}${
			createdById ? `&createdById=${createdById}` : ""
		}`
	);
	return response;
}
