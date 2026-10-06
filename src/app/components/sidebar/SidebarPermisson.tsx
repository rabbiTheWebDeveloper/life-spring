"use client";
import { useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/app/(logged-in)/AuthContext";

interface SidebarPermissionProps {
	tag: string;
	children: ReactNode;
}

const SidebarPermission = ({ tag, children }: SidebarPermissionProps) => {
	const { user, loading } = useAuth();
	const [isAllowed, setIsAllowed] = useState<boolean>(false);

	useEffect(() => {
		if (!loading && user?.userRole?.permissions?.length) {
			const uniqueTags = new Set(user.userRole.permissions.map((perm: any) => perm?.tag));
			const hasPermission = uniqueTags.has(tag);
			setIsAllowed(hasPermission);
		}
	}, [loading, user, tag]);

	if (!isAllowed) return null;

	return <>{children}</>;
};

export default SidebarPermission;
