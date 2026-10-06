"use server";
import { get } from "@/api/ApiClient";

export async function getSpecialityList(): Promise<any> {
	try {
		let response: any = await get<any>("v1/doctor/specialties");
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get Speciality list");
	}
}
