"use server";
import { redirect, RedirectType } from "next/navigation";
import { cookies } from "next/headers";

/**
 * Remove all auth-related cookies.
 */
	export async function removeCookies(): Promise<void> {
	const cookieStore = cookies();
	cookieStore.delete("userId");
	cookieStore.delete("accessToken");
	cookieStore.delete("refreshToken");
}

/**
 * Handles refresh token failure (e.g., expired token).
 * Clears cookies and forces redirect to login.
 */
export async function callRefreshToken(): Promise<void> {
	try {
		// Remove tokens from storage
		await removeCookies()
		redirect("/login")

	} catch (err: any) {
		if (err?.digest?.startsWith("NEXT_REDIRECT")) {
			// Let Next.js handle its internal redirect error
			throw err;
		}

		console.error("Unexpected error in callRefreshToken:", err);
		// Fallback: ensure user is redirected even on unexpected error
		redirect("/login", RedirectType.replace);
	}
}
