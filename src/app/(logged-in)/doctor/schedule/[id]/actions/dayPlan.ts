"use server";
import { get, put } from "@/api/ApiClient";

type Result = { success: true; data: any } | { success: false; status?: number; message: string };

// ApiClient returns 4xx JSON bodies instead of throwing; prod redacts thrown action errors.
const toResult = (res: any, fallback: string): Result =>
	res?.success
		? { success: true, data: res.data }
		: { success: false, status: res?.statusCode, message: String(res?.message || fallback) };

export async function getDayPlan(doctorId: any, branchId: any, startDate: string, endDate: string): Promise<Result> {
	try {
		const res = await get<any>(
			`v1/doctor/${doctorId}/day-plan?branchId=${branchId}&startDate=${startDate}&endDate=${endDate}`
		);
		return toResult(res, "Failed to load the day plan");
	} catch (e: any) {
		return { success: false, message: e?.message || "Failed to load the day plan" };
	}
}

export async function saveDayPlan(doctorId: any, body: any): Promise<Result> {
	try {
		const res = await put<any>(`v1/doctor/${doctorId}/day-plan`, body);
		return toResult(res, "Failed to save the day plan");
	} catch (e: any) {
		return { success: false, message: e?.message || "Failed to save the day plan" };
	}
}
