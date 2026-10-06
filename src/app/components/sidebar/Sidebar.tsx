"use client";
import {getCounters} from "@/actions/GetCounters";
import SidebarItem from "@/app/components/layout/SidebarItem";
import SidebarPermission from "@/app/components/sidebar/SidebarPermisson";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useMemo, useState} from "react";
import {FaBars, FaUserMd} from "react-icons/fa";
import {
	MdClose,
	MdOutlineCalendarMonth,
	MdOutlinePermDeviceInformation,
	MdOutlineSettingsApplications
} from "react-icons/md";
import {FaRegUser} from "react-icons/fa6";
import {TbReport} from "react-icons/tb";
import {RiUserSettingsLine} from "react-icons/ri";

const Sidebar: React.FC<any> = ({user}: any) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const [loading, setLoading] = useState(true);
	const [appointmentCounter, setAppointmentCounter] = useState(0);

	const updateCounts = async () => {
		try {
			const data = await getCounters();
			setAppointmentCounter(data?.appointment);
		} catch (error) {
			console.error("Error fetching counters:", error);
		}
	};

	useEffect(() => {
		updateCounts();

		const intervalId = setInterval(updateCounts, 60 * 1000);
		return () => clearInterval(intervalId);
	}, []);

	const menus = useMemo<any>(() => {
		return [
			{
				section: "Main",
				items: [
					{name: "Dashboard", link: "/dashboard", logo: "/icons/dashboard.png"},
					{name: "Doctor List", link: "/doctor", logo: "/icons/doctors.png"},
					{name: "Patient", link: "/patient", logo: "/icons/patient.png"},
				],
			},
			{
				section: "Appointments",
				items: [
					{
						name: "Appointment",
						link: "/appointment?page=0",
						logo: "/icons/online.png",
						counter: appointmentCounter,
					},
				],
			},
		];
	}, [appointmentCounter]);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 1000);
	}, []);

	if (loading) {
		return (
			<aside
				style={{ backgroundColor: '#134014', boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
				className={`${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} overflow-y-auto sm:w-[16vw] border-r-2 min-w-[230px] h-full flex flex-col fixed top-0 sm:relative transition-transform duration-300 ease-in-out z-50`}
			>
				<div className="mt-[56px] md:mt-[40px] mx-0 flex flex-col mb-2">
					<div className="flex justify-center items-center">
						<Link href="/dashboard">
							{/*<Image src="/lifeSpringLogo.png" width={100} height={35} alt="LifeSpring logo"/>*/}
							<Image src="/lifeSpringLogoWhite.webp" width={120} height={60} alt="LifeSpring logo"/>
						</Link>
						<button className="md:hidden text-2xl absolute top-4 right-2" onClick={() => setIsSidebarOpen(false)}>
							<MdClose className="text-red-500"/>
						</button>
					</div>
					{/* Loading skeleton UI */}
					<div className="animate-pulse p-4 space-y-4 mt-10">
						{menus.map((menuGroup: any) => (
							<div key={menuGroup.section + menuGroup?.items.length}>
								{/*<div className="font-semibold text-sm">{menuGroup.section}</div>*/}
								{menuGroup.items.map((menu: any) => (
									<div key={menu.name} className="flex items-center gap-3 mb-2">
										<div className="bg-gray-100 h-8 w-8 rounded"/>
										<div className="flex-1 h-4 bg-gray-100 rounded"/>
									</div>
								))}
							</div>
						))}
					</div>
				</div>
			</aside>
		);
	}

	return (
		<>
			<aside
				className={`${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} overflow-hidden sm:w-[16vw] border-r-2 min-w-[200px] max-w-[250px] h-screen flex flex-col fixed top-0 sm:relative transition-transform duration-300 ease-in-out z-50`}
				style={{ backgroundColor: '#134014' }}
			>
				<div className="flex flex-col h-full overflow-hidden">
					<div className="flex-shrink-0 mt-[56px] md:mt-[25px] mx-4 mb-4">
						<div className="flex justify-center items-center relative">
							<Link href="/">
								<Image src="/lifeSpringLogoWhite.webp" width={120} height={60} alt="LifeSpring logo"/>
							</Link>
							<button className="md:hidden text-2xl absolute top-6 right-2" onClick={() => setIsSidebarOpen(false)}>
								<MdClose className="text-red-500"/>
							</button>
						</div>
					</div>

					<div className="flex flex-col flex-grow overflow-y-auto mt-4 px-4">
						<nav className="flex-1">
							<ul>
									<SidebarPermission tag="dashboard">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "Dashboard",
													link: "/dashboard",
													logo: "/icons/dashboard.png",
													icon: <FaBars size={17}/>
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>

									<SidebarPermission tag="doctor">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "Doctors",
													link: "/doctor",
													logo: "/icons/doctors.png",
													icon: <FaUserMd size={17}/>,
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>

									<SidebarPermission tag="patient">
										<li className="mb-2">
											<SidebarItem
												menu={{name: "Patients", link: "/patient?size=10&page=0", icon: <FaRegUser size={17}/>}}
												user={user}
											/>
										</li>
									</SidebarPermission>

									<SidebarPermission tag="appointment">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "Appointment",
													link: "/appointment?page=0",
													logo: "/icons/online.png",
													counter: appointmentCounter,
													icon: <MdOutlineCalendarMonth size={17}/>
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>

									<SidebarPermission tag="administration">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "Basic Information",
													logo: "/icons/admin.png",
													icon: <MdOutlinePermDeviceInformation size={17}/>,
														isOnlyForAdmin: false,
													children: [
														{
															name: "Organization",
															link: "/organization",
															logo: "/icons/dashboard.png",
															tag: "organization",
															action: "list",
														},
														{
															name: "Branch",
															link: "/branch",
															logo: "/icons/dashboard.png",
															tag: "branch",
															action: "list",
														},
													],
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>
									<SidebarPermission tag="reports">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "Reports",
													logo: "/icons/admin.png",
													isOnlyForAdmin: false,
													icon: <TbReport size={17}/>,
													children: [
														{
															name: "Doctor Revenue",
															link: "/doctor-revenue?page=0",
															logo: "/icons/dashboard.png",
															tag: "doctor-revenue-report",
															action: "list",
														},
														{
															name: "Refund Report",
															link: "/refund-report?page=0",
															logo: "/icons/dashboard.png",
															tag: "refund-report",
															action: "list",
														},
														{
															name: "Payment Report",
															link: "/payment-report?page=0",
															logo: "/icons/dashboard.png",
															tag: "payment-report",
															action: "list",
														},
														{
															name: "Daily Patients",
															link: "/daily-patients?page=0",
															logo: "/icons/dashboard.png",
															tag: "daily-patient-list",
															action: "list",
														},
														{
															name: "Available Appointment Slot",
															link: "/available-slot-report?page=0",
															logo: "/icons/dashboard.png",
															tag: "available-appointment-slot",
															action: "list",
														},
													],
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>
									<SidebarPermission tag="administration">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "Administration",
													logo: "/icons/admin.png",
													isOnlyForAdmin: false,
													icon: <MdOutlineSettingsApplications size={17} />,
													children: [
														// {
														// 	name: "Settlement",
														// 	link: "/settlement",
														// 	logo: "/icons/management.png",
														// 	tag: "administration-settlements",
														// 	action: "list",
														// },
														// {
														// 	name: "Invoice",
														// 	link: "/invoice",
														// 	logo: "/icons/management.png",
														// 	tag: "administration-invoice",
														// 	action: "list",
														// },
														{
															name: "Payment Gateway",
															link: "/payment-gateway",
															logo: "/icons/management.png",
															tag: "administration-payment-gateway",
															action: "list",
														},
														{
															name: "Payment Method",
															link: "/payment-method",
															logo: "/icons/management.png",
															tag: "administration-payment-gateway",
															action: "list",
														},
													],
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>

									<SidebarPermission tag="user-role-permission">
										<li className="mb-2">
											<SidebarItem
												menu={{
													name: "User Role Permission",
													icon: <RiUserSettingsLine size={17} />,
													children: [
														{name: "Users", link: "/user", tag: "user-role-permission-user", action: "list"},
														{
															name: "Role",
															link: "/role",
															tag: "user-role-permission-role",
															action: "list",
														},
														{
															name: "Permission",
															link: "/permission",
															tag: "user-role-permission-permission",
															action: "list",
														},
													],
												}}
												user={user}
											/>
										</li>
									</SidebarPermission>
								</ul>
							</nav>
					</div>
				</div>
			</aside>
			<button className="md:hidden text-2xl fixed top-4 left-4 z-50" onClick={() => setIsSidebarOpen(true)}>
				<FaBars className="text-primary-400" size={25}/>
			</button>
		</>
	);
};

export default Sidebar;
