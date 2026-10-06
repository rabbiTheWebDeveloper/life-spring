"use server";
import { get } from "@/api/ApiClient";

export async function getAllPackages(): Promise<any> {
	let response: any = await get(`v1/package`);
	return response;
}
