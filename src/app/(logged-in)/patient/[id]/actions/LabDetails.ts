"use server";

export default async function labDetails(number: string, limit: any = 10, offset: any = 0): Promise<any> {
	let success = false;
	const partnerId = process.env.AMARLAB_PARTNER_ID;
	let details: any = [];
	try {
		let respoonse = await fetch(
			`https://api.amarlab.com/user_management/user-token?partner_id=${partnerId}&username=${number}`,
			{
				headers: {
					"Content-Type": "application/json",
				},
			}
		).then((res) => {
			return res.json();
		});
		success = true;

		if (respoonse?.user_id) {
			details = await fetch(
				`https://api.amarlab.com/order/order-tree-prod?partner_id=${partnerId}&user=${respoonse?.user_id}&limit=${limit}&offset=${offset}`,
				{
					headers: {
						"Content-Type": "application/json",
					},
				}
			).then((res) => {
				return res.json();
			});
		}
		return details;
	} catch (e) {
	} finally {
	}
}
