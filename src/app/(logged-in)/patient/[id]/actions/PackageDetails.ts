"use server";
import { get } from "@/api/ApiClient";

export async function getPatientPackage(size: any, page: any, id: any): Promise<any> {
	try {
		let response: any = await get(
			`v1/subscription/patient-packages?size=${size}&page=${page}&sort=createdAt:desc&status=active${
				id ? `&patientId=${id}` : ""
			}`
		);
		return response || {};
	} catch (e) {
	} finally {
	}
}
