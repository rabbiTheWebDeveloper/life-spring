"use server";

import { del, patch } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { Toast } from "@/services/toast/Server";
import { redirect } from "next/navigation";
import { FormState } from "../types/Types";

export default async function updateDoctor(state: FormState, formData: FormData): Promise<FormState> {
	const { id } = state;
	const specialtyId = Number(formData.get("specialty"));
	const organizationId = Number(formData.get("organizationId"));
	const experience = Number(formData.get("experience"));
	const fee = Number(formData.get("fee"));
	const commission = Number(formData.get("commission"));
	const timePeriod = Number(formData.get("timePeriod"));
	let success = false;
	const mobile = formData.get("mobile") as string;
	const mobileRegex = /^01[3-9]\d{8}$/;
	// if (!mobileRegex.test(mobile)) {
	// 	return { id, error: "Invalid Bangladeshi mobile number", success: undefined };
	// }
	const files = formData.getAll("files");
	const formDataToSend = new FormData();
	formDataToSend.append("name", formData.get("name") as string);
	if (!!formData.get("email")) {
		formDataToSend.append("email", formData.get("email") as string);
	}
	formDataToSend.append("degrees", formData.get("degrees") as string);
	formDataToSend.append("bmdcExpiryDate", formData.get("bmdcExpiryDate") as string);
	formDataToSend.append("bmdcCode", formData.get("bmdcCode") as string);
	formDataToSend.append("mobile", mobile);
	formDataToSend.append("specialtyId", String(specialtyId));
	formDataToSend.append("organizationId", String(organizationId));
	formDataToSend.append("experience", String(experience));
	formDataToSend.append("fee", String(fee));
	formDataToSend.append("timePeriod", String(timePeriod));
	formDataToSend.append("working_at", formData.get("working_at") as string);
	formDataToSend.append("maxFee", formData.get("maxFee") as any);
	formDataToSend.append("minFee", formData.get("minFee") as any);
	const commonSl = formData.get("commonSl");
	const departmentSl = formData.get("departmentSl");
	if (commonSl) formDataToSend.append("common_sl", commonSl as string);
	if (departmentSl) formDataToSend.append("department_sl", departmentSl as string);
	const branchIds = formData.get("branch");
	if (branchIds) {
		const parsedBranchIds = JSON.parse(branchIds as string); // this will be [2, 3]
		for (let id of parsedBranchIds) {
			formDataToSend.append("branchIds", String(id)); // append each one
		}
	}

	if (files) {
		for (let i = 0; i < files.length; i++) {
			formDataToSend.append("files", files[i] as Blob);
		}
	}

	formDataToSend.append("commission", String(commission));
	formDataToSend.append("biography", formData.get("biography") as string);

	// Always sent (even empty) so clearing the field removes the video card on the website.
	// The API turns an empty string into null.
	if (formData.has("introVideoUrl")) {
		formDataToSend.append("introVideoUrl", ((formData.get("introVideoUrl") as string) ?? "").trim());
	}

	const profilePic: any = formData.get("profilePic");
	if (profilePic?.size > 0) {
		formDataToSend.append("profilePic", profilePic as Blob, "profilePic.jpg");
	}
	const sign: any = formData.get("signature");
	if (sign?.size > 0) {
		formDataToSend.append("signature", sign as Blob, "signature.jpg");
	}

	const bankDetailsRaw = formData.get("bankDetails");

	if (bankDetailsRaw) {
		const bankDetails = JSON.parse(bankDetailsRaw as string);

		if (bankDetails?.accountNo) {
			Object.entries(bankDetails).forEach(([key, value]) => {
				if (value !== null && value !== undefined && value !== "") {
					formDataToSend.append(`bankDetails[${key}]`, String(value));
				}
			});
		}
	}

	console.log("formDataToSend", JSON.stringify(formDataToSend));

	try {
		const res = await patch(`v1/doctor/${id}`, formDataToSend);
		console.log("update doctor response", res);
		success = true;
	} catch (e) {
		if (e instanceof HttpError) {
			return { id, error: e.message, success: undefined };
		}
		throw e;
	} finally {
		if (success) {
			Toast.success(`Doctor updated successfully`);
			redirect(`/doctor/${id}`);
		}
	}

	return { id, error: undefined, success: "Doctor updated successfully" };
}

export async function DeleteFile(url: any): Promise<any> {
	try {
		let response: any = await del(`v1/file-managements?path=${url}`);
		return response || {};
	} catch (e) {
	} finally {
	}
}
