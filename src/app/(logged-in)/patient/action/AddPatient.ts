"use server";
import { get, patch, post } from "@/api/ApiClient";
import { TokenManager } from "@/api/TokenManager";

export async function addPatient(body: any): Promise<any> {
	try {
		let response: any = await post(`v1/patient/create`, body);
		return response || {};
	} catch (e) {
	} finally {
	}
}
export async function updatePatient(body: any, id: any): Promise<any> {
	try {
		let response: any = await patch(`v1/patient/${id}`, body);
		console.log("response", response);
		return response || {};
	} catch (e) {
	} finally {
	}
}

export async function getPatientData(page: any, search: any, isActive: any): Promise<any> {
	try {
		let response: any = await get(
			`v1/patient?size=10&page=${page}&sort=id:desc${search ? `&search=${search}` : ""}${
				isActive ? `&isActive=${isActive}` : ""
			}`
		);
		return response || {};
	} catch (e) {
	} finally {
	}
}

export async function exportPatientFile(format = "xlsx", page = 0, size = 10): Promise<Blob | null> {
	try {
		const token = await TokenManager.getAccessToken();
		const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

		const url = `${baseUrl}v1/patient/export?format=${format}&page=${page}&size=${size}`;
		const res = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		if (!res.ok) {
			console.error("Export failed:", await res.text());
			return null;
		}

		const blob = await res.blob();
		return blob;
	} catch (error) {
		console.error("Export error:", error);
		return null;
	}
}

export async function getTokens() {
	const token = await TokenManager.getAccessToken();
	return token;
}
