"use server";
import { get, post } from "@/api/ApiClient";

export async function createAppointmentBooking(paylaod: any): Promise<any> {
	try {
		let response: any = await post(`v1/appointment`, paylaod);
		console.log("resss", response);
		return response || {};
	} catch (e) {
	} finally {
	}
}
export async function getPatientInformation(id: any): Promise<any> {
	try {
		let response: any = await get(`v1/patient/${id}`);
		return response || {};
	} catch (e) {
	} finally {
	}
}

export async function getService(size: any, page: any, specialty: any, name: any): Promise<any> {
	try {
		let response: any = await get(
			`v1/doctor?size=${size}&page=${page}${name ? `&name=${name}` : ""}${specialty ? `&specialty=${specialty}` : ""}`
		);
		return response || {};
	} catch (e) {
	} finally {
	}
}

export async function getDoctorSpeciality(): Promise<any> {
	try {
		let response: any = await get(`v1/doctor/specialties`);
		return response || {};
	} catch (e) {
	} finally {
	}
}

export async function getDoctorDetails(id: any): Promise<any> {
	try {
		let response: any = await get(`v1/doctor/${id}`);
		return response || {};
	} catch (e) {}
}

export async function getDoctorSchedule(doctorId: any, branchId: any, startDate: any, endDate: any): Promise<any> {
	try {
		let response: any = await get(
			`v1/doctor/${doctorId}/schedules?startDate=${startDate}&endDate=${endDate}&branchId=${branchId}`
		);
		return response || {};
	} catch (e) {
		console.error(e);
	} finally {
		// Any cleanup if necessary
	}
}

export async function getDoctorSchedules(doctorID: any, date: any): Promise<any> {
	try {
		let response: any = await get(`v1/appointment/doctor/${doctorID}/schedule?date=${date}`);
		return response || {};
	} catch (e) {
		console.error(e);
	} finally {
		// Any cleanup if necessary
	}
}

export async function patientByPhone(search: any): Promise<any> {
	console.log(search);
	try {
		let url = `v1/patient/identifier/${search}`;
		let response: any = await get(url);
		console.log(response);
		return response || {};
	} catch (e) {
		return {};
	}
}
