"use server";
import { get } from "@/api/ApiClient";
import { TokenManager } from "@/api/TokenManager";

export async function rolePermissions(): Promise<any> {
	try {
		const userId = await TokenManager.getUserId() ?? 1;
		console.log("User Id Action: ", userId);
		// if (userId)
			return await get(`v1/user/${userId}`);
	} catch (error) {
		console.error("Error checking role permissions:", error);
		return false;
	}
}
