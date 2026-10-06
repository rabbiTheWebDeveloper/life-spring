"use server";
import LoggedInLayout from "../components/layout/logged-in/LoggedInLayout";
import { ChildrenProp } from "@/types/ReacetHelpers";
import { AuthProvider } from "../(logged-in)/AuthContext";
import AuthManager from "@/services/AuthManager";
import { redirect } from "next/navigation";

export default async function AdminLoggedInLayout({ children }: ChildrenProp) {
	const isLoggedIn = await AuthManager.isLoggedIn();
	console.log("Layout logged in", isLoggedIn);
	if (!isLoggedIn) {
		redirect("/login");
	}

	return (
		<AuthProvider>
			<LoggedInLayout>{children}</LoggedInLayout>
			{process.env.NEXT_PUBLIC_APP_VERSION && (
				<div className="fixed bottom-1 right-2 z-50 text-[10px] text-gray-400 pointer-events-none">
					Version. {process.env.NEXT_PUBLIC_APP_VERSION.replace(/^v/i, "")}
				</div>
			)}
		</AuthProvider>
	);
}
