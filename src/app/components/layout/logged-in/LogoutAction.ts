"use server";
import { RedirectType, redirect } from "next/navigation";
import AuthManager from "@/services/AuthManager";

export default async function logout() {
	await AuthManager.logout();
	return redirect("/login", RedirectType.replace);
}
