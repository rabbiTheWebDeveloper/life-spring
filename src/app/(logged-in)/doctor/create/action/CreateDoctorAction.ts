"use server";
import { post } from "@/api/ApiClient";

export async function createDoctorBooking(formData: FormData): Promise<any> {
	try {
		// Extract values from formData
		const experience = Number(formData.get("experience"));
		const fee = Number(formData.get("fee"));
		const commission = Number(formData.get("commission"));
		const specialtyId = Number(formData.get("specialtyId"));
		const organization = Number(formData.get("organization"));
		const timePeriod = Number(formData.get("timePeriod"));

		const mobile = formData.get("mobile") as string;
		const mobileRegex = /^01[3-9]\d{8}$/;
		// if (!mobileRegex.test(mobile)) {
		// 	return { error: "Invalid Bangladeshi mobile number", success: undefined };
		// }

		// Preparing FormData to send
		const formDataToSend = new FormData();
		formDataToSend.append("name", formData.get("name") as string);
		formDataToSend.append("mobile", mobile);
		formDataToSend.append("email", formData.get("email") as string);
		formDataToSend.append("bmdcCode", formData.get("bmdcCode") as string);
		formDataToSend.append("bmdcExpiryDate", formData.get("bmdcExpiryDate") as string);
		formDataToSend.append("specialtyId", String(specialtyId));
		formDataToSend.append("organizationId", String(organization));
		formDataToSend.append("experience", String(experience));
		formDataToSend.append("timePeriod", String(timePeriod));
		formDataToSend.append("degrees", formData.get("degrees") as string);
		formDataToSend.append("working_at", formData.get("working_at") as string);
		formDataToSend.append("fee", String(fee));
		formDataToSend.append("is_self_registration", "1"); // Assuming this is always 1
		formDataToSend.append("is_approved", "1"); // Assuming this is always 1
		formDataToSend.append("commission", String(commission));
		formDataToSend.append("biography", formData.get("biography") as string);
		// Optional YouTube intro video; only sent when the admin actually filled it in.
		const introVideoUrl = (formData.get("introVideoUrl") as string)?.trim();
		if (introVideoUrl) formDataToSend.append("introVideoUrl", introVideoUrl);
		formDataToSend.append("organization", formData.get("organization") as string);
		formDataToSend.append("branchIds", formData.get("branchIds") as any);
		formDataToSend.append("maxFee", formData.get("maxFee") as any);
		formDataToSend.append("minFee", formData.get("minFee") as any);
		const commonSl = formData.get("commonSl");
		const departmentSl = formData.get("departmentSl");
		if (commonSl) formDataToSend.append("common_sl", commonSl as string);
		if (departmentSl) formDataToSend.append("department_sl", departmentSl as string);
		// Append profilePic to the FormData object if it exists
		const profilePic = formData.get("profilePic");
		const signatureUrl = formData.get("signature");
		if (profilePic) {
			formDataToSend.append("profilePic", profilePic as Blob, "profilePic.jpg");
		}
		if (signatureUrl) {
			formDataToSend.append("signature", signatureUrl as Blob, "signature.jpg");
		}

		// Append any files selected by the user
		const files = formData.getAll("files");
		if (files) {
			for (let i = 0; i < files.length; i++) {
				formDataToSend.append("files", files[i] as Blob);
			}
		}

		// Handle bankDetails (assuming it's a JSON object)
		const bankDetails = JSON.parse(formData.get("bankDetails") as string);
		for (let key in bankDetails) {
			formDataToSend.append(`bankDetails[${key}]`, bankDetails[key]);
		}

		let response: any = await post("v1/doctor", formDataToSend);
		return response || {};
	} catch (e) {
		console.error("Error occurred while booking doctor", e);
	} finally {
		// Any necessary cleanup or final actions, if needed
	}
}
