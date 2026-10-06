"use server";

import { cookies } from "next/headers";

export async function deleteDoctorSchedule(
	doctorId: string,
	payload: {
		startDate: string;
		endDate: string;
	}
) {
	try {
		const token = cookies().get("accessToken")?.value;

		const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}v1/doctor/schedules/${doctorId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(payload),
			cache: "no-store",
		});

		const data = await res.json();

		if (!res.ok) {
			return {
				success: false,
				message: data?.message || "Failed to delete doctor schedule",
			};
		}

		return {
			success: true,
			message: data?.message || "Doctor schedule deleted successfully",
			data: data?.data,
		};
	} catch (error) {
		console.error("deleteDoctorSchedule error:", error);
		return {
			success: false,
			message: "Something went wrong while deleting schedule",
		};
	}
}
