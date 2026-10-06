"use server";
import { get } from "@/api/ApiClient";

// Server-side search instead of pulling the whole staff table. The old version
// asked for a fixed `size=99`, which silently dropped every user past the 99th
// row -- the executive simply never appeared in the dropdown and nothing failed
// loudly. The caller sends what the user typed; the backend matches it against
// firstName / lastName / nickName.
export async function getExecutiveList(search?: string): Promise<any> {
	try {
		const params = new URLSearchParams({
			page: "0",
			size: "20",
			sort: "firstName:asc",
			// Deactivated staff should not be assignable. The currently selected
			// executive is seeded from the appointment itself, so an appointment
			// held by a since-deactivated user still shows their name.
			filter: "isActive:eq:1",
		});

		if (search) params.set("name", search);

		let response: any = await get<any>(`v1/user?${params.toString()}`);
		return response;
	} catch (e: any) {
		throw new Error(e?.message || "Failed to get executive list");
	}
}
