"use client";
import React, { use } from "react";
import { Dropdown, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import GoBack from "@/app/components/layout/logged-in/GoBack";
import logout from "@/app/components/layout/logged-in/LogoutAction";

interface User {
	profilePic?: string;
	role: string;
	userRole?: { name: string };
	firstName: string;
	lastName: string;
	designation: string;
}

interface TitleProps {
	user: User;
}

const Title: React.FC<TitleProps> = ({ user }) => {
	const pathname = usePathname();
	const router = useRouter();
	const handleProfileClick = () => {
		router.push("/profile");
	};

	const profileMenu = (
		<Menu>
			<Menu.Item icon={<UserOutlined />} onClick={handleProfileClick}>
				Profile
			</Menu.Item>
			<Menu.Item icon={<LogoutOutlined />} key="logout" onClick={() => logout()}>
				<button type="submit" className={"w-[100%] text-start"}>
					Logout
				</button>
			</Menu.Item>
		</Menu>
	);

	const customName = (value: any) => {
		return convertUrlToText(value);
	};
	const convertUrlToText = (url: string): string => {
		const cleanedUrl = url.replace(/^\/|\/$/g, "");
		return cleanedUrl
			.split("/")
			.filter((part: string) => !/\d/.test(part))
			.join(" ");
	};

	return (
		<div className="flex  justify-between items-center w-full bg-white">
			<div className="flex items-center gap-2 ml-12 md:ml-2">
				{pathname != "/dashboard" && <GoBack />}

				<p className={`font-bold text-primary-600 ${pathname == "/dashboard" && "ms-10"} capitalize lg:ms-0`}>
					{customName(pathname)}
				</p>
			</div>

			<div className="p-2.5">
				<Dropdown overlay={profileMenu} placement="bottomRight">
					<div className="grid grid-cols-12  rounded-xl gap-[10px]  cursor-pointer">
						<div className="col-span-3">
							<img src={user?.profilePic || "/icons/admin.png"} alt="profile" className="w-8 h-8 rounded-full" />
						</div>
						<div className="col-span-7">
							<h1 className="flex capitalize items-center gap-1 text-sm text-gray-600 font-semibold">
								{`${user?.firstName} ${user?.lastName}`}
								<svg
									stroke="currentColor"
									fill="none"
									strokeWidth="1.5"
									viewBox="0 0 24 24"
									aria-hidden="true"
									className="text-green-500"
									height="17"
									width="17"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
									></path>
								</svg>
							</h1>
							<p className="text-[11px] -mt-[2px] text-gray-500 text-start">{user?.userRole?.name || "-"}</p>
						</div>
					</div>
				</Dropdown>
			</div>
		</div>
	);
};

export default Title;
