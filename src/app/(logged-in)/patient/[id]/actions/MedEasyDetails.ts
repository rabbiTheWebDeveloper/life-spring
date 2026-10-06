"use server";

export default async function medEasyDetails(patient: any, limit: any = 10, offset: any = 0): Promise<any> {
	let success = false;
	const partnerId = process.env.MEDEASY_PARTNER_TOKEN;
	const baseUrl = process.env.MEDEASY_BASE_URL;
	let details: any = [];
	let postUrl = "v2/grameen-digital-users/register/";
	let orderUrl = "patient/medicine-orders/";

	try {
		//
		let response = await fetch(`${baseUrl}${postUrl}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${partnerId}`,
			},
			body: JSON.stringify(patient),
		}).then((res) => {
			return res.json();
		});
		success = true;
		if (response?.token) {
			details = await fetch(`${baseUrl}${orderUrl}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${response?.token}`,
				},
			}).then((res) => {
				return res.json();
			});
		}
		return details;
	} catch (e) {
	} finally {
	}
}
