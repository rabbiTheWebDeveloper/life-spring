"use client";

import { useAuth } from "@/app/(logged-in)/AuthContext";
import Loader from "@/app/(logged-in)/dashboard/components/Loader";
import Sidebar from "@/app/components/sidebar/Sidebar";
import { ChildrenProp } from "@/types/ReacetHelpers";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SnackBar from "../../alerts/SnackBar";
import Title from "./Title";

interface Props {
	redirectUrl?: string;
	// userType: string;
}

const LoggedInLayout = ({ children, redirectUrl = "/login" }: Props & ChildrenProp) => {
	const { user, loading } = useAuth();
	const router = useRouter();


	useEffect(() => {
		// Ensure the user is not redirected until the loading state is false and user data is available
		if (!loading) {
			if (!user || user?.error === "Unauthorized") {
				console.log("redirect user", user)
				router.push(redirectUrl);
			}
		}
	}, [loading, router, user, redirectUrl]);

	return (
		<div className="flex items-center h-screen">
			{loading ? (
				<div className="w-[230px] h-full bg-primary-900 flex flex-col animate-pulse">
					<div className="mt-14 mx-4 mb-4">
						<div className="h-12 bg-gray-700 rounded w-full mb-6"></div>
						<div className="space-y-3">
							{Array.from({ length: 8 }).map((_, i) => (
								<div key={i} className="flex items-center gap-3">
									<div className="h-8 w-8 bg-gray-700 rounded"></div>
									<div className="h-4 bg-gray-700 rounded flex-1"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			) : (
				<Sidebar user={user} />
			)}
			<div className="flex flex-col w-full h-full">
				<header>
					{loading ? (
						<div className="bg-white border-b h-14 flex items-center justify-between px-4 animate-pulse">
							<div className="h-6 bg-gray-200 rounded w-32"></div>
							<div className="flex items-center gap-3">
								<div className="h-8 w-8 bg-gray-200 rounded-full"></div>
								<div className="h-4 bg-gray-200 rounded w-24"></div>
							</div>
						</div>
					) : (
						<Title user={user} />
					)}
				</header>
				<main className="bg-[#F5F6FA] overflow-y-auto flex-grow relative">
					<div className="pt-1 px-2">
						{loading ? (
							<div className="animate-pulse p-4">
								<div className="space-y-4">
									<div className="h-8 bg-gray-200 rounded w-64"></div>
									<div className="grid grid-cols-4 gap-4">
										{Array.from({ length: 4 }).map((_, i) => (
											<div key={i} className="bg-white rounded-lg p-4">
												<div className="h-6 bg-gray-200 rounded w-20 mb-2"></div>
												<div className="h-4 bg-gray-200 rounded w-32"></div>
											</div>
										))}
									</div>
									<div className="bg-white rounded-lg p-4">
										<div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
										<div className="space-y-2">
											{Array.from({ length: 5 }).map((_, i) => (
												<div key={i} className="h-12 bg-gray-100 rounded"></div>
											))}
										</div>
									</div>
								</div>
							</div>
						) : (
							children
						)}
					</div>
				</main>
			</div>
			<div className="flex justify-center bottom-0 w-full fixed">
				<SnackBar />
			</div>
		</div>
	);
};

export default LoggedInLayout;
