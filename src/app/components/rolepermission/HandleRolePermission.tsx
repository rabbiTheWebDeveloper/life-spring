"use client";
import { useAuth } from "@/app/(logged-in)/AuthContext";
import { useEffect, useState } from "react";

const RolePermissionChecker = ({ tag, name, children }: { tag: string; name: string; children: React.ReactNode }) => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null);
	const { user, loading } = useAuth();
	useEffect(() => {
		if (!user?.userRole?.permissions) {
			setHasPermission(false);
			return;
		}
		const checkPermission = user.userRole.permissions.some(
			(permission: any) => permission.tag === tag && permission.name === name
		);

		setHasPermission(checkPermission);
	}, [tag, name, user]);

	if (hasPermission === null) return null;

	return hasPermission ? <>{children}</> : null;
};

export default RolePermissionChecker;
