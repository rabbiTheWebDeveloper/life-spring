"use server";
import { get } from "@/api/ApiClient";

export async function getCountryList(): Promise<any> {
	let response: any = await get<any>(`country`);
	return response;
}

export async function getDistrictList(): Promise<any> {
	let response: any = await get<any>(`country/districts`);
	console.log(response);
	return response;
}
