"use server";
import { get } from "@/api/ApiClient";
import { TokenManager } from "@/api/TokenManager";

export const getCounters = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;

	if (!baseUrl) {
		console.error("API_BASE_URL is not defined");
		return {
			appointment: 0,
		};
	}

	const accessToken = await TokenManager.getAccessToken();
	const headers = {
		Authorization: `Bearer ${accessToken}`,
	};

	// Helper function to make API requests
	const fetchCounter = async (endpoint: any) => {
		try {
			const res: any = await get(endpoint);

			return res;
		} catch (error) {
			console.error(error);
			return null; // Return null if the fetch fails
		}
	};

	try {
		const endpoints = ["v1/appointment/stats/count?status=scheduled"];

		const [appointmentData] = await Promise.all(endpoints.map((endpoint) => fetchCounter(endpoint)));

		return {
			appointment: appointmentData?.Scheduled || 0,
		};
	} catch (error) {
		console.error("Failed to fetch counters", error);
		return {
			appointment: 0,
		};
	}
};
