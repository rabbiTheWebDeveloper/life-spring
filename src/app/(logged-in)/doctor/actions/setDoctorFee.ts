"use server";
import { patch } from "@/api/ApiClient";

export async function setDoctorFee(id: any, fee: number): Promise<{ success: boolean; message?: string }> {
	try {
		const res: any = await patch<any>(`v1/doctor/${id}/fee`, { fee });
		return res?.success ? { success: true } : { success: false, message: String(res?.message || "Failed to update the default fee") };
	} catch (e: any) {
		return { success: false, message: e?.message || "Failed to update the default fee" };
	}
}
