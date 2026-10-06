"use server";
import { get } from "@/api/ApiClient";

export async function getPaymentReport(
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
	transactionId: any,
	paymentMethod: any,
	isMigrated: any,
	paymentFrom?: any,
	paymentTo?: any,
	// The backend defaults to 10 and rejects anything above 100.
	size: number = 100
): Promise<any> {
	let response: any = await get<any>(
		`v1/appointment/payment-report?page=${page}&size=${size}${status ? `&status=${status}` : ""}${
			search ? `&search=${search}` : ""
		}${fromCount && toCount ? `&from=${fromCount}&to=${toCount}` : ""}${
			paymentStatus ? `&paymentStatus=${paymentStatus}` : ""
		}${appointmentType ? `&appointmentType=${appointmentType}` : ""}${branch ? `&branchId=${branch}` : ""}${
			doctorId ? `&doctorId=${doctorId}` : ""
		}${appointmentId ? `&id=${appointmentId}` : ""}${criteria ? `&criteria=${criteria}` : ""}${
			createdByType ? `&createdByType=${createdByType}` : ""
		}${createdById ? `&createdById=${createdById}` : ""}${transactionId ? `&transactionId=${transactionId}` : ""}${
			paymentMethod ? `&paymentMethod=${paymentMethod}` : ""
		}${isMigrated === "true" ? "&isMigrated=true" : isMigrated === "false" ? "&isMigrated=false" : ""}${
			paymentFrom && paymentTo ? `&paymentFrom=${paymentFrom}&paymentTo=${paymentTo}` : ""
		}`
	);
	return response;
}
