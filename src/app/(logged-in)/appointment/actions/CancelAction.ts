"use server";

import { patch } from "@/api/ApiClient";

export default async function cancelAppointment(id: any, payload: any): Promise<any> {
	const res = await patch(`v1/appointment/${id}/cancel`, payload);

	return res;
}
