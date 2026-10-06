// @ts-nocheck
"use server";

import { post } from "@/api/ApiClient";
import { HttpError } from "@/api/HttpStatusChecks";
import { DefaultFormActionResult } from "@/app/components/types/Form";
import AuthManager from "@/services/AuthManager";
import { RedirectType, redirect } from "next/navigation";
import {catchErrorMessage} from "@/helper/error";

async function login(uri: string, _: DefaultFormActionResult, formData: FormData) {
	const emailRegex: any = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const email = formData.get("email");
	const password = formData.get("password");

	if (!email || !password) {
		const missingFields = [];
		if (!email) missingFields.push("Email");
		if (!password) missingFields.push("Password");
		return {
			error: `${missingFields.join(" and ")} ${missingFields.length > 1 ? "are" : "is"} required.`,
			success: undefined,
		};
	}
	const trimmedEmail: any = email.trim();
	if (!emailRegex.test(trimmedEmail)) {
		return { error: "Enter a valid email.", success: undefined };
	}
	if (typeof email !== "string" || typeof password !== "string") {
		return { error: "Email and password must be valid strings.", success: undefined };
	}

	try {
		const response: any = await post<any>(uri, {
			email: trimmedEmail,
			password,
		});

		if (response?.success) {
			console.log("Successfully logged in", response);
			await AuthManager.login(response?.data);
			redirect("/dashboard", RedirectType.replace);
		}else{
			console.error("Unauthorized access:", response);
			return { error: response.message, success: undefined };
		}



	}catch (error) {
		// let Next.js handle its special redirect error
		if (error.digest?.startsWith("NEXT_REDIRECT")) {
			throw error;
		}
		// only handle actual API/logic errors here
		if (error instanceof HttpError) {
			return { error: error?.message, success: undefined };
		}

		const errorMessage = catchErrorMessage(error)

		return { error: errorMessage, success: undefined };
	}
}

export default async function loginAdmin(r: DefaultFormActionResult, formData: FormData) {
	return await login("v1/auth/login", r, formData);
}
