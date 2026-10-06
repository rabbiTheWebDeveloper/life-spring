import AuthManager from "@/services/AuthManager";
import { ChildrenProp } from "@/types/ReacetHelpers";
import { UserType } from "@/types/User";
import { redirect } from "next/navigation";

interface Props {
	redirectUrl?: string;
}

function getTitle(userType: UserType) {
	switch (userType) {
		case UserType.admin: {
			return "Admin";
		}
		case UserType.agent: {
			return "Agent";
		}
	}
}

export default async function GuestLayout({ children, redirectUrl = "/dashboard" }: Props & ChildrenProp) {
	// if (await AuthManager.isNotLoggedIn) {
	// 	return <main>{children}</main>;
	// }
	// console.log(!AuthManager.isLoggedIn());
	if (await AuthManager.isLoggedIn()) {
		return redirect(redirectUrl);
	}

	return <main>{children}</main>;
}
