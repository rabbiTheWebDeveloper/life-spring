"use server";

import { get } from "@/api/ApiClient";
import { emptyOptions, Options } from "@/app/types/Options";

// One call, one tiny query on the backend: no cache layer. Goes through the
// shared client like every other action, so auth and token refresh behave the
// same. On failure the lists stay empty; there is no hard-coded copy to fall
// back to, by design.
export async function getOptions(): Promise<Options> {
	try {
		const res: any = await get<any>("v1/meta/options");
		if (!res?.success || !res?.data) throw new Error(res?.message || "Failed to Fetch Dropdown Options");
		return { ...emptyOptions, ...res.data };
	} catch (error: any) {
		console.error("Failed to Fetch Dropdown Options");
		return emptyOptions;
	}
}
