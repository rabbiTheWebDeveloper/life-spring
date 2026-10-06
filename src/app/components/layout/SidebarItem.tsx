//@ts-ignore
"use client";
import RolePermissionChecker from "@/app/components/rolepermission/HandleRolePermission";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {FaDotCircle} from "react-icons/fa";
import {MdOutlineKeyboardArrowDown} from "react-icons/md";

interface MenuItem {
	name: string;
	link: string;
	logo: string;
	counter?: number;
	children?: MenuItem[];
	tag?: string;
	action?: string;
}

export default function SidebarItem({menu}: any) {
	const [counter, setCounter] = useState(menu?.counter || 0);
	const pathname = usePathname();
	const [isExpanded, setIsExpanded] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setCounter(menu?.counter || 0);
	}, [menu?.counter]);

	const normalize = (url: string) => url?.split("?")[0];

	const isChildActive = menu?.children?.some((child: any) => pathname.startsWith(normalize(child?.link)));
	const isActive = pathname?.startsWith(normalize(menu?.link)) || isChildActive;

	const toggleMenu = () => {
		if(menu?.children) {
			setIsExpanded((prev: any) => !prev)
		}else{
			router.push(menu?.link);
		}

	};

	// // Render single menu item (no children)
	// if (!menu?.children?.length) {
	// 	return (
	// 		<Link
	// 			href={menu.link}
	// 			className={clsx("flex items-center gap-1 p-2 md:p-1 text-sms text-xs text-zinc-50", {
	// 				"text-primary-400 font-semibold": isActive,
	// 			})}
	// 		>
	// 			<Image src={menu.logo} alt={menu.name} width={20} height={20} />
	// 			<h2 className="text-xs whitespace-nowrap">{menu.name}</h2>
	// 			{counter > 0 && (
	// 				<span className="ml-auto bg-[#9b468a] text-white text-xs rounded-full px-2 py-0.5">{counter}</span>
	// 			)}
	// 		</Link>
	// 	);
	// }

	const activeColor = "text-white"
	const activeBackgroundColor = "bg-white/10"

	return (
		<>
			<div
				onClick={toggleMenu}
				className={`cursor-pointer flex items-center gap-3 px-2 py-[10px] hover:${activeBackgroundColor} hover:${activeColor}
				 font-normal text-sm ${isActive ? `${activeColor} ${!menu?.children ? `${activeBackgroundColor}` : ""}` :
					"text-white/90"}`}
			>
				{
					menu?.icon && <span>{menu?.icon}</span>
				}
				{/*<Image src={menu.logo} width={20} height={20} alt={menu.name} />*/}
				<h2 className="text-xs whitespace-nowrap">{menu.name}</h2>


				{menu?.children && (
					<MdOutlineKeyboardArrowDown size={19}
																		className={`ml-auto transition-transform font-medium text-white/90 ${isExpanded && "rotate-180"}`}/>
				)}


				{counter > 0 && !isExpanded && (
					<span className="ml-auto bg-[#9b468a] text-white text-xs rounded-full px-2 py-0.5">{counter}</span>
				)}
			</div>

			{menu?.children?.length > 0 && isExpanded && (
				<div className="ml-4">
					{menu?.children.map((child: any, index: any) => {
						const isChildRouteActive = pathname.startsWith(normalize(child.link));
						const hasPermission = child?.tag && child?.action;

						const linkElement = (
								<Link
								key={child?.link}
								href={child?.link}
								className={`flex items-center gap-3 px-2 py-[10px] my-2 text-xs font-normal whitespace-nowrap transition-colors duration-200
		${isChildRouteActive ? `${activeBackgroundColor} ${activeColor}` : `text-white/85 hover:${activeBackgroundColor} hover:${activeColor}`}`}
							>
								<p className="flex items-center gap-2 text-white/85">
									<FaDotCircle size={12} className="text-white/90"/>
									{child?.name}
								</p>

								{/* Uncomment if needed */}
								{/* {child.counter > 0 && (
		<span className="ml-auto bg-[#9A468A] text-white text-xs rounded-full px-2 py-0.5">
			{child.counter}
		</span>
	)} */}
							</Link>

						);

						return (
							<div key={index}>
								{hasPermission ? (
									<RolePermissionChecker tag={child?.tag} name={child?.action}>
										{linkElement}
									</RolePermissionChecker>
								) : (
									linkElement
								)}
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}
